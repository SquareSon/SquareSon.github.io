from __future__ import annotations

import hashlib
import hmac
import json
import os
import time
from collections import OrderedDict
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field

from rag.local.retrieval import LocalRetriever


SHARED_SECRET = os.environ.get("LOCAL_RAG_HMAC_SECRET", "")
MAX_CLOCK_SKEW_SECONDS = 60
SEEN_NONCES: OrderedDict[str, float] = OrderedDict()
RETRIEVER = LocalRetriever()


class RetrieveRequest(BaseModel):
    query: Annotated[str, Field(min_length=1, max_length=1000)]
    locale: str = "zh"


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not SHARED_SECRET:
        raise RuntimeError("LOCAL_RAG_HMAC_SECRET is required")
    RETRIEVER.warm()
    yield


app = FastAPI(title="Zi Fang Local RAG", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)


@app.get("/v1/health")
async def health(request: Request):
    verify_signed_request(request, b"")
    return {"ok": True, "retrieval": RETRIEVER.health()}


@app.post("/v1/retrieve")
async def retrieve(request: Request):
    raw_body = await request.body()
    verify_signed_request(request, raw_body)
    try:
        payload = RetrieveRequest.model_validate_json(raw_body)
    except Exception as error:
        raise HTTPException(status_code=400, detail="invalid_request") from error

    started = time.perf_counter()
    evidence = RETRIEVER.retrieve(payload.query, "en" if payload.locale == "en" else "zh")
    latency_ms = round((time.perf_counter() - started) * 1000, 1)
    print(json.dumps({"event": "retrieve", "evidenceCount": len(evidence), "latencyMs": latency_ms}))
    return {"evidence": [item.public_dict() for item in evidence], "latencyMs": latency_ms}


def verify_signed_request(request: Request, raw_body: bytes) -> None:
    timestamp = request.headers.get("x-rag-timestamp", "")
    nonce = request.headers.get("x-rag-nonce", "")
    signature = request.headers.get("x-rag-signature", "")
    try:
        timestamp_value = int(timestamp)
    except ValueError as error:
        raise HTTPException(status_code=401, detail="invalid_signature") from error
    now = int(time.time())
    if abs(now - timestamp_value) > MAX_CLOCK_SKEW_SECONDS or not nonce or len(nonce) > 128:
        raise HTTPException(status_code=401, detail="expired_signature")
    cleanup_nonces(now)
    if nonce in SEEN_NONCES:
        raise HTTPException(status_code=409, detail="replayed_request")
    body_hash = hashlib.sha256(raw_body).hexdigest()
    canonical = "\n".join([request.method.upper(), request.url.path, timestamp, nonce, body_hash])
    expected = hmac.new(SHARED_SECRET.encode("utf-8"), canonical.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status_code=401, detail="invalid_signature")
    SEEN_NONCES[nonce] = now + MAX_CLOCK_SKEW_SECONDS


def cleanup_nonces(now: int) -> None:
    while SEEN_NONCES:
        _, expiry = next(iter(SEEN_NONCES.items()))
        if expiry > now:
            break
        SEEN_NONCES.popitem(last=False)
    while len(SEEN_NONCES) > 2_000:
        SEEN_NONCES.popitem(last=False)
