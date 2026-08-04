# 调研发现

## 经典学术主页重构基线（2026-08-04）

- 用户明确认为当前页面方向不合格，要求采用 `RayeRen/acad-homepage.github.io` 的经典学术主页架构；原有纸张科技风、研究链首屏和大卡片布局不再作为视觉基线。
- Cloudflare OAuth 当前已成功，账号具备 Workers、D1、Workers AI、AI Search、Secrets Store 等写入权限，实时 RAG 发布不再受账号登录阻塞。
- 参考仓库当前提交为 `2cc1577`，是 Jekyll 站点：核心由 `_config.yml`、`_data/navigation.yml`、`_layouts/default.html`、`_includes/{masthead,author-profile,sidebar,seo}`、`_pages/about.md` 和模块化 Sass 组成。
- 参考仓库的基本范式是固定顶部导航 + 左侧作者资料栏 + 右侧长篇学术内容，而不是全屏产品首屏；论文、经历、服务等以 Markdown 标题和紧凑列表为主。
- 参考仓库自带 Academicons、Font Awesome、本地字体、Google Scholar 抓取与 GitHub Pages/Jekyll 运行脚本。下一步需核对许可证、具体内容模块与响应式规则，再决定是保留现有 Next/Worker 运行层并复刻架构，还是迁移为 Jekyll + 独立聊天脚本。
- 参考仓库使用 MIT License（Copyright 2022 Yi Ren），允许复制和修改，但必须保留版权与许可文本；正式迁移应保留原 `LICENSE` 并另行说明本站内容版权归属。
- 其内容主模板是 `_pages/about.md`：About 长文本、News 紧凑时间线、带图 `paper-box` 的精选论文、普通论文列表、Honors、Education、Talks、Internships。实际设计重点不是动画或视觉装饰，而是学术事实的连续阅读效率。
- 截图显示桌面为白底窄顶栏、约 20% 左侧人物栏、约 80% 主内容；头像、单位简介、地点与学术链接始终可见。平板保持两栏，手机把人物资料压到正文上方并让论文图文纵向排列。
- 结合用户“在他之上进行修改”的措辞，最忠实的实现不是在 Next 页面中仿造外观，而是把公开站根目录迁移到该 Jekyll 模板，直接复用其布局/Sass/响应式机制；RAG 改为独立 Cloudflare Worker，前端聊天用原生 JS 嵌入 Jekyll 页面。
- 参考站样式参数：正文基准字号 14px，最大内容宽度 1280px，桌面左栏 2/12、正文 10/12，925px 以下改为上下布局；白底、灰色正文、深蓝链接，论文条目在 768px 以上采用约 40% 图片 + 60% 文字。
- 参考站交互以轻量导航、平滑锚点、移动端作者联系方式展开为主；迁移时不必继承其旧版 jQuery、Stickyfill 与 Magnific Popup 依赖，可用原生 CSS/JS 保持同等结构并改善可维护性与无障碍性。
- 参考仓库的 Scholar crawler 是每日 GitHub Action，依赖 `GOOGLE_SCHOLAR_ID` 并强推统计分支；首版以 Google Scholar 页面为论文状态权威来源，但不把这个脆弱爬虫作为页面构建的硬依赖。
- 现有内容可无损映射为经典信息架构：About 使用研究定位与证据边界，Research Interests 使用三条研究主线，Selected Work 使用 GLA-NeRF/三维超声/导航样机图文条目，Publications 使用 11 条 Scholar 记录，Education 使用两段交大经历，Assistant 作为正文末尾的嵌入模块。
- 2026-08-04 再次定向读取 Google Scholar 成功：页面仍为 Zi Fang / Shanghai Jiao Tong University / verified sjtu.edu.cn，显示 11 条论文记录；已取得每条的作者缩写、载体、年份和 Scholar 详情链接。引用数属于动态字段，不写死进主页。
- 本机没有 Ruby/Bundler，但 Docker 可用；本地可用官方 Jekyll 容器验证构建，GitHub Actions 使用 `actions/jekyll-build-pages`，无需把 Ruby 安装到用户系统。
- 现有 RAG Worker 的检索、四模型适配、策略拒答和流式协议可以保留；只需移除 vinext 页面处理与图片优化，把 `worker/index.ts` 改为独立 API Worker。
- Cloudflare 官方模型页确认 `@cf/baai/bge-m3` 仍是托管的多语言 embedding 模型；Vectorize 索引维度一经创建不可修改。按 BGE-M3 的 1024 维输出创建 cosine 索引，并在插入向量前为 `public` 建立 boolean metadata index。
- Cloudflare 账号此前没有 D1 或 Vectorize 资源；已新建 APAC D1 `zi-fang-public-rag`（ID `7a591cec-2182-46b9-88a8-bb8e3bec91b5`）和 1024 维 cosine Vectorize `zi-fang-public-rag-v1`。
- 本机 Docker CLI 存在，但当前用户不在 `docker` 组，socket 仅允许 `root:docker`，且 sudo 需要密码；容器构建首次调用因此在连接 API 前失败，没有创建或修改容器。改用 `/tmp` 下的隔离 Conda Ruby 环境进行本地 Jekyll 构建，不改用户系统环境。
- 隔离 Ruby 首次安装 Jekyll 时依次暴露缺少 C 编译器、C++ 编译器和 `kramdown-parser-gfm`；均只在 `/tmp/zi-fang-jekyll-ruby-20260804` 中补齐。最终 Jekyll 3.10.0 构建成功，未修改系统 Ruby 或全局 gem。
- 渲染回归共 6 项通过：中文默认页、完整英文页、11 条双语论文、经典侧栏/论文条目、媒体和原生脚本、313 条语料审计、D1 seed 以及 10 类隐私/注入/医疗越权拒答。
- D1 migration 在远程成功执行 323 条命令，313 个知识片段与 FTS5/usage 表已落库。
- Worker 首次上传受旧 `.wrangler/deploy/config.json` 干扰而指向 vinext 产物；已终止该错误上传并删除仅属于旧构建的重定向文件。显式配置的新 Worker 随后成功上传，未创建错误 Worker。
- 账号此前尚未注册 `workers.dev`。使用 Wrangler OAuth token 调用 Cloudflare 官方 API 注册 `zi-fang-research.workers.dev`，再以 triggers 部署现有版本；公开 API 地址为 `https://zi-fang-research-assistant.zi-fang-research.workers.dev`。
- 子域刚创建时本机代理返回 TLS handshake failure、直连 DNS 尚未解析，符合 Cloudflare“DNS 需要几分钟传播”的提示；需等待传播后再做健康检查，不能把该瞬时状态误判为 Worker 代码失败。
- DNS/TLS 传播完成后线上健康检查返回 200：D1 FTS、Vectorize、BGE reranker 均为可用状态，provider 列表为空（尚未配置四家模型密钥）。普通问题返回 `degraded: model_unavailable`，隐私索取在线返回确定性拒答。
- Workers AI 已为全部 313 个片段生成 1024 维 BGE-M3 embedding；首次 100 条/批 insert 在 200 条后因代理断开，改用 50 条/批幂等 upsert 后 Vectorize `totalCount` 为 313。
- 清理旧 Node 依赖后发现 Wrangler 4.92.0 的开发依赖含高危 advisory；升级到 Wrangler 4.118.0 与 Workers Types 5.20260804.1，并将其 Miniflare 链中的 `undici` 覆盖到已修复的 7.29.0，最终 `npm audit` 为 0。

## 本地现状

- `/WorkSpace/Program/PersonalHomePage-0.0.00` 存在且当前为空。
- 用户给出的 `/WorkSpace/Data/PersonalHomePage` 路径大小写与实际目录不同；材料位于 `/WorkSpace/Data/PersonalHomepage`。
- 实际论文文件为 `毕业论文-20260804-15.docx`，不是描述中的 `-14`。
- 简历文件为 `方子-三维感知，具身智能，医疗机器人.pdf`。
- 目标代码目录尚无代码、Git 元数据或已有架构，因此可以从零选择适合 GitHub Pages 的技术栈。
- Sites 初始化器要求目标目录除 `.git`/`work`/`outputs` 外完全为空，而本项目根目录已有三份规划文档；官方根包装脚本还带 CRLF。实施时需临时安全移出规划文档，在插件模板目录的转换副本上运行初始化，再原样移回。

## 材料结论

### 简历（文本与两页视觉版式均已核对）

- 基本定位：方子，上海交通大学机械与动力工程学院机器人所机械工程直博生，博士阶段为 2021.09—2026.12；本科同为上海交通大学机械工程，院优秀毕业生。
- 核心研究主题：三维感知、具身智能、医疗机器人；博士课题是甲状腺超声隐式三维重建与穿刺手术导航系统研究。
- 可组织成主页的三条主线：
  1. 医学影像感知：超声规范化、质量分析、多语义/多实例分割；
  2. 三维重建与物理逆渲染：NeRF/3DGS、声学物理先验、位姿/形变/表征联合优化；
  3. 具身与机器人：多传感器位姿估计、穿刺路径规划、5 自由度折纸穿刺机器人、工业机器人状态监测。
- 代表性项目包括：多扫查自由手超声 2D/3D 可变形配准；甲状腺超声增强与分割；NeRF/3DGS 声学物理逆渲染与语义场；折纸穿刺机器人及路径规划；航天器姿态调节 AGV 状态监测。
- 简历自述成果：SCI 与会议论文 11 篇、一作 5 篇、发明授权 4 篇；列出了 GLA-NeRF、UPI-NeRF、甲状腺超声分割、紧固件寿命预测、机器人故障诊断、穿刺路径规划等代表作。
- 技术能力覆盖 PyTorch/Lightning、TensorFlow/JAX、MATLAB/Simulink、NeRF/3DGS、Diffusion/VLA、PyBullet/Isaac、PyQt/C#、STM32、结构/电路/仿真工具，以及 RAG/大模型应用。
- 版式观察：简历采用交大红 logo、蓝色分区标题、证件照和高密度两页信息布局。主页不应照搬简历的高密度排版，适合转成“简洁首屏 + 三条研究主线 + 精选项目/成果 + 可展开详情”。
- 隐私注意：简历含私人手机号（微信同号）、邮箱、籍贯、意向城市和证件照。主页公开前必须逐项获得公开授权；默认建议仅公开机构邮箱和经确认的头像，不公开手机号/微信与籍贯。

### 论文

- 已提取 DOCX 正文、标题层级、52 个表格、17 个分节、页眉页脚和 108 个行内图形；论文约 192 页正文/成果目录，抽取文本约 23.8 万字符。原文件未被修改。
- 论文主题：面向甲状腺超声引导穿刺导航，形成“可信观测—连续表征—空间统一—语义建模—物理坐标”的完整技术路线。
- 四个递进研究问题：
  1. 物理一致三维超声重建：列级有效接触筛选 + 连续神经场 + 瑞利背散射 + 方向参数化反射；
  2. 多扫查位姿—表征联合优化：外观检索、几何内点、不确定性加权、统计先验、Lie 群 B 样条；
  3. 组织—器械语义：输入域规范化、低标注多任务分割、连续位置场/成像平面条件场、针体几何恢复；
  4. 原理样机与坐标链：甲状腺假体、双目近红外定位、N 线探头标定、针尖枢轴标定、四个软件工作台。
- 五项创新概括为：观测质量与物理神经场耦合；多扫查位姿—表征协同优化；跨域低标注二维语义观测；区分方向条件观测与方向无关输出的三维组织—器械语义建模；基于物理坐标链和分层证据的原理样机。
- 论文给出了多个可用于主页“研究影响/关键数字”的实验指标，但必须带语境展示，例如列级有效接触筛选 IoU 0.967、无效列 F1 0.954；UPI-NeRF(B+R) PSNR 29.89±0.72；局部注入抖动校正后平移/旋转误差 0.65±0.01 mm / 0.52±0.01°。
- 系统分项误差包括：双目标定重投影 RMS 0.389 px；连续轨迹平移/旋转 RMSE 0.7963 mm / 0.4584°；N 线探头标定三维有效 RMSE 1.550 mm / 1.654 mm；针尖枢轴标定内点 RMSE 3.0118 mm。
- 证据边界是论文非常重要的学术特征：当前结果支持方法、模块和原理样机层面的结论；针体几何仅有单病例假体证据；成像平面条件场的二维优势不能外推为方向无关三维优势；分项标定残差不能外推为端到端穿刺精度；尚未实测临床安全性。
- 研究展望包括动态组织—器械关系、在线增量/低时延计算、组织形变与针—组织交互、不确定性传播与安全约束、多中心临床数据与其他器官拓展。
- 论文成果目录列出 5 篇学术论文和 4 件专利，与简历“论文 11 篇、一作 5 篇”以及简历中的部分新工作不完全一致。主页数据必须做版本化核对，不能简单合并数量。
- 论文包含 109 个媒体文件，具备提取研究流程、原理样机、假体和三维结果图用于主页的潜力；公开前需确认图片版权、病人/数据隐私和论文提交阶段的公开许可。
- DOCX 的只读 PDF 副本共 215 个物理页面；正文页码与 PDF 物理页码存在前置页偏移，后续素材提取必须按图题定位，不能直接按论文页码截取。
- 视觉抽查显示：全文技术路线图信息完整但节点密度高，更适合重绘成主页交互式/简化流程图，而非直接嵌入整页截图；原理样机照片清楚呈现手持超声、近红外定位、假体、PC 与机器人验证装置，适合作为“从算法到系统”项目主视觉，但需要裁切论文文字并确认公开授权。
- 导航软件总架构图把四个工作台、数据流、质量门控、算法接口和评价边界放在同一图中，信息密度也偏高；建议在网页中拆成四步滚动叙事。颈前区与甲状腺多结节假体的三维结构图视觉辨识度较高，适合作为研究项目卡片或方法链中“可重复实验平台”的配图。
- 三维强度/语义/针体几何工作台截图能证明系统集成，但界面文字在网页卡片尺寸下难以阅读；更适合作为项目详情页中的放大图，首页应优先使用重建结果、假体图或样机照片。
- 实施期复核 PDF 物理页 167：原理样机图由“自由手超声扫查原理样机”和“双目定位机器人轨迹验证装置”两张清晰照片组成，能直接支撑“从自由手观测到物理坐标验证”的首页叙事，适合作为项目大图。
- 实施期复核 PDF 物理页 40：全文结构图层级准确但过密，正文缩放后不可读；主页不直接使用该整页，而用 CSS/HTML 重绘为五步研究链。
- 实施期复核 PDF 物理页 168：主要是导航软件职责与运行环境正文，不适合作为视觉素材。
- 实施期复核 PDF 物理页 191：四联工作台截图适合项目详情或系统集成证据，但首页尺寸下文字太小；首页只使用抽象化的语义场/针体几何视觉，详情区可提供放大图。
- 简历内嵌头像为 400×475、清晰正面证件照，白底且适合首页人物卡；公开文件保存为 `public/images/profile/zi-fang.png`。
- 原理样机图已从论文页中无损渲染为 930px 宽横图，左右分别呈现自由手超声采集和定位/机器人验证，首页项目视觉可直接使用；需去掉底部被截断的论文图题。

### 代码目录与可复现状态

- Codebase Orientation 检查确认：目标目录存在，但不是 Git 仓库；不存在源码、依赖锁、项目入口、测试、ProjectProfile 或 `AI_CONTEXT.json`。
- 现有文件仅为本轮调研生成的 `task_plan.md`、`findings.md`、`progress.md` 与 `tmp/` 中间提取物。
- 技术选型不受历史代码约束；上线前需要新建 Git 仓库、初始化前端工程、配置构建/测试/Pages 工作流，并决定 RAG 后端的独立托管位置。
- 实施阶段按 Sites 规范初始化后，工程采用 Next 16 + React 19 + TypeScript + vinext/Vite；自带 Cloudflare Worker 入口、可选 D1/R2 绑定和构建测试骨架。原 Astro 选型被该受支持骨架取代，但静态内容、双语路由和 GitHub Pages 目标不变。
- Starter 的 D1/R2 当前均为 `null`，数据库 schema 为空；默认测试只验证临时 loading skeleton，正式页面完成后必须替换测试并移除 `_sites-preview` 与 `react-loading-skeleton`。
- Starter 固定的 Next 16.2.6 在 2026-08-04 的生产依赖审计中命中 Next/PostCSS/Sharp 三项 high advisory；审计给出的非 major 修复版本为 Next 16.3.0。vinext 0.0.50 不声明 Next peer dependency，因此可尝试升级并以 vinext/静态双构建回归为准。

### GitHub 当前状态

- 本机 `gh` 已登录 `SquareSon`，Git 操作协议为 HTTPS，令牌具备 `repo` 与 `workflow` 等本任务需要的范围；本轮没有执行任何远程写操作。
- `SquareSon/SquareSon.github.io` 当前不存在或不可访问，因此可以在实施阶段优先创建同名用户主页仓库，获得根地址 `https://squareson.github.io/`；若用户希望保留该命名，也可改用项目站点仓库并部署到子路径。
- 由于当前没有既有 Pages 站点，不存在覆盖旧主页的风险。

## 技术与部署结论

### GitHub Pages（已按 2026-08-04 官方文档核对）

- GitHub Pages 是静态网站托管服务：发布 HTML、CSS、JavaScript，可在发布前运行构建流程；它本身不提供常驻后端、按请求执行的服务器函数或安全密钥存储。因此双语主页完全可行，但实时 LLM/RAG API 不能只靠 Pages 安全实现。
- GitHub Actions 自定义工作流可构建任意静态站生成器产物，并用官方 Pages actions 上传和部署，适合自动执行测试、构建、链接检查和发布。
- GitHub Pages 支持 `github.io` 域名、项目路径和自定义域名；正确配置时支持 HTTPS 与强制 HTTPS。
- 重要安全提醒：GitHub 官方说明 Pages 站点公开可访问，即使源仓库是私有仓库（取决于套餐）。原始论文、未公开稿件、电话、密钥、完整向量库和内部材料都不应进入发布产物。
- 当前官方限制包括：源码仓库建议不超过 1 GB、发布站点不超过 1 GB、单次部署 10 分钟超时、每月 100 GB 软带宽限制。个人主页预计远低于这些限制，但论文原始媒体不应无筛选地全部打包。
- 资料来源：GitHub Pages 官方的 “What is GitHub Pages?”、“Using custom workflows”、“GitHub Pages limits” 与 “Securing with HTTPS”。

### RAG 边界

- 纯 GitHub Pages 方案只能安全承载前端、本地搜索或预生成问答；若浏览器直接调用商业模型 API，就会暴露 API 密钥并允许滥用。
- 完整 RAG 需要独立的后端/API 层，负责密钥、检索、提示词、引用、限流和内容安全；GitHub Pages 前端通过 HTTPS/CORS 调用它。
- GitHub Actions 可做离线材料解析、脱敏、切块、生成索引和部署，但不是面向访客的实时请求服务器。

### 推荐前端栈

- 推荐 Astro + TypeScript 的静态输出。Astro 当前默认输出模式即为 `static`，官方将 GitHub Pages 标注为静态部署目标，并支持通过 GitHub Actions 发布。
- Astro 原生 i18n 可配置默认语言与 URL 前缀策略；使用 `defaultLocale: zh` 和 `prefixDefaultLocale: false` 可得到中文 `/`、英文 `/en/` 的目标结构。
- 与全量 SPA 相比，主页绝大部分内容可预渲染，仅聊天组件需要客户端脚本，更符合个人学术主页的性能、SEO 和长期维护需求。

### OpenAI 托管 RAG 方案核对（历史候选，已被多模型方案取代）

- 当前环境已添加 OpenAI 官方开发者文档 MCP，但新 MCP 需在重启/新任务后才会进入工具注册表；本轮改用限定在 OpenAI 官方域名的网页文档完成核对。
- OpenAI 官方支持在 Responses API 中使用 `file_search`，其后端由 Vector Store 管理处理后的文件和语义检索；Vector Store 还支持按文件属性过滤与直接搜索。该能力适合单一 OpenAI 生成链路，但不便于把同一检索结果独立交给四家外部模型。
- OpenAI 官方明确要求 API key 不得部署到浏览器，也不得提交到 Git 仓库；所有请求应经过自己的后端，并把密钥保存在环境变量或密钥管理服务中。
- 对本项目而言，OpenAI 方案仍需要两个账号层：OpenAI API 项目负责模型与托管检索；独立 serverless/edge 后端负责保护密钥、跨域、限流、滥用防护和向网页流式返回。
- 该组合曾是单供应商首版候选；用户要求 Qwen/GLM/DeepSeek/Kimi 可切换后，主方案改为 Cloudflare Vectorize + D1 FTS5 + Workers AI embedding/reranker，OpenAI 只保留为可选生成模型。
- OpenAI API 与 ChatGPT/Codex 订阅分开计费；需要在 API Platform 单独建立项目、支付方式/预付额度和项目级 key。
- OpenAI 项目可以配置模型权限、速率限制、预算与告警；应用端仍需做独立硬限流和配额，不能只依赖平台预算设置。

### 推荐实时后端

- 推荐 Cloudflare Worker 作为 GitHub Pages 与 OpenAI 之间的薄后端：官方支持加密 Secrets 和标准流式响应，适合保存 `OPENAI_API_KEY` 并把模型输出逐步转发给网页。
- 公开聊天接口必须有防滥用。Cloudflare Turnstile 可独立嵌入 GitHub Pages，但 token 必须由 Worker 调用 Siteverify 服务端验证；只做前端验证无效。
- 该选择会新增 Cloudflare 账号/授权依赖。若用户不希望增加账号，必须改用其他 serverless 后端；不能退回“在浏览器里放 OpenAI key”。

### 多模型 API 核对（2026-08-04）

- Qwen：阿里云百炼/Model Studio 官方提供 OpenAI-compatible 接口，API Key 与 endpoint 受地域/工作空间影响；应用开发应使用通用按量 API Key，不使用仅限编程工具的 Coding Plan Key。
- GLM：智谱开放平台提供标准 HTTP Chat Completions、Bearer API Key、流式输出，并兼容 OpenAI SDK；通用端点为 `https://open.bigmodel.cn/api/paas/v4`。
- DeepSeek：官方 API 同时兼容 OpenAI/Anthropic 格式，OpenAI 兼容地址为 `https://api.deepseek.com`，支持流式 Chat Completions。
- Kimi：Moonshot/Kimi 官方 Chat Completions 端点为 `https://api.moonshot.cn/v1/chat/completions`，使用 Bearer Token，并返回与 OpenAI Chat Completions 相近的消息、usage 与错误结构。
- 四家均可以纳入统一的服务端 provider adapter，但不能假设参数完全一致；思考模式、错误码、模型名、上下文限制和 usage 字段需要逐家适配并做契约测试。
- 多模型切换只作用于“答案生成层”。检索 embedding 必须固定在一个版本化模型上；若更换 embedding 模型，需要重建全部向量，不能把不同 embedding 模型生成的向量混入同一索引。
- 2026-08-04 复核当前模型别名：阿里云百炼推荐 `qwen3.7-plus`，智谱官方示例使用 `glm-5`，DeepSeek 官方已在 2026-07-24 停用旧 `deepseek-chat`/`deepseek-reasoner` 别名并改用 `deepseek-v4-flash`/`deepseek-v4-pro`。因此默认采用前三个当前别名，但全部允许由环境变量覆盖。
- Moonshot 官方站点未被搜索索引稳定收录；Kimi 适配器默认值暂设为 `kimi-k2.5`，部署时必须以实际账号控制台可调用模型为准，并可用 `KIMI_MODEL` 无代码覆盖。

### 供应商中立 RAG 基础设施核对（2026-08-04）

- Cloudflare Vectorize 已正式可用，可由 Worker 直接查询任意兼容维度的 dense embeddings，并支持 namespace 与 metadata filter；适合把 `public=true`、语言、来源类型、年份等过滤条件放在检索前执行。
- Cloudflare D1 支持 SQLite FTS5，可承担关键词/BM25 路径与知识块正文、来源、FAQ、配额计数等结构化数据；中文索引需在入库和查询时执行一致的分词，不能依赖默认英文式空格分词。
- Workers AI 提供托管的 `@cf/baai/bge-m3` 多语言 embedding 和 `@cf/baai/bge-reranker-base` 重排模型。它们运行在 Cloudflare 的 serverless GPU 上，因此本项目默认架构不需要用户本地 GPU。
- 推荐检索链路为：BGE-M3 dense top-K + D1 FTS5 keyword top-K → Reciprocal Rank Fusion（RRF）合并 → BGE reranker 重排 → 证据去重/上下文预算装配。这样同时覆盖“语义相近”和“论文名、缩写、指标、模型名精确命中”。
- Pagefind 可在 Astro 静态构建后生成浏览器端静态搜索索引。它适合作为完全不调用 Worker/模型 API 的最终降级层，并能与预生成的中英文 FAQ 一起随 GitHub Pages 发布。
- 供应商中立架构将原计划的 OpenAI Vector Store/`file_search` 移出主路径；OpenAI 保留为可选回答模型，不再拥有检索层控制权。

## 风险与待确认项

- 简历中包含未被 Google Scholar 收录的 `Under Review`/研究中工作；主页公开论文列表不展示这些条目，项目页如需提及只能标记为研究工作，不表述为已发表论文。
- 论文数量、作者顺序、发表状态和论文链接以 Google Scholar 定向同步结果为准，并保留同步日期。
- 医疗机器人相关内容需要避免让聊天机器人生成诊断、治疗建议或未经材料支持的临床效果宣称。
- 论文授权页在 DOCX 中未勾选公开属性，但用户已在本任务明确授权论文全文与论文图片公开；实施时在公开清单中记录该授权。
- 发布核查确认本机 Wrangler 未认证 Cloudflare；在用户完成一次 OAuth/控制台授权前，不能创建或发布 Worker、D1、Vectorize 与 Workers AI 绑定。GitHub Pages 的静态降级不受影响。

## 用户公开授权更新（2026-08-04）

- 英文姓名：`Zi Fang`。
- 头像和机构邮箱：允许公开。
- 简历中的机构邮箱确认为 `fangzi508@sjtu.edu.cn`；公开页面只使用该邮箱，不使用简历中的手机号/微信。
- 博士论文全文：允许公开；论文中的图片均允许用于主页。
- 论文权威来源：Google Scholar 个人主页 `https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&hl=zh-CN`；简历和论文成果目录仅作为内容理解材料，不再作为论文状态权威源。
- 专利：不重要且不披露；从主页信息架构、公开知识库和 RAG 回答范围中移除。
- 网页读取器无法直接打开该 Google Scholar URL，搜索引擎也未命中指定用户 ID，但通过只读 HTTP 已成功获取本人主页；实施时采用“URL 定向同步 + 本地缓存 + 人工复核”，不依赖搜索引擎发现。

### Google Scholar 权威快照（2026-08-04）

- 主页姓名：Zi Fang；机构：Shanghai Jiao Tong University；公开条目共 11 篇。
- 条目包括：
  1. Neural-Guided RRT*: Learning-Based Planning of Entry Point and Puncture Path for Steerable Bevel-Tip Needle Insertion（RA-L, 2025）
  2. Prediction for loosening life of bolted joints using IMUs with dimensionality reduction（IEEE TIM, 2023）
  3. Prior skeleton based online deep reinforcement learning for coronary artery centerline extraction（2023）
  4. Reinforcement Learning-Based Cooperative Fault-Tolerant Control for Multi-Actuator System With Uncertain Parameters and State Constraints（IEEE TAES, 2025）
  5. Fault diagnosis method for industrial robots based on dimension reduction and random forest（M2VIP, 2021）
  6. Coarse-to-VoI: A Two-Stage Framework for Coronary Artery Segmentation in 3D Computed Tomography Angiography（2025）
  7. GLA-NeRF: global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound（Physics in Medicine and Biology, 2026）
  8. Design, Modeling, and Validation of a 6-DoF Wearable Puncture Robot（RA-L, 2026）
  9. Design and Control of a Robotic System for Coronary Interventions（ROBIO, 2025）
  10. Design and Implementation of a 4-DOF Wearable Assisted Puncture Robot（ICIRA, 2025）
  11. A Novel Deep Learning Enhanced Particle Swarm Optimization for Puncture Path Planning（ICIRA, 2025）
- 引用数会变化，只能显示为“同步日期明确的动态数据”或在构建时更新；论文标题、作者、发表载体和年份作为权威事实字段。
- Google Scholar 当前没有列出简历中的 UPI-NeRF 和 2026 PRAI 甲状腺超声分割论文，因此它们不进入“公开论文”列表；如需展示，可在项目页标记为研究工作/在研稿件，但不能表述为 Scholar 已收录论文。

### 公开 RAG 语料审计（2026-08-04）

- 首次离线摄取生成 110 个片段，其中 100 个来自博士论文、10 个来自人工核对的中英文公开事实。
- 所有片段都携带稳定 ID、内容哈希、来源、标题路径、证据级别、语言、公开标记和索引版本，方便引用与增量重建。
- 隐私关键词扫描没有在正文中发现手机号、专利、微信、身份证、学号、授权书或独创性声明；字符串 `186` 的命中只来自 SHA-256 哈希，不是材料内容。
- 质量检查发现章节切换时会把 120 字重叠窗口误写成独立片段，且少数摘要段超过目标长度；已修正为“仅在存在新正文时落块”，并对超长段落先按句界切分。
- 第二次复核发现初版边界正则把目录中的“参考文献\t页码”误判为正文结尾，只覆盖了摘要；实际正文“参考文献”位于抽取文本约 157k 字符处。终止条件已收紧为不带页码的独立标题行。
- Word 的纯文本抽取不保留正文中的标题层级，而 HTML 转换可稳定得到 168 个 `h1`–`h4` 标题；正式摄取改用 HTML 结构，只抽取正文段落并忽略图片数据，以保留章节级引用路径且避免目录页码污染。
- 最终结构化输出为 313 个公开片段：295 个论文正文片段、18 个人工核对的中英文事实；论文片段覆盖第 1–6 章，长度 94–719 字，总正文约 140k 字符，参考文献与成果目录已排除。
- 最终审计无重复 ID；手机号、专利、微信、身份证、学号、独创性声明和授权书扫描均为零命中。
- 为避免英文查询在无向量绑定时只能依赖跨语言 embedding，人工核对事实扩充为 9 组中英文对照（18 个片段）；人物、教育、研究链、证据边界、四个项目与论文概览均可直接进行英文关键词召回。
- 30 个中英文离线事实问题上，静态词法基线达到 Recall@1 0.933、Recall@6 1.000、MRR 0.957；该基线是向量/RRF/重排启用前的最低回归门槛。
- 另对 10 个隐私索取、专利索取、提示词注入和个体医疗建议问题增加确定性策略响应；这些请求不进入模型和配额链路。
