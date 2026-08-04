# 个人主页可行性调研与实施方案

## 目标

基于用户公开授权的个人材料，制作默认中文、完整中英文切换的学术个人主页；通过供应商中立 RAG 回答访客问题，支持 Qwen、GLM、DeepSeek、Kimi 与可选 OpenAI 切换，在模型/预算故障时自动退化为静态 FAQ 和站内资料搜索，并部署到 GitHub Pages。

## 当前阶段

### 经典学术主页重构（2026-08-04 用户纠偏）

- [x] 确认当前 Cloudflare 授权状态
- [x] 审计 `RayeRen/acad-homepage.github.io` 的页面结构、组件、样式与许可
- [x] 将现有内容映射到经典学术主页信息架构
- [x] 重构前端并保留双语、RAG 与静态降级
- [x] 完整回归、线上替换与 Cloudflare RAG 发布

用户明确否定当前“作品集/产品页”视觉方向，要求以 `RayeRen/acad-homepage.github.io` 的经典架构为基线修改。后续不再在原视觉上做局部美化，而是执行结构性迁移。

- [x] 初始化调研工作区与范围
- [x] 定位并盘点个人材料
- [x] 提取、核对论文与简历信息
- [x] 检查项目与 Git/GitHub 现状
- [x] 核对 GitHub Pages 与 RAG 部署约束
- [x] 形成架构、内容、隐私、安全和实施方案
- [x] 给出风险、待确认项和下一步
- [x] 将 RAG 更新为供应商中立的混合检索与多模型切换架构
- [x] 用户已审阅并授权开始制作
- [x] 阶段 0：公开清单与事实冻结
- [x] 阶段 1：内容与视觉原型
- [x] 阶段 2：静态站实现
- [x] 阶段 3：RAG 语料与混合检索
- [x] 阶段 4：多模型 Worker 后端
- [x] 阶段 5：集成与质量验证
- [x] 阶段 6：GitHub Pages 与 Worker 发布（生成模型密钥可后续按需加入）
- [x] 阶段 7：维护交付

## 当前交付状态（2026-08-04）

- GitHub 仓库：`https://github.com/SquareSon/SquareSon.github.io`
- 公开主页：`https://squareson.github.io/`
- 英文主页：`https://squareson.github.io/en/`
- GitHub Pages 已固定为 Actions 构建，HTTPS 开启；经典 Jekyll 中文页、英文页、11 条论文、媒体资源、静态检索与隐私检查均在线通过。
- 静态 FAQ/站内资料搜索已在线；无模型账号时明确标记为静态资料检索，不冒充 AI 回答。
- Cloudflare Worker、D1/FTS5、313 条 Vectorize/BGE-M3 向量、RRF、BGE 重排、SSE 与四模型适配均已发布，API 为 `https://zi-fang-research-assistant.zi-fang-research.workers.dev`。
- 当前尚未写入 Qwen、GLM、DeepSeek、Kimi 任一生成模型 API Key，因此模型列表为空并自动静态降级；后续通过 `wrangler secret put` 加入任一密钥即可启用对应模型，无需改前端架构。

## 已确认约束

- 代码目标目录：`/WorkSpace/Program/PersonalHomePage-0.0.00`
- 主页默认中文，并支持中英文切换
- 聊天机器人需要基于个人材料进行 RAG 回答
- 聊天窗口支持 Qwen、GLM、DeepSeek、Kimi，并保留 OpenAI 作为可选模型供应商
- 预算耗尽、所选模型不可用或后端不可达时，自动进入静态 FAQ + 站内资料搜索模式
- 最终希望通过 GitHub Pages 仓库部署
- 用户已确认方案并授权制作、创建远程仓库与部署

## 代码目录证据

- 当前不是 Git 仓库，无源码、依赖锁、项目配置、入口、测试或既有 AI Context。
- 因此本轮不存在历史架构兼容问题；技术栈、仓库名、发布方式和 RAG 后端均需在实施阶段新建。

## 可行性结论

- 双语个人主页：高可行，材料足够支持首版内容与视觉叙事。
- GitHub Pages 部署：高可行，推荐创建 `SquareSon/SquareSon.github.io` 用户主页仓库。
- RAG 聊天机器人：技术上可行，但不能只部署在 GitHub Pages；需要独立实时后端、检索存储与生成模型 API。
- 多模型切换：高可行；四家均有可供服务端调用的 HTTP/Chat Completions 接口，但需通过统一适配层消化参数、流式事件和错误码差异。
- 本地算力：默认方案无需本地 GPU；文档解析在 CPU 上完成，embedding、rerank 和答案生成均调用云端服务。
- 隐私与公开性：已确认论文、论文图片、头像和机构邮箱可公开；手机号、微信和其他未授权字段继续排除。

## 推荐架构

### 前端

- Next 16 + React 19 + TypeScript，使用 vinext/Vite 生成 Cloudflare 兼容版本，同时提供 GitHub Pages 静态产物；仅聊天窗口加载必要交互脚本。
- 中文使用 `/`，英文使用 `/en/`；双语文案来自同一类型化数据源，避免两个页面事实漂移。
- 项目、论文、经历和站点文案都以类型化双语字段维护。
- 生成 sitemap、canonical、`hreflang`、Open Graph、结构化数据与自定义 404；图片统一裁切、压缩和响应式输出。

### RAG

- 原始材料从 `/WorkSpace/Data/PersonalHomepage` 本地只读处理；原始简历不进入公开仓库，只提交通过公开策略过滤后的结构化事实与知识块。
- 离线索引链路：来源注册表 → DOCX/PDF/Scholar 解析 → 去噪与脱敏 → 标题层级切块 → 中英文元数据 → embedding → 向量与关键词双索引 → 版本化发布。
- 切块保留章/节/图表标题和相邻上下文，首版以约 350–650 个中文字符或 250–450 个英文 token、10%–15% 重叠为起点，再用评测结果调整；表格、图注、论文条目和个人事实使用专门结构，不机械截断。
- 每个知识块包含稳定 `chunk_id`、来源、章节路径、语言、日期、公开级别、论文发表状态、证据层级、可引用 URL、内容哈希和索引版本。
- 在线检索链路：查询规范化/语言识别 → BGE-M3 查询向量 → Vectorize 语义召回 top-K → D1 FTS5 关键词召回 top-K → Reciprocal Rank Fusion（RRF）融合 → BGE reranker 重排 → 去重与上下文预算装配。
- 混合检索同时覆盖语义近义表达和论文名、缩写、模型名、数值指标等精确词；只有 `public=true` 的知识块可以进入召回结果。
- 生成层收到相同的证据包后，可切换 Qwen、GLM、DeepSeek、Kimi 或 OpenAI；生成模型切换不改变向量索引。embedding 模型只能通过“新建索引 → 全量重嵌入 → 评测 → 切换版本”升级。
- 回答必须引用知识块；无足够证据时明确回答未找到，不允许用模型常识补写个人事实；不提供医疗诊断/治疗建议，不披露隐私。
- 评测指标包括检索 Recall@K/MRR、重排 nDCG、答案事实一致性、引用正确率、无答案拒答率、中英文一致性、首 token 延迟和单问成本。

### RAG 推荐部署组合

- API 与编排：Cloudflare Worker，负责 Turnstile、CORS、会话、限流、预算、检索编排、模型适配、SSE 流式响应和降级状态。
- 语义检索：Cloudflare Vectorize；正文与关键词检索：Cloudflare D1 + FTS5；知识块正文和引用信息以 D1 为准，Vectorize 只保存向量和检索所需元数据。
- Embedding：Workers AI `@cf/baai/bge-m3`；Rerank：Workers AI `@cf/baai/bge-reranker-base`。两者由 Cloudflare 托管 GPU 执行，不占用用户本地计算资源。
- 生成模型：建立 `ModelProvider` 统一接口，接入阿里云 Model Studio（Qwen）、智谱开放平台（GLM）、DeepSeek API、Moonshot/Kimi API，并保留 OpenAI 可选适配器。
- 聊天界面提供“自动、Qwen、GLM、DeepSeek、Kimi、OpenAI（若启用）”选项；浏览器只提交受控模型别名，Worker 从服务端 allowlist 映射真实版本和密钥，禁止客户端传任意模型名或 API 地址。
- “自动”模式按健康状态、预算和配置优先级选择模型，遇到 timeout/429/5xx 可切换下一家；访客明确选择某家时不静默换模型，失败后直接进入资料检索降级并提示原因。
- 各家输出被统一成 SSE 事件：`meta`、`delta`、`citation`、`usage`、`done`、`error`、`degraded`，前端不依赖任一供应商的原始响应格式。
- 首版不需要 Supabase/Neon/pgvector 或本地推理服务；Cloudflare 是检索基础设施，生成供应商可独立替换。

### 三级可用性与降级

1. 完整 RAG：混合检索、重排、所选生成模型、引用和流式回答全部可用。
2. 自动故障转移：仅在“自动”模式下，所选优先模型触发预算上限、超时、429 或 5xx 时切换到下一家健康模型，并在回答元信息中显示实际模型。
3. 静态资料模式：所有可用模型均失败、显式选择的模型失败、Worker 超时/不可达或全局预算关闭时，浏览器自动加载预生成中英文 FAQ 与 Pagefind 静态索引，展示最相关资料摘要和页面链接；明确标记“当前为资料检索模式，不是 AI 生成回答”。

静态资料模式随 GitHub Pages 一同部署，不需要 API、账号或 GPU。前端在收到 `degraded`、网络错误或首响应超时后自动切换，也允许访客主动选择“仅搜索资料”。

### GitHub 与发布

- 推荐仓库：`SquareSon/SquareSon.github.io`；首版使用 `https://squareson.github.io/`，自定义域名可后加。
- GitHub Actions 执行依赖安装、类型检查、内容校验、测试、静态构建、链接检查和 Pages 部署。
- 仅上传构建产物、公开页面数据和经脱敏的公开知识语料；原始简历、临时提取物、密钥、未公开索引和访客日志加入 `.gitignore`/发布排除规则。
- 后端代码放在同一工作目录的 `worker/` 中，但部署到独立 serverless/edge 运行时；后端凭据保存在该平台的 secret store。

## RAG 账号与配置清单

### A. 已具备：GitHub

- 账号：`SquareSon`，已具备 `repo`/`workflow` 权限。
- 用途：`SquareSon.github.io` 仓库、Pages、Actions、源码版本控制。
- 不放入 GitHub：任何模型 API Key、Turnstile Secret、未公开材料或访客问题日志。

### B. 必需：Cloudflare 开发者账号

同一个 Cloudflare 账号内创建：

1. Worker：实时 API、模型路由和流式响应，可先使用 `workers.dev`。
2. Vectorize：BGE-M3 dense 向量索引。
3. D1：知识块正文、FTS5 关键词索引、FAQ、索引版本、供应商健康与配额计数。
4. Workers AI：调用 BGE-M3 embedding 与 BGE reranker；GPU 由 Cloudflare 托管。
5. Turnstile：公开聊天防滥用，前端使用 `TURNSTILE_SITE_KEY`，Worker Secret 保存 `TURNSTILE_SECRET_KEY`。

实施时需要用户允许我通过 Wrangler/Cloudflare 控制台完成一次授权和资源创建；模型密钥只通过 `wrangler secret put` 或控制台 Secret 写入，不在对话中传递。

### C. 生成模型账号

最低可运行条件是下列任意一家可用；要让聊天界面的四个指定选项全部可用，则需要分别注册、开通 API 计费并生成四个官方 API Key：

| 选项 | 官方平台 | Worker Secret | 说明 |
| --- | --- | --- | --- |
| Qwen | 阿里云 Model Studio/百炼 | `DASHSCOPE_API_KEY` | endpoint 与 Key 按所选地域/工作空间配置；使用通用应用 API，不使用仅限编程工具的 Coding Plan Key |
| GLM | 智谱开放平台 | `ZHIPU_API_KEY` | 使用通用 Chat Completions API，不使用仅限编码工具的 Coding Plan Key |
| DeepSeek | DeepSeek 开放平台 | `DEEPSEEK_API_KEY` | 使用官方 OpenAI-compatible API |
| Kimi | Moonshot/Kimi 开放平台 | `MOONSHOT_API_KEY` | 使用官方 `/v1/chat/completions` API |
| OpenAI（可选） | OpenAI API Platform | `OPENAI_API_KEY` | 仅作为生成模型；不再依赖 OpenAI Vector Store/`file_search` |

密钥不能发到聊天或提交 Git。真实模型版本放在服务端 `model-catalog` 配置中，通过 `qwen-default`、`glm-default` 等稳定别名暴露给前端；以后升级模型只改后端配置并跑回归测试，不需要重建网页或检索索引。

### D. Worker 接口与安全边界

- `GET /models`：返回当前已启用的模型别名、显示名和健康状态，不返回 endpoint 或密钥。
- `POST /chat`：验证 Turnstile、输入、语言、会话和模型 allowlist；执行检索与生成，统一流式返回答案、来源、实际模型和降级状态。
- `GET /health`：只返回总体服务状态与模式，不泄露供应商配置、密钥或知识库内容。
- CORS 只允许正式 Pages、预览地址和本地开发地址；禁止客户端覆盖 base URL、系统提示词、检索过滤器和模型真实 ID。
- Prompt injection 按“不可信用户输入”和“只读公开证据”处理；用户问题不能修改公开策略、系统约束或检索 namespace。

### E. 预算、限流与日志默认值

- 每个供应商分别维护月度 token/请求硬上限和 80% 告警；D1 记录匿名计数，模型后台预算作为第二道防线。
- 首版默认：每 IP 每分钟 5 次、每天 30 次；问题最多 1,000 个字符；单会话最多 6 轮；上下文只保留必要摘要。
- 连续 3 次 timeout/429/5xx 后触发短时 circuit breaker；“自动”模式换下一家，显式模型选择进入静态资料模式。
- 默认不保存访客问题原文，只记录匿名请求数、模型别名、错误类型、延迟、token 用量、降级次数和引用覆盖率。
- 页面主体仍显示“Zi Fang Research Assistant”，但聊天模型选择器和每次回答元信息会明确实际使用的模型。
- 中国大陆与海外网络分别实测；若 GitHub Pages 或 Cloudflare 在目标网络不稳定，静态降级仍保留，后续可把同一 Worker 接口迁移到国内云函数。

### F. 是否需要本地 GPU

- 不需要。DOCX/PDF 解析、脱敏、切块和静态构建使用普通 CPU；BGE-M3 embedding、reranker 与四家聊天模型均在云端运行。
- 本地开发可使用固定 embedding/模型响应夹具完成大多数测试，不调用 GPU，也不必每次产生 API 费用。
- 只有未来决定自托管 embedding、reranker 或开源大模型时才需要评估 NVIDIA GPU、显存、推理框架和运维；这不属于首版方案。

### G. 不需要额外准备与无账号降级

- 不需要 Supabase、Neon、Pinecone、独立 embedding 账号或本地向量数据库。
- 不需要手工切论文，也不需要把密钥写入 GitHub Pages。
- 不需要立即购买自定义域名。
- 没有 Cloudflare/模型账号时，GitHub Pages 仍可上线完整双语主页、论文列表、Pagefind 站内搜索和预生成 FAQ；此时聊天区域明确显示为静态资料检索，不宣称是 LLM RAG。

## 信息架构与设计方向

1. 首屏：姓名、当前身份、三维感知/具身智能/医疗机器人定位、主要行动入口。
2. 研究主线：把论文重绘成“可信观测 → 连续三维表征 → 空间统一 → 组织/器械语义 → 物理系统”的五步流程。
3. 精选项目：物理超声神经场、多扫查配准、甲状腺语义与针体几何、穿刺导航原理样机、工业机器人状态监测。
4. 成果：以 Google Scholar 为准的代表论文和带语境的关键数字；专利不披露。
5. 经历与能力：教育经历、研究技能、工程能力，避免把整份高密度简历原样搬上网页。
6. About/Contact：简短个人陈述、公开邮箱、GitHub/学术主页链接；手机号/微信默认不展示。
7. Ask Me：带示例问题、证据引用、隐私说明和医疗非建议提示的聊天入口。

视觉上采用克制的学术科技风：深色中性底色或明亮纸张色为主，少量交大红作为身份色、超声蓝作为数据/导航色；不用论文整页截图堆砌。首页优先使用原理样机、假体三维图、三维重建结果，复杂架构图重绘为网页图形。

## 建议目录

```text
PersonalHomePage-0.0.00/
├── src/
├── app/{page.tsx,en/page.tsx,globals.css}/
├── components/
├── content/{profile,projects,publications}/
├── public/{images,documents,fallback}/
├── rag/
│   ├── corpus/          # 只包含经过公开策略过滤的规范化语料
│   ├── ingest/          # 解析、切块、embedding、D1/Vectorize 发布
│   └── eval/            # 检索与生成评测集
├── worker/
│   ├── src/{routes,retrieval,providers,safety}/
│   └── migrations/      # D1 schema/FTS5
├── tests/{unit,e2e,rag,provider-contract}/
├── docs/
├── .github/workflows/deploy-pages.yml
├── wrangler.jsonc
└── astro.config.mjs
```

## 实施阶段

### 阶段 0：公开清单与事实冻结

- 确认英文姓名、头像、公开联系方式、可用图片，以及 Google Scholar 论文事实快照。
- 生成单一事实源；所有页面与 RAG 共用，不在组件中硬编码个人事实。
- 产物：`content-policy.yml`、公开材料清单、双语事实表。

### 阶段 1：内容与视觉原型

- 编写中英文短传、研究主线、项目卡片、论文条目与 FAQ。
- 从论文提取经授权的高质量图片，重绘两张核心图：研究链路、系统数据流。
- 完成桌面/手机首屏和项目详情原型，先获得内容与风格确认。

### 阶段 2：静态站实现

- 初始化 Next/vinext、内容模型、双语路由、响应式组件、SEO、无障碍和图片管线。
- 实现首页、项目详情、成果页、关于页、404、聊天抽屉和模型选择器。
- 构建中英文静态 FAQ 与 Pagefind 索引；先让“完全无后端”的资料检索模式可用。

### 阶段 3：RAG 语料与混合检索

- 实现 DOCX/PDF 解析、公开策略过滤、层级切块、中文分词、Google Scholar 定向同步和稳定 chunk ID。
- 用 Workers AI BGE-M3 生成向量并发布到 Vectorize；正文与 FTS5 关键词索引发布到 D1。
- 实现 dense + keyword 召回、RRF 融合、BGE reranker、证据去重、引用组装和置信阈值。
- 索引采用蓝绿版本：新版本全量构建和评测通过后再切换，失败可回滚。

### 阶段 4：多模型 Worker 后端

- 实现 Qwen、GLM、DeepSeek、Kimi、OpenAI provider adapter 与统一 SSE 协议；真实模型版本由服务端 catalog 管理。
- 实现 `/models`、`/chat`、`/health`、Turnstile 服务端验证、CORS、限流、预算计数、circuit breaker、超时与故障分类。
- 落实证据限定提示词、引用校验、隐私边界、医疗非建议策略和日志最小化。

### 阶段 5：集成与质量验证

- 前端接入统一 SSE，验证手动模型切换、“自动”故障转移、预算关闭、Worker 断网和 Pagefind/FAQ 自动降级。
- 验证双语内容等价、键盘可达、屏幕阅读、响应式、链接、SEO、性能、移动端键盘和浏览器兼容性。
- 建立至少 30 个中英文事实问答、10 个无答案/注入/隐私/医疗越权问题；检索层全量测试，生成层对每个已启用供应商做契约测试和代表性回归。
- 记录 Recall@K、MRR/nDCG、引用正确率、事实一致性、拒答率、首 token 延迟、故障恢复和估算成本。

### 阶段 6：GitHub Pages 与 Worker 发布

- 初始化 Git、创建 `SquareSon/SquareSon.github.io`、提交代码并配置 Pages Actions。
- 通过 Wrangler 创建/迁移 Worker、D1、Vectorize、Workers AI bindings 和 Turnstile Secrets；模型 Key 由用户在安全入口写入。
- 先发布预览并验收，再启用正式 Pages；如有域名，再完成域名验证、DNS 与 HTTPS。
- 发布后检查真实 URL、资源路径、缓存、404、中文默认路由、英文 `hreflang`、聊天跨域和真实网络降级。

### 阶段 7：维护

- 新材料进入来源注册表，通过同一脱敏/索引流程增量更新。
- 论文发表状态、简历事实、代表项目和 FAQ 使用日期与状态字段维护；每次发布运行内容一致性和 RAG 回归测试。
- 模型版本升级只更新服务端 catalog 并跑 provider/回答回归；embedding 升级必须新建向量索引并全量重嵌入。

## 验收门槛

- `/` 默认中文，`/en/` 为完整英文版；切换语言后保留对应页面语义。
- 手机、平板和桌面无横向溢出；核心内容无 JavaScript 也可阅读。
- 未公开材料、手机号、微信、密钥和原始全文不出现在 Git 历史或 Pages 构建产物中。
- 论文状态与 Google Scholar 权威快照一致；专利不显示；关键指标带任务、数据和证据边界。
- RAG 回答包含可读来源，无法回答时拒绝编造；隐私和医疗越权测试通过。
- 模型选择器只显示已启用选项；Qwen、GLM、DeepSeek、Kimi 使用同一检索证据并能独立流式回答，实际模型可追溯。
- 前端无法指定任意 endpoint、模型 ID、系统提示词或检索过滤器；所有密钥均不出现在 Git、Pages 产物、浏览器网络响应或日志中。
- 达到预算、显式模型失败、全部模型失败和 Worker 不可达四种场景均能自动进入 FAQ + Pagefind 静态资料模式，且界面不把检索结果冒充 AI 回答。
- GitHub Actions 可从干净环境重复构建并发布；正式 URL 强制 HTTPS。

## 实施前必须确认

1. [已确认] 英文姓名标准写法为 `Zi Fang`。
2. [已确认] 头像与机构邮箱允许公开。
3. [已确认] 博士论文全文和论文图片均允许公开。
4. [已确认] 论文清单与发表状态以 Google Scholar 个人主页为唯一权威来源：`https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&hl=zh-CN`。
5. [已确认] 主页不披露专利，不制作专利模块，也不把专利加入公开 RAG 事实源。
6. [已确认] 聊天支持 Qwen、GLM、DeepSeek、Kimi 切换，并在模型或预算不可用时降级为静态 FAQ + 站内搜索。
7. [待审阅] 供应商中立 RAG：Cloudflare Worker + Vectorize + D1 FTS5 + Workers AI BGE-M3/BGE reranker。
8. [部署前提供] Cloudflare 授权与希望启用的模型 API Keys；Key 不在对话中传递。
9. [部署前确定] 每家模型的月度预算/硬配额和默认/自动路由顺序；不影响先开始页面和后端代码制作。
10. [可后置] 是否购买/使用自定义域名；不确认也可先用 `squareson.github.io`。

## 错误与异常

| 项目 | 状态 | 处理 |
| --- | --- | --- |
| `/WorkSpace/Data/PersonalHomePage` 不存在 | 已解决 | 实际目录为 `/WorkSpace/Data/PersonalHomepage` |
| 论文文件名与描述不一致 | 已解决 | 实际文件为更新版本 `毕业论文-20260804-15.docx`，本轮按该文件分析 |
| ImageMagick `montage` 不可用 | 已绕过 | 代表页已成功单独渲染，改为逐页视觉检查，不安装额外依赖 |
| Google Scholar 页面无法由网页读取器直接打开，搜索也未命中指定用户 ID | 已解决 | 使用只读 HTTP 获取指定个人主页并解析；保留人工核对和缓存回退，不依赖搜索引擎发现 |
| 两次大范围 `apply_patch` 因预期上下文与实际文件不匹配而失败 | 已解决 | 读取实际标题与行号后拆成小范围补丁；失败调用未产生部分写入 |
| Kimi 文档介绍页首次打开超时 | 已解决 | 直接打开官方 Chat Completions API 页面并成功核对端点、鉴权和响应结构 |
| 更新目录与阶段的大补丁因一个重复行上下文不匹配而失败 | 已解决 | 失败未产生部分写入；改为按目标小节分段更新 |
| Sites 初始化脚本没有可执行权限 | 已解决 | 直接执行返回 126；改由 `bash` 调用同一官方脚本，不修改脚本权限 |
| Sites 初始化脚本使用 CRLF 导致 Bash 解析 `pipefail` 失败 | 已解决 | 第二次调用返回 2；改为仅在管道中移除行尾 CR 后交给 Bash，不修改插件文件 |
| 通过标准输入执行转换后的初始化脚本时 `BASH_SOURCE` 无文件路径 | 已解决 | 第三次调用返回 127；读取脚本后确认只是包装层，改为直接运行深层初始化器 |
| Sites 初始化器要求目标目录为空，但项目已有规划文档 | 处理中 | 将三份规划文档临时移动到 `mktemp -d`，初始化成功后立即原样移回并核对哈希 |
| 临时初始化命令包含 `rm -rf` 清理而被安全策略拒绝 | 已解决 | 命令未执行、无文件变更；移除清理步骤并保留 `/tmp` 临时副本供系统回收 |
| 本地预览自动打开失败：当前任务不在目标主窗口可见 | 已绕过 | 开发服务器已正常运行在 `http://localhost:3000/`；按 Sites 规则不重复打开，不阻塞后续构建与发布 |
| 首次 TypeScript 检查发现 5 个类型错误 | 处理中 | 修正可选回答与项目图片的类型收窄；为 starter Worker/DB 补充 Cloudflare 类型依赖后重跑 |
| `npm audit --omit=dev` 报告 3 个 high 生产依赖问题 | 已解决 | 升级到 Next 16.3.0 后生产审计为 0；未使用 `--force` |
| 补充 Cloudflare 类型后，TypeScript 仍未自动加载全局类型且检查了无关 starter examples | 已解决 | 在 `tsconfig.json` 显式声明 `@cloudflare/workers-types` 并排除未使用的 `examples/`，随后重跑检查 |
| Docker Jekyll 容器无法连接 `/var/run/docker.sock` | 已绕过 | 当前用户不在 docker 组且 sudo 需要密码；使用 `/tmp` 隔离 Conda Ruby 环境完成同等本地构建验证 |
