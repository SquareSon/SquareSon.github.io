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

<div class="notice"><strong>证据边界：</strong>当前公开结果支持方法、模块和假体原理样机层面的结论；分项标定残差不能外推为端到端穿刺精度，现有材料也不构成临床安全性或有效性声明。</div>

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

<h1 id="selected-work" class="section-title">代表研究：从状态感知到具身医疗机器人</h1>

<p>我的工作不是彼此孤立的项目：早期从机器人多传感时序中学习紧凑、可判别的状态表征；博士阶段将同样的“可信观测”问题推进到超声影像、连续三维场和多扫查空间统一，最终连接到导航坐标、路径规划和物理机器人。</p>

<ol class="trajectory-strip" aria-label="研究工作脉络">
  <li><span>01</span>多传感状态</li>
  <li><span>02</span>可信超声观测</li>
  <li><span>03</span>连续三维空间</li>
  <li><span>04</span>规划与物理执行</li>
</ol>

<div class="paper-box research-trajectory-card">
  <div class="paper-box-image">
    <span class="badge">2021—2023</span>
    <div class="paper-visual visual-condition" role="img" aria-label="从 IMU、电流与编码器时序到紧凑状态表征和故障或寿命输出的示意图">
      <div class="signal-stack"><i></i><i></i><i></i></div><b>特征选择<br>与降维</b><div class="state-map"><span></span><span></span><span></span><span></span></div>
      <small>IMU / current / encoder → compact state</small>
    </div>
  </div>
  <div class="paper-box-text">
    <h2>起点：把多传感器时序变成可用的机器状态</h2>
    <p>在大型航天器姿态调节 AGV 项目中，我从 IMU、电流与编码器信号中提取时域/频域特征，再通过无效、无关、冗余特征剔除和降维建立稠密状态表征，支持故障分类和螺栓松动寿命预测。</p>
    <p>这段工作建立了后续研究的基本方法观：在做决策之前，先判断观测是否可信，再从高维、冗余和受噪声干扰的数据中提取有效状态。</p>
  </div>
</div>

<div class="paper-box research-trajectory-card">
  <div class="paper-box-image">
    <span class="badge">博士论文主线</span>
    <img src="/images/research/semantic-workbench.png" alt="甲状腺超声强度、组织语义与针体几何的三维工作台" loading="lazy">
  </div>
  <div class="paper-box-text">
    <h2>核心：从可信超声观测到连续三维解剖空间</h2>
    <p>博士论文先处理探头接触不稳定和设备域差异，再将超声背散射、方向性反射与连续神经场结合，并把多扫查误差分解为 sweep 级全局偏差、frame 级局部抖动与受力形变。</p>
    <p>在统一规范空间中，强度场、组织语义和针体几何不再是互不相干的二维切片，而是可供机器人查询和规划的连续三维表征。</p>
  </div>
</div>

<div class="paper-box research-trajectory-card">
  <div class="paper-box-image">
    <span class="badge">从算法到系统</span>
    <img src="/images/research/navigation-prototype.png" alt="自由手超声采集、近红外定位和机器人轨迹验证原理样机" loading="lazy">
  </div>
  <div class="paper-box-text">
    <h2>落点：将三维表征连接到导航、规划与机器人</h2>
    <p>通过双目近红外定位、N 线探头标定、针尖枢轴标定和坐标变换链，博士工作将图像中的组织—器械几何连到物理空间；可重复甲状腺假体、导航工作台和轨迹验证装置用于检查模块之间的坐标连接。</p>
    <p>这条线继续延伸到柔性针路径规划和小尺寸穿刺机器人，目标是让感知结果真正进入具有几何、运动学和安全约束的具身决策闭环。</p>
  </div>
</div>

<h1 id="publications" class="section-title">论文</h1>

<p class="publication-note">论文状态以 <a href="https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&amp;hl=zh-CN">Google Scholar</a> 为准。以下 11 条记录同步于 2026 年 8 月 4 日；不披露尚未正式发布的工作，也不固定展示会持续变化的引用数。</p>

<div class="publication-access-note"><strong>PDF 说明：</strong>本站当前不直接托管出版社排版版 PDF。IEEE 的非开放许可 Version of Record / proof 通常不允许直接上传；IOP 允许作者按条款在个人网站自存档 Accepted Manuscript，但不等于可上传订阅文章的最终排版版。因此现阶段提供 Scholar/DOI 链接，具体以每篇论文的许可协议为准。<a href="https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/guidelines-and-policies/post-publication-policies/">IEEE 发布政策</a> · <a href="https://publishingsupport.iopscience.iop.org/author-rights-policies/">IOP 作者权利</a></div>

<h2 class="publication-subtitle">重点一作工作</h2>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <span class="badge">PMB 2026</span>
    <div class="paper-visual visual-glanerf" role="img" aria-label="多扫查超声序列经全局与局部对齐后融合为规范三维场的示意图">
      <div class="sweep-planes"><i></i><i></i><i></i></div><span class="visual-arrow">→</span><div class="canonical-volume"><i></i><b>Canonical<br>3D field</b></div>
      <small>global alignment + local pose refinement</small>
    </div>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:kNdYIx-mwKoC">GLA-NeRF: global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Li, B. Liu, J. Yao, F. Jing, Z. Fu, J. Fei, R. Xie · <em>Physics in Medicine and Biology</em>, 2026</p>
    <p>将多扫查位姿偏差按空间和时间尺度分层处理：用外观检索与几何一致性完成 sweep 级全局配准，再用连续轨迹约束校正 frame 级局部抖动，并与神经场联合优化。</p>
    <p class="paper-links"><a href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:kNdYIx-mwKoC">Scholar 记录</a></p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <span class="badge">IEEE TIM 2023</span>
    <div class="paper-visual visual-life" role="img" aria-label="IMU 被动监测信号经特征压缩后预测螺栓剩余松动寿命的示意图">
      <div class="imu-nodes"><i>IMU</i><i>IMU</i><i>IMU</i></div><div class="feature-funnel"><span>972</span><span>200</span></div><div class="life-gauge"><b>RBLL</b><i></i></div>
      <small>passive sensing → compact features → remaining life</small>
    </div>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://doi.org/10.1109/TIM.2023.3276014">Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, Z. Fu, L. Zhou, Z. Fu, Y. Guan · <em>IEEE Transactions on Instrumentation and Measurement</em> 72, 1–17, 2023</p>
    <p>用粘贴式 IMU 进行非侵入式被动监测，从振动响应中提取多域特征，经缺失处理、去冗余与降维后预测剩余螺栓松动寿命，把故障检测推进到更主动的维护时机预测。</p>
    <p class="paper-links"><a href="https://doi.org/10.1109/TIM.2023.3276014">DOI</a> · <a href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:d1gkVwhDpl0C">Scholar 记录</a></p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <span class="badge">M2VIP 2021</span>
    <div class="paper-visual visual-diagnosis" role="img" aria-label="机器人多传感器信号经预处理、特征降维与随机森林完成故障分类的示意图">
      <span>signals</span><b>→</b><span>features</span><b>→</b><span>DR</span><b>→</b><span>RF</span>
      <div class="diagnosis-labels"><i>normal</i><i>fault A</i><i>fault B</i></div>
    </div>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://doi.org/10.1109/M2VIP49856.2021.9665168">Fault Diagnosis Method for Industrial Robots based on Dimension Reduction and Random Forest</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Zhou, Z. Fu, Z. Fu, Y. Guan · <em>27th International Conference on Mechatronics and Machine Vision in Practice</em>, 2021</p>
    <p>融合加速度计、电流传感器与角度编码器，对时域/频域多特征进行预处理和分阶段降维，再比较 SVM、Random Forest 与 XGBoost 的故障分类能力。这项工作奠定了后续对“可信观测—紧凑状态—任务决策”的系统理解。</p>
    <p class="paper-links"><a href="https://doi.org/10.1109/M2VIP49856.2021.9665168">DOI</a> · <a href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:u5HHmVD_uO8C">Scholar 记录</a></p>
  </div>
</article>

<h2 class="publication-subtitle">其他公开论文</h2>

<ol class="publication-list compact-publications">
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:MXK_kJrjxJIC">Design, Modeling, and Validation of a 6-DoF Wearable Puncture Robot</a><br><span class="publication-authors">J. Yao, C. Wu, B. Liu, Z. Fu, <span class="self-author">Z. Fang</span>, F. Jing, X. Jiang</span> · <span class="publication-venue">IEEE Robotics and Automation Letters, 2026.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:Se3iqnhoufwC">Neural-Guided RRT*: Learning-Based Planning of Entry Point and Puncture Path for Steerable Bevel-Tip Needle Insertion</a><br><span class="publication-authors">J. Yao, Z. Fu, <span class="self-author">Z. Fang</span>, Z. Guo, F. Jing</span> · <span class="publication-venue">IEEE Robotics and Automation Letters 10(9), 9016–9023, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:5nxA0vEk-isC">Coarse-to-VoI: A Two-Stage Framework for Coronary Artery Segmentation in 3D Computed Tomography Angiography</a><br><span class="publication-authors">F. Jing, Z. Fu, <span class="self-author">Z. Fang</span>, J. Yao, F. Meng, B. Liu</span> · <span class="publication-venue">International Conference on Computer Vision, Image Processing and Applications, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:UebtZRa9Y70C">Reinforcement Learning-Based Cooperative Fault-Tolerant Control for Multi-Actuator System With Uncertain Parameters and State Constraints</a><br><span class="publication-authors">B. Liu, Z. Fu, Z. Hua, <span class="self-author">Z. Fang</span>, F. Jing, J. Yao</span> · <span class="publication-venue">IEEE Transactions on Aerospace and Electronic Systems, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:8k81kl-MbHgC">Design and Control of a Robotic System for Coronary Interventions</a><br><span class="publication-authors">F. Meng, <span class="self-author">Z. Fang</span>, F. Jing, Z. Fu, Z. Fu</span> · <span class="publication-venue">IEEE International Conference on Robotics and Biomimetics (ROBIO), 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:0EnyYjriUFMC">Design and Implementation of a 4-DOF Wearable Assisted Puncture Robot</a><br><span class="publication-authors">C. Wu, Z. Fu, J. Yao, <span class="self-author">Z. Fang</span>, B. Liu, F. Jing</span> · <span class="publication-venue">International Conference on Intelligent Robotics and Applications, 184–196, 2025.</span></li>
  <li><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:hqOjcs7Dif8C">A Novel Deep Learning Enhanced Particle Swarm Optimization for Puncture Path Planning</a><br><span class="publication-authors">J. Yao, Z. Fu, C. Wu, <span class="self-author">Z. Fang</span>, B. Liu, F. Jing</span> · <span class="publication-venue">International Conference on Intelligent Robotics and Applications, 166–174, 2025.</span></li>
  <li><a class="publication-title" href="https://doi.org/10.1177/09544119231167926">Prior skeleton based online deep reinforcement learning for coronary artery centerline extraction</a><br><span class="publication-authors">Z. Fu, Z. Fu, <span class="self-author">Z. Fang</span>, Z. Wang, J. Fei, R. Xie, H. Han</span> · <span class="publication-venue">Proceedings of the Institution of Mechanical Engineers, Part H 237(5), 557–570, 2023.</span></li>
</ol>

<h1 id="education" class="section-title">教育经历</h1>

<ul class="education-list">
  <li><span class="education-period">2021 — 2026</span><span><span class="education-degree">机械工程 · 博士研究生</span><br>上海交通大学 · 机械与动力工程学院（机器人研究所）<br>课题：甲状腺超声隐式三维重建与穿刺手术导航系统研究</span></li>
  <li><span class="education-period">2017 — 2021</span><span><span class="education-degree">机械工程 · 工学学士</span><br>上海交通大学 · 机械与动力工程学院<br>试点班 · 院优秀毕业生</span></li>
</ul>
