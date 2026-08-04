(() => {
  const root = document.querySelector('[data-assistant]');
  if (!root) return;

  const locale = root.dataset.locale === 'en' ? 'en' : 'zh';
  const endpoint = (root.dataset.ragEndpoint || '').replace(/\/$/, '');
  const form = root.querySelector('[data-assistant-form]');
  const question = root.querySelector('[data-assistant-question]');
  const model = root.querySelector('[data-assistant-model]');
  const submit = root.querySelector('[data-assistant-submit]');
  const answer = root.querySelector('[data-assistant-answer]');
  const citations = root.querySelector('[data-assistant-citations]');
  const status = root.querySelector('.assistant-status');
  const statusText = root.querySelector('[data-assistant-status]');

  const copy = {
    zh: {
      readyStatic: '静态 FAQ 与站内资料搜索已就绪',
      readyRag: 'RAG 已连接；失败时自动切换为静态检索',
      working: '正在检索公开材料……',
      noResult: '静态资料中没有找到足够相关的内容。可尝试询问研究方向、博士论文、GLA-NeRF、论文列表或联系方式。',
      staticPrefix: '静态资料检索：',
      source: '来源',
      ask: '提问',
    },
    en: {
      readyStatic: 'Static FAQ and on-page search are ready',
      readyRag: 'RAG is connected; static search remains available',
      working: 'Searching public materials…',
      noResult: 'The static materials do not contain a sufficiently relevant answer. Try asking about research areas, the dissertation, GLA-NeRF, publications, or contact details.',
      staticPrefix: 'Static material search: ',
      source: 'Source',
      ask: 'Ask',
    },
  }[locale];

  const documents = locale === 'en' ? [
    {
      keywords: 'research areas focus 3d perception embodied intelligence medical robotics ultrasound reconstruction registration semantics navigation',
      answer: 'Zi Fang studies 3D perception, embodied intelligence, and medical robotics. The doctoral work connects trustworthy ultrasound observation, continuous 3D reconstruction, multi-sweep alignment, tissue and needle semantics, and a navigation prototype.',
      label: 'Research interests', href: '/en/#research',
    },
    {
      keywords: 'thesis dissertation thyroid ultrasound problem contribution',
      answer: 'The dissertation addresses ultrasound-guided thyroid puncture through a traceable chain from observation and continuous reconstruction to semantic modeling and physical navigation coordinates. Its experiments support method-, module-, and phantom-prototype-level conclusions.',
      label: 'Dissertation overview', href: '/en/#research',
    },
    {
      keywords: 'gla nerf multi sweep registration alignment global local pose',
      answer: 'GLA-NeRF separates multi-sweep misalignment into global sweep-level bias and local frame-level error, then jointly optimizes poses and a neural field using appearance, geometric consistency, and continuous-trajectory constraints.',
      label: 'GLA-NeRF · PMB 2026', href: '/en/#selected-work',
    },
    {
      keywords: 'clinical validation accuracy safety evidence phantom prototype',
      answer: 'No clinical validation is claimed. Current evidence covers methods, modules, and phantom prototypes; component calibration residuals must not be interpreted as end-to-end puncture accuracy or clinical safety.',
      label: 'Evidence boundary', href: '/en/#about',
    },
    {
      keywords: 'publication paper scholar full list eleven',
      answer: 'Google Scholar is the authoritative source for publications. The page lists 11 records synchronized on 4 August 2026 and does not treat unpublished work as a publication.',
      label: 'Publications', href: '/en/#publications',
    },
    {
      keywords: 'contact email collaboration',
      answer: 'Contact Zi Fang through the institutional email fangzi508@sjtu.edu.cn for discussions on 3D perception, medical imaging, medical robotics, or research collaboration.',
      label: 'Public contact', href: 'mailto:fangzi508@sjtu.edu.cn',
    },
  ] : [
    {
      keywords: '研究 方向 三维 感知 具身 智能 医疗 机器人 超声 重建 配准 语义 导航',
      answer: '方子的研究围绕三维感知、具身智能与医疗机器人，博士工作把可信超声观测、连续三维重建、多扫查配准、组织与针体语义以及导航原理样机连接成完整方法链。',
      label: '研究方向', href: '/#research',
    },
    {
      keywords: '博士 论文 甲状腺 超声 问题 贡献',
      answer: '博士论文面向甲状腺超声引导穿刺，从可信观测和连续三维重建推进到空间统一、语义建模与物理导航坐标。实验结论限定在方法、模块与假体原理样机层面。',
      label: '博士论文概览', href: '/#research',
    },
    {
      keywords: 'gla nerf 多扫查 配准 全局 局部 位姿',
      answer: 'GLA-NeRF 把多扫查偏差分成扫查级全局偏差与帧级局部误差，通过外观、几何一致性和连续轨迹约束联合优化位姿与神经场。',
      label: 'GLA-NeRF · PMB 2026', href: '/#selected-work',
    },
    {
      keywords: '临床 验证 精度 安全 证据 假体 样机',
      answer: '现有工作没有宣称完成临床验证。当前证据覆盖方法、模块与假体原理样机；分项标定残差不能解释为端到端穿刺精度或临床安全性。',
      label: '证据边界', href: '/#about',
    },
    {
      keywords: '论文 发表 文章 学术 scholar 十一',
      answer: '论文以 Google Scholar 为权威来源。本站列出 2026 年 8 月 4 日同步到的 11 条记录，不把尚未正式发布的工作列为论文。',
      label: '论文列表', href: '/#publications',
    },
    {
      keywords: '联系 邮箱 合作',
      answer: '可通过上海交通大学机构邮箱 fangzi508@sjtu.edu.cn 联系方子，讨论三维感知、医学影像、医疗机器人或研究合作。',
      label: '公开联系方式', href: 'mailto:fangzi508@sjtu.edu.cn',
    },
  ];

  function setMode(mode, text) {
    status.dataset.mode = mode;
    statusText.textContent = text;
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

  function renderSources(sources) {
    citations.replaceChildren();
    sources.forEach((source) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.href || '#';
      link.textContent = `${copy.source}: ${source.label}`;
      item.appendChild(link);
      citations.appendChild(item);
    });
  }

  async function loadModels() {
    if (!endpoint) return;
    try {
      const response = await fetch(`${endpoint}/api/models`, { headers: { accept: 'application/json' } });
      if (!response.ok) return;
      const payload = await response.json();
      const models = Array.isArray(payload.models) ? payload.models : [];
      models.forEach((entry) => {
        const option = document.createElement('option');
        option.value = entry.id;
        option.textContent = `${entry.label} · ${entry.model}`;
        model.appendChild(option);
      });
      model.disabled = models.length === 0;
      setMode(models.length ? 'rag' : 'static', models.length ? copy.readyRag : copy.readyStatic);
    } catch {
      setMode('static', copy.readyStatic);
    }
  }

  async function askRag(value) {
    const response = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream, application/json' },
      body: JSON.stringify({ query: value, model: model.value, locale }),
    });
    if (!response.ok) throw new Error('rag_unavailable');

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const payload = await response.json();
      if (payload.answer) {
        renderSources(Array.isArray(payload.citations) ? payload.citations : []);
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
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      for (const event of events) {
        const data = event.split('\n').filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('');
        if (!data) continue;
        const payload = JSON.parse(data);
        if (payload.type === 'delta' && payload.text) {
          result += payload.text;
          answer.textContent = result;
        } else if (payload.type === 'citation') {
          sources.push({ label: payload.label, href: payload.href });
          renderSources(sources);
        } else if (payload.type === 'degraded') {
          throw new Error('stream_degraded');
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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = question.value.trim();
    if (!value) return;
    submit.disabled = true;
    submit.textContent = copy.working;
    answer.textContent = '';
    citations.replaceChildren();
    try {
      if (!endpoint) throw new Error('static');
      answer.textContent = await askRag(value);
      setMode('rag', copy.readyRag);
    } catch {
      const result = staticSearch(value);
      answer.textContent = result.answer;
      renderSources(result.sources);
      setMode('static', copy.readyStatic);
    } finally {
      submit.disabled = false;
      submit.textContent = copy.ask;
    }
  });

  loadModels();
})();
