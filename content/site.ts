export type Locale = "zh" | "en";

export type LocalizedText = Record<Locale, string>;

export const profile = {
  name: { zh: "方子", en: "Zi Fang" },
  role: {
    zh: "上海交通大学机械工程博士研究生",
    en: "Ph.D. Candidate in Mechanical Engineering at Shanghai Jiao Tong University",
  },
  focus: {
    zh: "三维感知 · 具身智能 · 医疗机器人",
    en: "3D Perception · Embodied Intelligence · Medical Robotics",
  },
  intro: {
    zh: "研究如何从不完美的医学影像与多传感器观测中，恢复连续、可信、可用于机器人决策的三维世界。",
    en: "I study how imperfect medical images and multi-sensor observations can become continuous, trustworthy 3D worlds for robotic decision-making.",
  },
  email: "fangzi508@sjtu.edu.cn",
  scholar: "https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&hl=zh-CN",
  github: "https://github.com/SquareSon",
  image: "/images/profile/zi-fang.png",
};

export const researchSteps = [
  {
    index: "01",
    title: { zh: "可信观测", en: "Trustworthy observation" },
    text: {
      zh: "识别有效接触、设备域差异与低质量超声观测。",
      en: "Detect valid contact, device-domain shifts, and low-quality ultrasound observations.",
    },
  },
  {
    index: "02",
    title: { zh: "连续表征", en: "Continuous representation" },
    text: {
      zh: "以神经场连接声学物理、强度形成与连续三维结构。",
      en: "Use neural fields to connect acoustic physics, intensity formation, and continuous 3D structure.",
    },
  },
  {
    index: "03",
    title: { zh: "空间统一", en: "Spatial unification" },
    text: {
      zh: "联合优化多扫查位姿、局部抖动、形变与场景表征。",
      en: "Jointly optimize multi-sweep poses, local jitter, deformation, and scene representation.",
    },
  },
  {
    index: "04",
    title: { zh: "语义建模", en: "Semantic modeling" },
    text: {
      zh: "从二维低标注观测构建组织、病灶与针体的三维语义。",
      en: "Build 3D semantics for tissue, lesions, and needles from low-label 2D observations.",
    },
  },
  {
    index: "05",
    title: { zh: "物理坐标", en: "Physical coordinates" },
    text: {
      zh: "把图像、位姿、三维场和器械工作点连接到导航原理样机。",
      en: "Connect images, poses, 3D fields, and instrument workpoints in a navigation prototype.",
    },
  },
] as const;

export const projects = [
  {
    id: "physics-field",
    number: "01",
    title: { zh: "物理一致的三维超声神经场", en: "Physics-consistent 3D ultrasound neural fields" },
    subtitle: {
      zh: "从声学扫描线到连续介质场",
      en: "From acoustic scanlines to continuous medium fields",
    },
    description: {
      zh: "将列级有效接触筛选、瑞利背散射与方向参数化反射纳入连续神经场，在三维重建的同时保留可解释的声学形成机制。",
      en: "A continuous neural field combining column-level contact screening, Rayleigh backscatter, and directional reflection to preserve interpretable acoustic formation during 3D reconstruction.",
    },
    tags: ["NeRF", "3DGS", "Inverse Rendering", "Ultrasound"],
    accent: "blue",
    image: undefined,
  },
  {
    id: "multi-sweep",
    number: "02",
    title: { zh: "多扫查配准与规范空间", en: "Multi-sweep alignment in canonical space" },
    subtitle: {
      zh: "GLA-NeRF · 位姿—表征协同优化",
      en: "GLA-NeRF · joint pose–representation optimization",
    },
    description: {
      zh: "把扫查级全局偏差、帧级高频抖动与受力形变分层处理，以外观检索、几何内点和连续轨迹约束实现空间统一。",
      en: "Separates sweep-level bias, frame-level jitter, and force-conditioned deformation, combining appearance retrieval, geometric inliers, and continuous-trajectory constraints.",
    },
    tags: ["Registration", "SE(3)", "Lie B-spline", "Deformation"],
    accent: "red",
    image: undefined,
  },
  {
    id: "semantic-needle",
    number: "03",
    title: { zh: "组织语义与针体几何", en: "Tissue semantics and needle geometry" },
    subtitle: {
      zh: "低标注二维观测到连续三维语义",
      en: "Low-label 2D observations to continuous 3D semantics",
    },
    description: {
      zh: "通过输入域规范化、多任务分割与多视角条件场，恢复甲状腺、血管、结节和穿刺针的连续空间表达与针轴候选。",
      en: "Recovers continuous spatial representations and needle-axis candidates for thyroid, vessels, nodules, and puncture needles using domain normalization, multi-task segmentation, and multi-view conditional fields.",
    },
    tags: ["Segmentation", "Semantic Field", "Needle Geometry", "Low-label"],
    accent: "mint",
    image: "/images/research/semantic-workbench.png",
  },
  {
    id: "prototype",
    number: "04",
    title: { zh: "导航原理样机与空间坐标链", en: "Navigation prototype and spatial coordinate chain" },
    subtitle: {
      zh: "算法、标定、假体与机器人验证",
      en: "Algorithms, calibration, phantom, and robot validation",
    },
    description: {
      zh: "集成自由手超声、双目近红外定位、探头与针尖标定、三维工作台及可重复甲状腺假体验证，形成从观测到物理工作点的闭环。",
      en: "Integrates freehand ultrasound, stereo NIR tracking, probe and needle calibration, 3D workbenches, and repeatable thyroid-phantom validation into an observation-to-workpoint loop.",
    },
    tags: ["Medical Robotics", "Calibration", "Prototype", "Navigation"],
    accent: "amber",
    image: "/images/research/navigation-prototype.png",
  },
] as const;

export const publications = [
  {
    year: 2026,
    title: "GLA-NeRF: global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound",
    venue: "Physics in Medicine & Biology",
    selected: true,
  },
  {
    year: 2026,
    title: "Design, Modeling, and Validation of a 6-DoF Wearable Puncture Robot",
    venue: "IEEE Robotics and Automation Letters",
    selected: true,
  },
  {
    year: 2025,
    title: "Neural-Guided RRT*: Learning-Based Planning of Entry Point and Puncture Path for Steerable Bevel-Tip Needle Insertion",
    venue: "IEEE Robotics and Automation Letters",
    selected: true,
  },
  {
    year: 2025,
    title: "Coarse-to-VoI: A Two-Stage Framework for Coronary Artery Segmentation in 3D Computed Tomography Angiography",
    venue: "Research article",
    selected: true,
  },
  {
    year: 2025,
    title: "Reinforcement Learning-Based Cooperative Fault-Tolerant Control for Multi-Actuator System With Uncertain Parameters and State Constraints",
    venue: "IEEE Transactions on Aerospace and Electronic Systems",
    selected: false,
  },
  {
    year: 2025,
    title: "Design and Control of a Robotic System for Coronary Interventions",
    venue: "IEEE ROBIO",
    selected: false,
  },
  {
    year: 2025,
    title: "Design and Implementation of a 4-DOF Wearable Assisted Puncture Robot",
    venue: "ICIRA",
    selected: false,
  },
  {
    year: 2025,
    title: "A Novel Deep Learning Enhanced Particle Swarm Optimization for Puncture Path Planning",
    venue: "ICIRA",
    selected: false,
  },
  {
    year: 2023,
    title: "Prediction for loosening life of bolted joints using IMUs with dimensionality reduction",
    venue: "IEEE Transactions on Instrumentation and Measurement",
    selected: true,
  },
  {
    year: 2023,
    title: "Prior skeleton based online deep reinforcement learning for coronary artery centerline extraction",
    venue: "Research article",
    selected: false,
  },
  {
    year: 2021,
    title: "Fault diagnosis method for industrial robots based on dimension reduction and random forest",
    venue: "M2VIP",
    selected: false,
  },
] as const;

export const education = [
  {
    period: "2021 — 2026",
    degree: { zh: "机械工程 · 博士研究生", en: "Ph.D. Candidate · Mechanical Engineering" },
    school: { zh: "上海交通大学 · 机械与动力工程学院（机器人所）", en: "Shanghai Jiao Tong University · School of Mechanical Engineering" },
    detail: { zh: "博士课题：甲状腺超声隐式三维重建与穿刺手术导航系统研究", en: "Dissertation: implicit 3D thyroid ultrasound reconstruction and puncture-navigation systems" },
  },
  {
    period: "2017 — 2021",
    degree: { zh: "机械工程 · 工学学士", en: "B.Eng. · Mechanical Engineering" },
    school: { zh: "上海交通大学 · 机械与动力工程学院", en: "Shanghai Jiao Tong University · School of Mechanical Engineering" },
    detail: { zh: "试点班 · 院优秀毕业生", en: "Pilot honors program · Outstanding graduate of the school" },
  },
] as const;

export const faq = [
  {
    id: "research",
    keywords: ["研究", "方向", "三维", "感知", "research", "3d", "focus"],
    question: { zh: "你的主要研究方向是什么？", en: "What are your main research areas?" },
    answer: {
      zh: "我的研究围绕三维感知、具身智能与医疗机器人，重点是自由手超声三维重建、多扫查配准、组织—器械语义建模，以及把算法连接到穿刺导航原理样机。",
      en: "My research spans 3D perception, embodied intelligence, and medical robotics, with emphasis on freehand ultrasound reconstruction, multi-sweep registration, tissue–instrument semantics, and navigation prototypes.",
    },
    source: { zh: "研究主线", en: "Research thread" },
    href: "#research",
  },
  {
    id: "thesis",
    keywords: ["论文", "博士", "甲状腺", "超声", "thesis", "dissertation", "thyroid", "ultrasound"],
    question: { zh: "博士论文解决了什么问题？", en: "What problem does the dissertation address?" },
    answer: {
      zh: "论文面向甲状腺超声引导穿刺，把可信观测、连续三维重建、多扫查空间统一、组织与针体语义、物理坐标链串成一条完整方法链，并通过假体和原理样机验证模块连接的可行性。",
      en: "The dissertation targets ultrasound-guided thyroid puncture and connects trustworthy observation, continuous 3D reconstruction, multi-sweep alignment, tissue/needle semantics, and a physical coordinate chain, validated at module and prototype level on phantoms.",
    },
    source: { zh: "博士论文摘要与结论", en: "Dissertation abstract and conclusions" },
    href: "#research",
  },
  {
    id: "gla",
    keywords: ["gla", "nerf", "配准", "多扫查", "registration", "multi-sweep"],
    question: { zh: "GLA-NeRF 的核心思路是什么？", en: "What is the core idea behind GLA-NeRF?" },
    answer: {
      zh: "GLA-NeRF 把多扫查偏差分成全局扫查级偏差与局部帧级误差，通过外观检索、几何一致性和连续轨迹约束联合优化位姿与神经场，使多次自由手超声观测对齐到规范空间。",
      en: "GLA-NeRF separates multi-sweep misalignment into global sweep-level bias and local frame-level error, jointly optimizing poses and the neural field with appearance retrieval, geometric consistency, and continuous-trajectory constraints.",
    },
    source: { zh: "GLA-NeRF · PMB 2026", en: "GLA-NeRF · PMB 2026" },
    href: "#publications",
  },
  {
    id: "evidence",
    keywords: ["临床", "精度", "安全", "证据", "clinical", "accuracy", "safety", "evidence"],
    question: { zh: "系统是否已经完成临床验证？", en: "Has the system completed clinical validation?" },
    answer: {
      zh: "没有。当前证据支持方法、模块和假体原理样机层面的结论；分项标定残差不能外推为端到端穿刺精度，临床安全性也不在现有实测范围内。",
      en: "No. Current evidence supports method-, module-, and phantom-prototype-level conclusions. Component calibration residuals must not be interpreted as end-to-end puncture accuracy, and clinical safety has not been experimentally established.",
    },
    source: { zh: "博士论文证据边界", en: "Dissertation evidence boundaries" },
    href: "#about",
  },
  {
    id: "publications",
    keywords: ["论文", "发表", "文章", "publication", "paper", "scholar"],
    question: { zh: "在哪里查看完整论文列表？", en: "Where can I find the full publication list?" },
    answer: {
      zh: "公开论文以 Google Scholar 为准。本站快照于 2026 年 8 月同步到 11 条记录，成果区展示其中的代表作。",
      en: "Google Scholar is the authoritative publication source. This site snapshot contains 11 records as of August 2026, with selected works highlighted on the page.",
    },
    source: { zh: "Google Scholar", en: "Google Scholar" },
    href: profile.scholar,
  },
  {
    id: "contact",
    keywords: ["联系", "邮箱", "合作", "contact", "email", "collaboration"],
    question: { zh: "如何联系你？", en: "How can I contact you?" },
    answer: {
      zh: `欢迎通过上海交通大学机构邮箱 ${profile.email} 联系我，讨论三维感知、医学影像、医疗机器人与研究合作。`,
      en: `You are welcome to contact me at ${profile.email} to discuss 3D perception, medical imaging, medical robotics, or research collaboration.`,
    },
    source: { zh: "公开联系方式", en: "Public contact" },
    href: `mailto:${profile.email}`,
  },
] as const;

export const ui = {
  zh: {
    nav: ["研究", "项目", "论文", "经历", "问答"],
    navIds: ["research", "projects", "publications", "about", "ask"],
    explore: "探索研究",
    ask: "询问我的研究",
    selectedWorks: "代表工作",
    allWorks: "在 Google Scholar 查看全部 11 篇",
    researchKicker: "RESEARCH THREAD",
    researchTitle: "从可信观测，到可执行的物理坐标",
    researchLead: "博士研究沿一条可追溯的方法链展开：每一步既解决上游不确定性，也为下一步提供带边界的证据。",
    projectsKicker: "SELECTED PROJECTS",
    projectsTitle: "算法最终要抵达真实世界",
    publicationsKicker: "PUBLICATIONS",
    publicationsTitle: "以公开记录为准的研究成果",
    aboutKicker: "BACKGROUND",
    aboutTitle: "机械工程训练，贯穿感知、算法与系统",
    askKicker: "ASK MY RESEARCH",
    askTitle: "从材料里找答案，而不是凭空补全",
    askLead: "选择一个模型，询问论文、项目与研究经历。回答会引用公开材料；模型不可用时自动切换为静态资料检索。",
    contact: "联系我",
    scholar: "Google Scholar",
    language: "EN",
    languageLabel: "Switch to English",
    snapshot: "论文数据同步于 2026.08",
  },
  en: {
    nav: ["Research", "Projects", "Publications", "Background", "Ask"],
    navIds: ["research", "projects", "publications", "about", "ask"],
    explore: "Explore research",
    ask: "Ask my research",
    selectedWorks: "Selected work",
    allWorks: "View all 11 publications on Google Scholar",
    researchKicker: "RESEARCH THREAD",
    researchTitle: "From trustworthy observation to actionable physical coordinates",
    researchLead: "My doctoral work follows a traceable method chain: each step resolves upstream uncertainty and creates bounded evidence for the next.",
    projectsKicker: "SELECTED PROJECTS",
    projectsTitle: "Algorithms should ultimately reach the physical world",
    publicationsKicker: "PUBLICATIONS",
    publicationsTitle: "Research output grounded in public records",
    aboutKicker: "BACKGROUND",
    aboutTitle: "Mechanical-engineering training across perception, algorithms, and systems",
    askKicker: "ASK MY RESEARCH",
    askTitle: "Find answers in evidence—not plausible completion",
    askLead: "Choose a model and ask about papers, projects, or experience. Answers cite public materials; if models are unavailable, the assistant automatically switches to static research search.",
    contact: "Contact",
    scholar: "Google Scholar",
    language: "中",
    languageLabel: "切换到中文",
    snapshot: "Publication snapshot: Aug 2026",
  },
} as const;
