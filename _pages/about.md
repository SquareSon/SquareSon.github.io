---
title: "方子 | 三维感知、具身智能与医疗机器人"
description: "方子的学术主页：三维感知、具身智能、医学影像与医疗机器人研究。"
permalink: /
lang: zh-CN
nav_key: zh
nav_label: 主导航
menu_label: 打开导航
skip_label: 跳到正文
profile_label: 作者资料
---

<h1 id="about" class="section-title">关于我</h1>

<p class="page__lead"><strong>我正在寻找算法/研究岗位，重点关注三维感知与具身智能，也希望把这些能力用于医疗机器人等真实物理系统。</strong>我是方子（Zi Fang），上海交通大学机械与动力工程学院机器人研究所机械工程博士研究生，预计 2026 年 12 月毕业。</p>

<p class="profile-actions"><a class="button-link" href="/files/Zi-Fang-CV.pdf" download>下载公开版简历（PDF）</a><a href="mailto:fangzi508@sjtu.edu.cn">邮件联系</a><a href="https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&amp;hl=zh-CN">Google Scholar</a></p>

<p>我的博士课题面向甲状腺超声引导穿刺，将自由手超声观测、连续三维重建、多扫查空间统一、组织—器械语义建模与导航坐标链连成一条完整方法链。我关心的不只是数据集上的算法结果，也包括它们在标定、假体实验和机器人原理样机中能否组成可验证的系统。</p>

<ul class="research-keywords" aria-label="研究关键词">
  <li>3D Perception</li><li>Embodied Intelligence</li><li>Medical Robotics</li><li>Freehand Ultrasound</li><li>Neural Fields</li><li>Robot Navigation</li>
</ul>

<h1 id="research" class="section-title">研究方向</h1>

<div class="research-list">
  <section>
    <h2>三维医学感知</h2>
    <p>研究自由手超声中的有效接触、设备域差异、连续神经场、多扫查配准与三维语义重建。</p>
  </section>
  <section>
    <h2>具身空间智能</h2>
    <p>把图像、位姿、连续场景表征与组织—器械几何统一到可供机器人理解、规划和执行的空间坐标中。</p>
  </section>
  <section>
    <h2>医疗机器人系统</h2>
    <p>围绕穿刺与介入任务开展路径规划、器械设计、传感标定、导航软件与假体实验验证。</p>
  </section>
</div>

<h1 id="assistant" class="section-title">研究问答</h1>

<p>可以询问我的研究方向、博士论文、代表项目与公开论文。实时服务会先从公开材料中检索证据，再由所选模型回答；服务不可用时自动退化为静态 FAQ 与本页资料搜索。</p>

{% include assistant.html %}

<h1 id="selected-work" class="section-title">代表研究</h1>

<p>我的博士研究围绕医学影像中的观测、位姿、形变和连续三维表征展开，并进一步连接穿刺路径规划与小型机器人系统。以下四条主线与简历中的项目经历保持一致。</p>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-registration.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-registration.png" alt="统一位姿修正与规范空间映射" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>器械、影像位姿估计与位姿、形变、表征联合优化的 2D/3D 可变形配准</h2>
    <p class="paper-meta">2023.09 — 至今</p>
    <p>融合双目近红外相机与 IMU 估算探头位姿，并通过 N 线模型完成探头与超声图像的时空标定。多扫查偏差被解耦为 sweep 级全局刚性偏差、frame 级高频抖动和受力条件下的微分同胚形变场。</p>
    <p>分层特征点匹配、Lie 群 B 样条轨迹约束与受力条件 Morph 场分别处理这些误差，并与 NeRF/3DGS 表征联合优化，将影像、器械和组织映射到统一规范空间。</p>
  </div>
</div>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-segmentation.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-segmentation.png" alt="任务分支二维语义观测机制总体框架" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>超声规范化增强与多任务二维语义分割</h2>
    <p class="paper-meta">2024.09 — 2025.09</p>
    <p>从 Foundation 模型高维表征中进行流形分析，筛除探头接触不稳定造成的低质量观测；随后通过图像域有效成像响应建模与采集条件模拟，将不同设备和采集设置下的 B-mode 图像转换为更稳定的规范回声强度代理。</p>
    <p>共享编码器与任务分支联合处理甲状腺、结节、血管和穿刺针，并引入任务间语义引导、解剖几何约束、类别不均衡优化和细长针体拓扑监督，为后续三维重建提供可靠二维语义输入。</p>
  </div>
</div>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-semantic-field.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-semantic-field.png" alt="体素概率融合与三维语义神经场对比" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>NeRF/3DGS 和声学物理先验的三维逆渲染与语义场</h2>
    <p class="paper-meta">2024.06 — 至今</p>
    <p>利用位姿—图像对构建连续三维场，并将衰减、背散射和方向相关反射等超声传播先验纳入可微渲染，使隐式表征同时描述图像强度与介质物理属性。</p>
    <p>在强度场基础上，以连续语义场替代离散体素写入，将多视角二维概率观测融合为可任意坐标查询的三维解剖结构，为路径规划提供稠密、连续且多视角一致的空间表征。</p>
  </div>
</div>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-puncture-planning.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-puncture-planning.png" alt="柔性针在三维组织环境中的空间圆弧轨迹" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>折纸穿刺手术机器人与穿刺路径规划</h2>
    <p class="paper-meta">2026.01 — 至今</p>
    <p>设计面向头颈部穿刺的小尺寸五自由度机器人，以折纸支链构成上层三自由度并联机构，并与下层五杆二自由度机构组合，在紧凑尺寸内实现入针位姿调节。</p>
    <p>路径规划面向多组织三维解剖场景：BiT* 搜索满足柔性针运动约束并避开风险组织的渐近最优路径，学习模型进一步预测候选入针点与非均匀采样区域。</p>
  </div>
</div>

<h1 id="publications" class="section-title">论文</h1>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-gla-nerf.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-gla-nerf.png" alt="GLA-NeRF 用于超声图像配准总览图" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:kNdYIx-mwKoC">GLA-NeRF: global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Li, B. Liu, J. Yao, F. Jing, Z. Fu, J. Fei, R. Xie · <em>Physics in Medicine and Biology</em>, 2026</p>
    <p>将 sweep 级全局刚性偏差与 frame 级局部抖动分别建模，通过分层定位、连续轨迹正则和神经渲染误差共同修正多扫查位姿并学习规范空间表征。</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-upi-nerf.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-upi-nerf.png" alt="UPI-NeRF 超声物理先验神经渲染架构" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><span class="publication-title">UPI-NeRF: ultrasonic-physics-informed neural radiance fields for freehand 3D ultrasound</span></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, et al. · 研究稿件</p>
    <p>增强隐式神经表征，并以 Rayleigh 背散射、微表面反射和方向参数化构建显式超声渲染器，使自由手三维超声的纹理、界面和视角相关外观更符合成像物理。</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-eidc.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-eidc.png" alt="EIDC 图像域响应建模与规范回声强度表征机制" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><span class="publication-title">From B-Mode Images to Canonical Echo-Intensity Representations for Robust Thyroid Ultrasound Segmentation</span></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Li, B. Liu, J. Yao, F. Jing, Z. Fu, J. Fei, R. Xie · <em>PRAI</em>, 2026</p>
    <p>EIDC 通过 phase-only 初始化、域级响应原型与图像级残差适配估计图像域成像响应，再结合面向采集条件的增强，将公开 B-mode 图像转换为更稳定的规范回声强度代理。</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-life-prediction.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-life-prediction.png" alt="基于 IMU 与降维的螺栓松动寿命预测流程" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://doi.org/10.1109/TIM.2023.3276014">Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, Z. Fu, L. Zhou, Z. Fu, Y. Guan · <em>IEEE Transactions on Instrumentation and Measurement</em> 72, 1–17, 2023</p>
    <p>从粘贴式 IMU 振动信号中提取多域特征，经异常处理、去噪、缺失值填补、标准化与降维后预测剩余螺栓松动寿命，为复杂装备的主动维护提供状态依据。</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-neural-rrt.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-neural-rrt.png" alt="Neural-Guided RRT 入口点选择与最优路径预测网络" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:Se3iqnhoufwC">Neural-Guided RRT*: Learning-Based Planning of Entry Point and Puncture Path for Steerable Bevel-Tip Needle Insertion</a></h2>
    <p class="paper-meta">J. Yao, Z. Fu, <strong>Z. Fang</strong>, Z. Guo, F. Jing · <em>IEEE Robotics and Automation Letters</em> 10(9), 9016–9023, 2025</p>
    <p>使用三维 U-Net 预测候选入针点和路径概率分布，引导 RRT* 的非均匀采样，并用满足斜尖柔性针运动学约束的空间圆弧完成树扩展。</p>
  </div>
</article>

<ul class="publication-list compact-publications">
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:MXK_kJrjxJIC">Design, Modeling, and Validation of a 6-DoF Wearable Puncture Robot</a><br><span class="publication-authors">J. Yao, C. Wu, B. Liu, Z. Fu, <span class="self-author">Z. Fang</span>, F. Jing, X. Jiang</span> · <span class="publication-venue">IEEE Robotics and Automation Letters, 2026.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:5nxA0vEk-isC">Coarse-to-VoI: A Two-Stage Framework for Coronary Artery Segmentation in 3D Computed Tomography Angiography</a><br><span class="publication-authors">F. Jing, Z. Fu, <span class="self-author">Z. Fang</span>, J. Yao, F. Meng, B. Liu</span> · <span class="publication-venue">International Conference on Computer Vision, Image Processing and Applications, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:UebtZRa9Y70C">Reinforcement Learning-Based Cooperative Fault-Tolerant Control for Multi-Actuator System With Uncertain Parameters and State Constraints</a><br><span class="publication-authors">B. Liu, Z. Fu, Z. Hua, <span class="self-author">Z. Fang</span>, F. Jing, J. Yao</span> · <span class="publication-venue">IEEE Transactions on Aerospace and Electronic Systems, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:8k81kl-MbHgC">Design and Control of a Robotic System for Coronary Interventions</a><br><span class="publication-authors">F. Meng, <span class="self-author">Z. Fang</span>, F. Jing, Z. Fu, Z. Fu</span> · <span class="publication-venue">IEEE International Conference on Robotics and Biomimetics (ROBIO), 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:0EnyYjriUFMC">Design and Implementation of a 4-DOF Wearable Assisted Puncture Robot</a><br><span class="publication-authors">C. Wu, Z. Fu, J. Yao, <span class="self-author">Z. Fang</span>, B. Liu, F. Jing</span> · <span class="publication-venue">International Conference on Intelligent Robotics and Applications, 184–196, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:hqOjcs7Dif8C">A Novel Deep Learning Enhanced Particle Swarm Optimization for Puncture Path Planning</a><br><span class="publication-authors">J. Yao, Z. Fu, C. Wu, <span class="self-author">Z. Fang</span>, B. Liu, F. Jing</span> · <span class="publication-venue">International Conference on Intelligent Robotics and Applications, 166–174, 2025.</span></li>
  <li><a class="publication-title" href="https://doi.org/10.1177/09544119231167926">Prior skeleton based online deep reinforcement learning for coronary artery centerline extraction</a><br><span class="publication-authors">Z. Fu, Z. Fu, <span class="self-author">Z. Fang</span>, Z. Wang, J. Fei, R. Xie, H. Han</span> · <span class="publication-venue">Proceedings of the Institution of Mechanical Engineers, Part H 237(5), 557–570, 2023.</span></li>
  <li><a class="publication-title" href="https://doi.org/10.1109/M2VIP49856.2021.9665168">Fault Diagnosis Method for Industrial Robots based on Dimension Reduction and Random Forest</a><br><span class="publication-authors"><span class="self-author">Z. Fang</span>, L. Zhou, Z. Fu, Z. Fu, Y. Guan</span> · <span class="publication-venue">27th International Conference on Mechatronics and Machine Vision in Practice, 2021.</span></li>
</ul>

<h1 id="education" class="section-title">教育经历</h1>

<ul class="education-list">
  <li><span class="education-period">2021 — 2026</span><span><span class="education-degree">机械工程 · 博士研究生</span><br>上海交通大学 · 机械与动力工程学院（机器人研究所）<br>课题：甲状腺超声隐式三维重建与穿刺手术导航系统研究</span></li>
  <li><span class="education-period">2017 — 2021</span><span><span class="education-degree">机械工程 · 工学学士</span><br>上海交通大学 · 机械与动力工程学院<br>试点班 · 院优秀毕业生</span></li>
  <li><span class="education-period">2014 — 2017</span><span><span class="education-degree">高中</span><br>宁波市镇海中学</span></li>
</ul>
