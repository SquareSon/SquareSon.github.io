---
title: "Zi Fang | 3D Perception, Embodied Intelligence & Medical Robotics"
description: "Academic homepage of Zi Fang: research in 3D perception, embodied intelligence, medical imaging, and medical robotics."
permalink: /en/
lang: en
nav_key: en
nav_label: Main navigation
menu_label: Open navigation
skip_label: Skip to content
profile_label: Author profile
---

<h1 id="about" class="section-title">About Me</h1>

<p class="page__lead"><strong>I am actively seeking research and algorithm roles in 3D perception and embodied intelligence, with medical robotics as a key application area.</strong> I am Zi Fang, a Ph.D. candidate in Mechanical Engineering at the Robotics Institute, Shanghai Jiao Tong University, expecting to graduate in December 2026.</p>

<p class="profile-actions"><a class="button-link" href="/files/Zi-Fang-CV.pdf" download>Download public CV (PDF)</a><a href="mailto:fangzi508@sjtu.edu.cn">Email</a><a href="https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&amp;hl=en">Google Scholar</a></p>

<p>My doctoral research focuses on ultrasound-guided thyroid puncture. It connects freehand-ultrasound observation, continuous 3D reconstruction, multi-sweep spatial alignment, tissue–instrument semantic modeling, and a navigation coordinate chain. I care not only about benchmark results, but also about whether these methods form a verifiable system through calibration, phantom experiments, and robotic prototypes.</p>

<ul class="research-keywords" aria-label="Research keywords">
  <li>3D Perception</li><li>Embodied Intelligence</li><li>Medical Robotics</li><li>Freehand Ultrasound</li><li>Neural Fields</li><li>Robot Navigation</li>
</ul>

<div class="notice"><strong>Evidence boundary:</strong> current public results support conclusions at method, module, and phantom-prototype levels. Component calibration residuals must not be interpreted as end-to-end puncture accuracy, and the materials do not establish clinical safety or effectiveness.</div>

<h1 id="research" class="section-title">Research Interests</h1>

<div class="research-list">
  <section>
    <h2>3D Medical Perception</h2>
    <p>Freehand-ultrasound contact quality, device-domain variation, continuous neural fields, multi-sweep registration, and 3D semantic reconstruction.</p>
  </section>
  <section>
    <h2>Embodied Spatial Intelligence</h2>
    <p>Unifying images, poses, continuous scene representations, and tissue–instrument geometry into spatial coordinates that robots can interpret, plan with, and act upon.</p>
  </section>
  <section>
    <h2>Medical Robotic Systems</h2>
    <p>Path planning, instrument design, sensing and calibration, navigation software, and phantom-based validation for puncture and intervention tasks.</p>
  </section>
</div>

<h1 id="assistant" class="section-title">Research Assistant</h1>

<p>Ask about my research, dissertation, selected projects, or public publications. The live service retrieves evidence from public materials before the selected model answers; if the service is unavailable, it automatically falls back to static FAQ and on-page search.</p>

{% include assistant.html %}

<h1 id="selected-work" class="section-title">Selected Research: from condition perception to embodied medical robotics</h1>

<p>These projects form a connected trajectory. My early work learned compact, discriminative machine states from multi-sensor time series. During my Ph.D., the same concern for trustworthy observations progressed through ultrasound imaging, continuous 3D fields, and multi-sweep spatial unification, before reaching navigation coordinates, path planning, and physical robots.</p>

<ol class="trajectory-strip" aria-label="Research trajectory">
  <li><span>01</span>Multi-sensor state</li>
  <li><span>02</span>Trustworthy ultrasound</li>
  <li><span>03</span>Continuous 3D space</li>
  <li><span>04</span>Planning and action</li>
</ol>

<div class="paper-box research-trajectory-card">
  <div class="paper-box-image">
    <span class="badge">2021–2023</span>
    <div class="paper-visual visual-condition" role="img" aria-label="IMU, current, and encoder time series transformed into compact condition representations and diagnostic or lifetime outputs">
      <div class="signal-stack"><i></i><i></i><i></i></div><b>feature<br>reduction</b><div class="state-map"><span></span><span></span><span></span><span></span></div>
      <small>IMU / current / encoder → compact state</small>
    </div>
  </div>
  <div class="paper-box-text">
    <h2>Starting point: turning multi-sensor time series into actionable machine states</h2>
    <p>In a large-spacecraft attitude-adjustment AGV project, I extracted time- and frequency-domain features from IMU, current, and encoder signals. Removing invalid, irrelevant, and redundant features and then reducing dimensionality produced compact states for fault classification and remaining bolt-loosening life prediction.</p>
    <p>This work established a principle that continues through my later research: determine whether an observation is trustworthy, then recover the task-relevant state from high-dimensional, redundant, and noisy data before making a decision.</p>
  </div>
</div>

<div class="paper-box research-trajectory-card">
  <div class="paper-box-image">
    <span class="badge">Dissertation core</span>
    <img src="/images/research/semantic-workbench.png" alt="3D workbench for thyroid-ultrasound intensity, tissue semantics, and needle geometry" loading="lazy">
  </div>
  <div class="paper-box-text">
    <h2>Core: from trustworthy ultrasound observations to continuous 3D anatomy</h2>
    <p>The dissertation first addresses unstable probe contact and device-domain variation, then combines ultrasound backscatter, directional reflection, and continuous neural fields. Multi-sweep error is decomposed into sweep-level global bias, frame-level local jitter, and force-conditioned deformation.</p>
    <p>Within a shared canonical space, intensity, tissue semantics, and needle geometry become a continuous 3D representation that robots can query and plan with, rather than disconnected 2D slices.</p>
  </div>
</div>

<div class="paper-box research-trajectory-card">
  <div class="paper-box-image">
    <span class="badge">Algorithms to systems</span>
    <img src="/images/research/navigation-prototype.png" alt="Proof-of-principle setup for freehand ultrasound acquisition, near-infrared tracking, and robot-trajectory validation" loading="lazy">
  </div>
  <div class="paper-box-text">
    <h2>Destination: connecting 3D representations to navigation, planning, and robots</h2>
    <p>Stereo NIR tracking, N-wire probe calibration, needle-tip pivot calibration, and coordinate transformations connect tissue–instrument geometry in images to physical space. Repeatable thyroid phantoms, navigation workbenches, and a trajectory-validation setup test the links between modules.</p>
    <p>This direction continues into flexible-needle path planning and compact puncture robots, aiming to place perception inside an embodied decision loop with geometric, kinematic, and safety constraints.</p>
  </div>
</div>

<h1 id="publications" class="section-title">Publications</h1>

<p class="publication-note"><a href="https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&amp;hl=en">Google Scholar</a> is the authoritative publication source. The 11 records below were synchronized on 4 August 2026. Unreleased work and dynamic citation counts are intentionally omitted.</p>

<div class="publication-access-note"><strong>PDF policy:</strong> this site currently does not host publisher-formatted PDFs. A non-open-access IEEE Version of Record or proof generally cannot be uploaded directly. IOP permits author self-archiving of an Accepted Manuscript on a personal website under its terms, but that is not the same as sharing the final subscription-formatted version. For now, the site links to Scholar and DOI records; the agreement for each article remains authoritative. <a href="https://journals.ieeeauthorcenter.ieee.org/become-an-ieee-journal-author/publishing-ethics/guidelines-and-policies/post-publication-policies/">IEEE posting policy</a> · <a href="https://publishingsupport.iopscience.iop.org/author-rights-policies/">IOP author rights</a></div>

<h2 class="publication-subtitle">Featured first-author work</h2>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <span class="badge">PMB 2026</span>
    <div class="paper-visual visual-glanerf" role="img" aria-label="Several ultrasound sweeps aligned globally and locally into a canonical 3D field">
      <div class="sweep-planes"><i></i><i></i><i></i></div><span class="visual-arrow">→</span><div class="canonical-volume"><i></i><b>Canonical<br>3D field</b></div>
      <small>global alignment + local pose refinement</small>
    </div>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:kNdYIx-mwKoC">GLA-NeRF: global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Li, B. Liu, J. Yao, F. Jing, Z. Fu, J. Fei, R. Xie · <em>Physics in Medicine and Biology</em>, 2026</p>
    <p>The method separates multi-sweep pose error by spatial and temporal scale: appearance retrieval and geometric consistency handle sweep-level global registration; continuous-trajectory constraints refine frame-level local jitter; the poses and neural field are then optimized jointly.</p>
    <p class="paper-links"><a href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:kNdYIx-mwKoC">Scholar record</a></p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <span class="badge">IEEE TIM 2023</span>
    <div class="paper-visual visual-life" role="img" aria-label="Passive IMU monitoring compressed into compact features for remaining bolt-loosening life prediction">
      <div class="imu-nodes"><i>IMU</i><i>IMU</i><i>IMU</i></div><div class="feature-funnel"><span>972</span><span>200</span></div><div class="life-gauge"><b>RBLL</b><i></i></div>
      <small>passive sensing → compact features → remaining life</small>
    </div>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://doi.org/10.1109/TIM.2023.3276014">Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, Z. Fu, L. Zhou, Z. Fu, Y. Guan · <em>IEEE Transactions on Instrumentation and Measurement</em> 72, 1–17, 2023</p>
    <p>Bonded IMUs provide non-invasive passive monitoring. Multi-domain vibration features are processed for missing values, redundancy, and dimensionality before predicting remaining bolt-loosening life, moving beyond fault detection toward proactive maintenance timing.</p>
    <p class="paper-links"><a href="https://doi.org/10.1109/TIM.2023.3276014">DOI</a> · <a href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:d1gkVwhDpl0C">Scholar record</a></p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <span class="badge">M2VIP 2021</span>
    <div class="paper-visual visual-diagnosis" role="img" aria-label="Industrial-robot sensor signals processed through feature extraction, dimensionality reduction, and random-forest fault classification">
      <span>signals</span><b>→</b><span>features</span><b>→</b><span>DR</span><b>→</b><span>RF</span>
      <div class="diagnosis-labels"><i>normal</i><i>fault A</i><i>fault B</i></div>
    </div>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://doi.org/10.1109/M2VIP49856.2021.9665168">Fault Diagnosis Method for Industrial Robots based on Dimension Reduction and Random Forest</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Zhou, Z. Fu, Z. Fu, Y. Guan · <em>27th International Conference on Mechatronics and Machine Vision in Practice</em>, 2021</p>
    <p>The work combines accelerometers, current sensors, and angle encoders, processes time- and frequency-domain features through staged dimensionality reduction, and compares SVM, Random Forest, and XGBoost for fault classification. It established my later framing of trustworthy observations, compact states, and task decisions.</p>
    <p class="paper-links"><a href="https://doi.org/10.1109/M2VIP49856.2021.9665168">DOI</a> · <a href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:u5HHmVD_uO8C">Scholar record</a></p>
  </div>
</article>

<h2 class="publication-subtitle">Other public papers</h2>

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

<h1 id="education" class="section-title">Education</h1>

<ul class="education-list">
  <li><span class="education-period">2021 — 2026</span><span><span class="education-degree">Ph.D. Candidate · Mechanical Engineering</span><br>School of Mechanical Engineering, Shanghai Jiao Tong University · Robotics Institute<br>Dissertation: implicit 3D thyroid-ultrasound reconstruction and puncture-navigation systems</span></li>
  <li><span class="education-period">2017 — 2021</span><span><span class="education-degree">B.Eng. · Mechanical Engineering</span><br>School of Mechanical Engineering, Shanghai Jiao Tong University<br>Pilot honors program · Outstanding graduate of the school</span></li>
</ul>
