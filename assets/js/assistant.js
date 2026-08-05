(() => {
  const root = document.querySelector('[data-assistant]');
  if (!root) return;

  const locale = root.dataset.locale === 'en' ? 'en' : 'zh';
  const endpoints = Array.from(new Set([
    root.dataset.ragEndpoint,
    root.dataset.ragFallbackEndpoint,
  ].filter(Boolean).map((value) => value.replace(/\/$/, ''))));
  let activeEndpoint = endpoints[0] || '';
  const embeddedWebView = /MicroMessenger|QQ\/|AlipayClient|AliApp|Taobao|TBS|; wv\)|WebView/i.test(navigator.userAgent || '');
  const bufferedResponses = embeddedWebView || typeof ReadableStream !== 'function';
  const form = root.querySelector('[data-assistant-form]');
  const source = root.querySelector('[data-assistant-source]');
  const model = root.querySelector('[data-assistant-model]');
  const question = root.querySelector('[data-assistant-question]');
  const submit = root.querySelector('[data-assistant-submit]');
  const reset = root.querySelector('[data-assistant-reset]');
  const transcript = root.querySelector('[data-assistant-transcript]');
  const status = root.querySelector('.assistant-status');
  const statusText = root.querySelector('[data-assistant-status]');
  let history = [];

  const copy = {
    zh: {
      readyStatic: '静态 FAQ 与站内资料搜索已就绪',
      readyRag: 'RAG 已连接；异常时将明确说明原因',
      localUnavailable: '本地资料检索服务暂不可用',
      requestFailedStatus: '请求处理失败',
      localUnavailableAnswer: '目前无法连接本地资料检索服务。为避免没有依据的生成回答，系统未调用模型。请稍后重试，或使用站内资料搜索。',
      localProcessingFailed: '本地 RAG 编码或重排发生错误，系统未调用模型。请稍后重试；若持续出现，请检查本机检索服务日志。',
      requestFailed: '本次请求未完成：',
      connectionFailed: '无法连接聊天服务；请检查网络，或在系统浏览器中打开本站后重试。',
      emptyModelResponse: '模型未返回可显示的内容。本次请求未形成回答，请重试或切换模型。',
      providerError: '所选模型服务返回错误，系统未生成回答。请更换模型或 API 来源后重试。',
      modelUnavailable: '所选模型当前不可用，系统未生成回答。请更换模型或 API 来源后重试。',
      budgetOrRateLimit: '当前请求触发了预算或访问频率限制，系统未生成回答。请稍后重试。',
      turnstile: '人机验证未通过或已过期，系统未生成回答。请刷新页面后重试。',
      insufficientEvidence: '公开资料中没有足够证据支持回答，系统未调用模型。请换一种问法。',
      working: '正在检索公开材料……',
      noResult: '静态资料中没有找到足够相关的内容。可尝试询问研究方向、博士论文、项目、论文列表、教育经历或技能。',
      staticPrefix: '静态资料检索：',
      source: '来源',
      ask: '提问',
      user: '你',
      assistant: '研究助理',
      autoSource: '自动 / 可靠路由',
      autoModel: '自动 / 静态降级',
    },
    en: {
      readyStatic: 'Static FAQ and on-page search are ready',
      readyRag: 'RAG is connected; any error will be shown clearly',
      localUnavailable: 'Local material retrieval is temporarily unavailable',
      requestFailedStatus: 'Request processing failed',
      localUnavailableAnswer: 'The local material retrieval service is unavailable. To avoid an unsupported generated answer, no model was called. Please try again later or use the on-page material search.',
      localProcessingFailed: 'Local RAG encoding or reranking failed. No model was called; please retry later and check the local retrieval service logs if it persists.',
      requestFailed: 'The request did not complete: ',
      connectionFailed: 'The chat service could not be reached. Check the network or open this site in the system browser and retry.',
      emptyModelResponse: 'The model returned no displayable content. No answer was produced; please retry or switch models.',
      providerError: 'The selected model service returned an error. No answer was generated; choose another model or API source and retry.',
      modelUnavailable: 'The selected model is unavailable. No answer was generated; choose another model or API source and retry.',
      budgetOrRateLimit: 'The request hit a budget or rate limit. No answer was generated; please retry later.',
      turnstile: 'Human verification failed or expired. No answer was generated; refresh the page and retry.',
      insufficientEvidence: 'The public materials do not provide enough evidence for an answer, so no model was called. Please rephrase the question.',
      working: 'Searching public materials…',
      noResult: 'The static materials do not contain a sufficiently relevant answer. Try asking about research areas, the dissertation, projects, publications, education, or skills.',
      staticPrefix: 'Static material search: ',
      source: 'Source',
      ask: 'Ask',
      user: 'You',
      assistant: 'Research assistant',
      autoSource: 'Auto / resilient routing',
      autoModel: 'Auto / static fallback',
    },
  }[locale];

  const documents = locale === 'en' ? [
    { keywords: 'research areas focus 3d perception embodied intelligence medical robotics ultrasound reconstruction registration semantics navigation', answer: 'Zi Fang studies four connected directions: joint optimization of instrument pose, image pose, deformation, and representation for deformable 2D/3D registration; ultrasound canonicalization with multi-task 2D semantic segmentation; NeRF/3DGS inverse rendering and semantic fields with acoustic priors; and origami puncture robots with path planning.', label: 'Research interests', href: '/en/#research' },
    { keywords: 'thesis dissertation thyroid ultrasound problem contribution', answer: 'The dissertation develops an ultrasound-guided thyroid puncture workflow spanning observation normalization, continuous reconstruction and registration, semantic modeling, and robot navigation.', label: 'Dissertation overview', href: '/en/#research' },
    { keywords: 'gla nerf multi sweep registration alignment global local pose', answer: 'GLA-NeRF separates multi-sweep misalignment into global sweep-level bias and local frame-level error, then jointly optimizes poses and a neural field using appearance, geometric consistency, and continuous-trajectory constraints.', label: 'GLA-NeRF · PMB 2026', href: '/en/#selected-work' },
    { keywords: 'upi nerf ultrasound physics acoustic inverse rendering research manuscript', answer: 'UPI-NeRF introduces ultrasound-physics priors into neural inverse rendering to model view-dependent acoustic formation and improve cross-view reconstruction consistency.', label: 'UPI-NeRF · Research manuscript', href: '/en/#selected-work' },
    { keywords: 'publication paper full list thirteen illustrated order', answer: 'The page lists 13 public papers and research manuscripts. Five are illustrated in this order: GLA-NeRF, UPI-NeRF, EIDC, Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction, and Neural-Guided RRT*.', label: 'Publications', href: '/en/#publications' },
    { keywords: 'education school high school university zhenhai ningbo sjtu', answer: 'Zi Fang attended Zhenhai High School of Ningbo from 2014 to 2017, earned a B.Eng. at Shanghai Jiao Tong University from 2017 to 2021, and pursued a Ph.D. there from 2021 to 2026.', label: 'Education', href: '/en/#about' },
    { keywords: 'skills technical stack large language model llm rag harness openclaw pytorch lightning tensorflow jax matlab simulink nerf 3dgs diffusion vla pybullet isaac pyqt csharp stm32 altium catia solidworks ansys adams english cet', answer: 'Zi Fang works with LLM applications including Vibe coding, OpenClaw, RAG, and Harness; AI frameworks including PyTorch/Lightning, TensorFlow, JAX, and MATLAB/Simulink; robotic 3D perception tools including NeRF, 3DGS, Diffusion, VLA, PyBullet, and Isaac; and embedded, interface, circuit, mechanical-design, and simulation tools including PyQt/C#, STM32, Altium, CATIA, SolidWorks, Ansys, and Adams. He completed an English-taught undergraduate curriculum and scored 595 on CET-4 and 547 on CET-6.', label: 'Skills', href: '/en/#skills' },
  ] : [
    { keywords: '研究 方向 三维 感知 具身 智能 医疗 机器人 超声 重建 配准 语义 导航', answer: '方子的研究由四条相互衔接的方向构成：器械、影像位姿与形变、表征联合优化的 2D/3D 可变形配准；超声规范化增强与多任务二维语义分割；融合声学物理先验的 NeRF/3DGS 三维逆渲染与语义场；折纸穿刺手术机器人与穿刺路径规划。', label: '研究方向', href: '/#research' },
    { keywords: '博士 论文 甲状腺 超声 问题 贡献', answer: '博士论文面向甲状腺超声引导穿刺，研究链条涵盖观测规范化、连续重建与配准、语义建模以及机器人导航。', label: '博士论文概览', href: '/#research' },
    { keywords: 'gla nerf 多扫查 配准 全局 局部 位姿', answer: 'GLA-NeRF 把多扫查偏差分成扫查级全局偏差与帧级局部误差，通过外观、几何一致性和连续轨迹约束联合优化位姿与神经场。', label: 'GLA-NeRF · PMB 2026', href: '/#selected-work' },
    { keywords: 'upi nerf 超声 物理 声学 逆 渲染 研究 稿件', answer: 'UPI-NeRF 将超声声学物理先验引入神经逆渲染，建模随视角变化的声学成像过程，并增强跨视角重建的一致性。', label: 'UPI-NeRF · 研究稿件', href: '/#selected-work' },
    { keywords: '论文 发表 文章 十三 图文 顺序', answer: '页面收录 13 篇公开论文与研究稿件，其中 5 篇按顺序图文展示：GLA-NeRF、UPI-NeRF、EIDC、Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction，以及 Neural-Guided RRT*。', label: '论文列表', href: '/#publications' },
    { keywords: '教育 经历 高中 学校 镇海 宁波 交大', answer: '方子于 2014—2017 年就读宁波镇海中学，2017—2021 年在上海交通大学攻读学士学位，2021—2026 年继续在上海交通大学攻读博士学位。', label: '教育经历', href: '/#about' },
    { keywords: '技能 技术栈 大模型 应用 vibe coding openclaw rag harness 人工智能 pytorch lightning tensorflow jax matlab simulink 机器人 三维 感知 nerf 3dgs diffusion vla pybullet isaac 嵌入式 结构 设计 pyqt c# stm32 altium catia solidworks ansys adams 英语 外语 cet', answer: '方子的技能包括：Vibe coding、OpenClaw、RAG 与 Harness 等大模型应用；PyTorch/Lightning、TensorFlow、JAX 与 MATLAB/Simulink 等人工智能框架；NeRF、3DGS、Diffusion、VLA、PyBullet 与 Isaac 等机器人三维感知和仿真工具；以及 PyQt/C#、STM32、Altium、CATIA、SolidWorks、Ansys 与 Adams 等界面、嵌入式、电路、结构设计和仿真工具。本科课程为全英教学，CET-4 595 分、CET-6 547 分。', label: '技能', href: '/#skills' },
  ];

  function setMode(mode, text) {
    status.dataset.mode = mode;
    statusText.textContent = text;
  }

  function scrollTranscript() {
    transcript.scrollTop = transcript.scrollHeight;
  }

  function appendMessage(role, text = '') {
    const message = document.createElement('article');
    message.className = `assistant-message assistant-message--${role}`;
    const label = document.createElement('div');
    label.className = 'assistant-message-label';
    label.textContent = role === 'user' ? copy.user : copy.assistant;
    const content = document.createElement('div');
    content.className = 'assistant-message-content';
    content.textContent = text;
    const sources = document.createElement('ul');
    sources.className = 'assistant-message-sources';
    message.append(label, content, sources);
    transcript.appendChild(message);
    scrollTranscript();
    return { content, sources };
  }

  function renderSources(container, sources) {
    container.replaceChildren();
    sources.forEach((item) => {
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.href || '#';
      link.textContent = `${copy.source}: ${item.label}`;
      row.appendChild(link);
      container.appendChild(row);
    });
  }

  function clearConversation() {
    history = [];
    transcript.replaceChildren();
    question.focus();
  }

  function tokens(value) {
    const normalized = value.normalize('NFKC').toLowerCase();
    const latin = normalized.match(/[a-z0-9][a-z0-9.+*-]{1,}/g) || [];
    const hanRuns = normalized.match(/[\u3400-\u9fff]+/g) || [];
    const han = hanRuns.flatMap((run) => {
      const chars = Array.from(run);
      return chars.concat(chars.slice(0, -1).map((char, index) => char + chars[index + 1]));
    });
    return Array.from(new Set(latin.concat(han)));
  }

  function staticSearch(value) {
    const queryTokens = tokens(value);
    const ranked = documents.map((document) => {
      const haystack = new Set(tokens(`${document.keywords} ${document.answer}`));
      const score = queryTokens.reduce((total, token) => total + (haystack.has(token) ? (token.length > 1 ? 2 : 1) : 0), 0);
      return { document, score };
    }).sort((a, b) => b.score - a.score);
    const match = ranked[0];
    if (!match || match.score < 2) return { answer: copy.noResult, sources: [] };
    return { answer: copy.staticPrefix + match.document.answer, sources: [match.document] };
  }

  function setSelectOptions(select, entries, initial, format) {
    const previous = select.value;
    select.replaceChildren(initial);
    entries.forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.textContent = format(entry);
      select.appendChild(option);
    });
    if ([...select.options].some((option) => option.value === previous)) select.value = previous;
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function fetchApi(path, options = {}, retries = 0) {
    if (!endpoints.length) throw new Error('network_unavailable');
    let failure = new Error('network_unavailable');
    const ordered = [activeEndpoint, ...endpoints.filter((item) => item !== activeEndpoint)];
    for (const baseUrl of ordered) {
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          const response = await fetch(`${baseUrl}${path}`, options);
          if (response.ok) {
            activeEndpoint = baseUrl;
            return response;
          }
          failure = new Error(`http_${response.status}`);
          break;
        } catch {
          failure = new Error('network_unavailable');
          if (attempt < retries) await wait(350 * (attempt + 1));
        }
      }
    }
    throw failure;
  }

  async function loadModels() {
    if (!activeEndpoint) return;
    try {
      const response = await fetchApi(`/api/models?source=${encodeURIComponent(source.value)}`, { headers: { accept: 'application/json' } }, 2);
      const payload = await response.json();
      const gateways = Array.isArray(payload.gateways) ? payload.gateways : [];
      setSelectOptions(source, gateways, new Option(copy.autoSource, 'auto'), (entry) => entry.label);
      source.disabled = gateways.length <= 1;
      const models = Array.isArray(payload.models) ? payload.models : [];
      setSelectOptions(model, models, new Option(copy.autoModel, 'auto'), (entry) => `${entry.label} · ${entry.model}`);
      model.disabled = models.length === 0;
      setMode(models.length ? 'rag' : 'static', models.length ? copy.readyRag : copy.readyStatic);
    } catch {
      source.disabled = true;
      model.disabled = true;
      setMode('error', copy.connectionFailed);
    }
  }

  async function askRag(value, message) {
    const response = await fetchApi('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream, application/json' },
      body: JSON.stringify({
        query: value,
        model: model.value,
        source: source.value,
        locale,
        history,
        // Embedded WebViews receive a complete JSON answer, avoiding their
        // inconsistent handling of cross-origin streaming response bodies.
        stream: !bufferedResponses,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const payload = await response.json();
      if (payload.answer) {
        renderSources(message.sources, Array.isArray(payload.citations) ? payload.citations : []);
        return payload.answer;
      }
      throw new Error(payload.reason || 'degraded');
    }

    if (!response.body) throw new Error('empty_stream');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let result = '';
    const sources = [];
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      buffer += decoder.decode(part.value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || '';
      for (const event of events) {
        const data = event.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('');
        if (!data) continue;
        const payload = JSON.parse(data);
        if (payload.type === 'delta' && payload.text) {
          result += payload.text;
          message.content.textContent = result;
          scrollTranscript();
        } else if (payload.type === 'citation') {
          sources.push({ label: payload.label, href: payload.href });
          renderSources(message.sources, sources);
        } else if (payload.type === 'degraded') {
          throw new Error(payload.reason || 'stream_degraded');
        }
      }
    }
    if (!result) throw new Error('empty_answer');
    return result;
  }

  root.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => {
      question.value = button.dataset.question || '';
      question.focus();
    });
  });

  source.addEventListener('change', loadModels);
  reset.addEventListener('click', clearConversation);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = question.value.trim();
    if (!value) return;
    appendMessage('user', value);
    question.value = '';
    const reply = appendMessage('assistant', copy.working);
    submit.disabled = true;
    submit.textContent = copy.working;
    try {
      if (!activeEndpoint) throw new Error('network_unavailable');
      const answer = await askRag(value, reply);
      reply.content.textContent = answer;
      history.push({ role: 'user', content: value }, { role: 'assistant', content: answer });
      history = history.slice(-6);
      setMode('rag', copy.readyRag);
    } catch (error) {
      const code = error instanceof Error ? error.message : 'request_failed';
      const messages = {
        local_retrieval_unavailable: copy.localUnavailableAnswer,
        local_retrieval_processing_failed: copy.localProcessingFailed,
        provider_error: copy.providerError,
        model_unavailable: copy.modelUnavailable,
        budget_or_rate_limit: copy.budgetOrRateLimit,
        turnstile: copy.turnstile,
        insufficient_evidence: copy.insufficientEvidence,
        empty_model_response: copy.emptyModelResponse,
        stream_error: copy.providerError,
        network_unavailable: copy.connectionFailed,
        rag_unavailable: copy.connectionFailed,
      };
      const errorAnswer = messages[code] || `${copy.requestFailed}${code}`;
      reply.content.textContent = errorAnswer;
      renderSources(reply.sources, []);
      history.push({ role: 'user', content: value }, { role: 'assistant', content: errorAnswer });
      history = history.slice(-6);
      setMode('error', code.startsWith('local_retrieval_') ? copy.localUnavailable : copy.requestFailedStatus);
    } finally {
      submit.disabled = false;
      submit.textContent = copy.ask;
      scrollTranscript();
    }
  });

  clearConversation();
  loadModels();
})();
