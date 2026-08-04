# -*- coding: utf-8 -*-
from __future__ import annotations

import argparse
import subprocess
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Iterator
from zipfile import ZipFile

import fitz
from lxml import etree


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_THESIS = Path("/WorkSpace/Data/PersonalHomepage/毕业论文-20260804-15.docx")
DEFAULT_PUBLICATIONS = Path("/WorkSpace/Data/Personal Homepage/Publications")
DEFAULT_OUTPUT = PROJECT_ROOT / "images" / "research" / "figures"


@dataclass(frozen=True)
class PdfFigure:
    source: str
    page: int  # 从 0 开始
    clip: tuple[float, float, float, float]
    output: str


DOCX_FIGURES = {
    "rId21": "trajectory-registration.png",  # 图 3.3
    "rId78": "publication-gla-nerf.png",  # 图 3.4
    "rId96": "publication-eidc.png",  # 图 4.5
    "rId99": "trajectory-segmentation.png",  # 图 4.8
    "rId103": "trajectory-semantic-field.png",  # 图 4.12
}

PDF_FIGURES = (
    PdfFigure("UPI_NeRF_PMB.pdf", 2, (120, 50, 560, 207), "publication-upi-nerf.png"),
    PdfFigure(
        "Prediction_for_Loosening_Life_of_Bolted_Joints_Using_IMUs_With_Dimensionality_Reduction.pdf",
        1,
        (45, 48, 568, 235),
        "publication-life-prediction.png",
    ),
    PdfFigure(
        "Neural-Guided_RRT_Learning-Based_Planning_of_Entry_Point_and_Puncture_Path_for_Steerable_Bevel-Tip_Needle_Insertion.pdf",
        1,
        (302, 55, 565, 207),
        "trajectory-puncture-planning.png",
    ),
    PdfFigure(
        "Neural-Guided_RRT_Learning-Based_Planning_of_Entry_Point_and_Puncture_Path_for_Steerable_Bevel-Tip_Needle_Insertion.pdf",
        3,
        (35, 45, 560, 258),
        "publication-neural-rrt.png",
    ),
)

THESIS_RENDERED_FIGURES = (
    PdfFigure("", 88, (85.1, 159.2, 523.0, 324.1), "trajectory-registration.png"),
    PdfFigure("", 90, (85.1, 99.2, 523.0, 342.8), "publication-gla-nerf.png"),
)


def extract_docx_figures(thesis: Path, output_dir: Path) -> None:
    relationship_ns = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}
    with ZipFile(thesis) as archive:
        relationships = etree.fromstring(archive.read("word/_rels/document.xml.rels"))
        targets = {
            node.get("Id"): node.get("Target")
            for node in relationships.xpath(".//r:Relationship", namespaces=relationship_ns)
            if node.get("Id") in DOCX_FIGURES
        }
        missing = set(DOCX_FIGURES) - set(targets)
        if missing:
            raise ValueError(f"新版博士论文缺少预期图片关系：{sorted(missing)}")

        for relationship_id, output_name in DOCX_FIGURES.items():
            target = targets[relationship_id]
            if target is None:
                raise ValueError(f"图片关系 {relationship_id} 没有目标文件")
            media_path = f"word/{target.lstrip('/')}"
            (output_dir / output_name).write_bytes(archive.read(media_path))


def save_pdf_figure(document: fitz.Document, figure: PdfFigure, output_dir: Path) -> None:
    matrix = fitz.Matrix(3, 3)  # 216 dpi，保证图中文字在高分屏上仍清晰。
    page = document[figure.page]
    pixmap = page.get_pixmap(matrix=matrix, clip=fitz.Rect(*figure.clip), alpha=False)
    pixmap.save(output_dir / figure.output)


def extract_pdf_figures(publications_dir: Path, output_dir: Path) -> None:
    for figure in PDF_FIGURES:
        source = publications_dir / figure.source
        with fitz.open(source) as document:
            save_pdf_figure(document, figure, output_dir)


@contextmanager
def render_thesis(thesis: Path) -> Iterator[Path]:
    # 图 3.3/3.4 含 Word 叠加的公式与标签，必须先渲染整页才能完整保留。
    with TemporaryDirectory(prefix="zi-fang-thesis-") as temp_dir:
        subprocess.run(
            ["libreoffice", "--headless", "--convert-to", "pdf", "--outdir", temp_dir, str(thesis)],
            check=True,
            capture_output=True,
            text=True,
        )
        pdf_path = Path(temp_dir) / f"{thesis.stem}.pdf"
        if not pdf_path.exists():
            raise FileNotFoundError(f"LibreOffice 未生成预期 PDF：{pdf_path}")
        yield pdf_path


def extract_rendered_thesis_figures(thesis: Path, output_dir: Path) -> None:
    with render_thesis(thesis) as pdf_path, fitz.open(pdf_path) as document:
        for figure in THESIS_RENDERED_FIGURES:
            save_pdf_figure(document, figure, output_dir)


def main() -> None:
    parser = argparse.ArgumentParser(description="从新版博士论文和论文 PDF 提取个人主页指定图件。")
    parser.add_argument("--thesis", type=Path, default=DEFAULT_THESIS, help="博士论文 DOCX 路径")
    parser.add_argument("--publications", type=Path, default=DEFAULT_PUBLICATIONS, help="论文 PDF 目录")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="主页图片输出目录")
    args = parser.parse_args()

    output_dir = args.output.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    extract_docx_figures(args.thesis.resolve(), output_dir)
    extract_rendered_thesis_figures(args.thesis.resolve(), output_dir)
    extract_pdf_figures(args.publications.resolve(), output_dir)


if __name__ == "__main__":
    main()
