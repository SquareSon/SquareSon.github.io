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

<h1 id="selected-work" class="section-title">Selected Research</h1>

<p>My Ph.D. research connects observations, pose, deformation, and continuous 3D representations in medical imaging, then carries those representations into puncture-path planning and compact robotic systems. The four directions below mirror the project structure in my CV.</p>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-registration.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-registration.png" alt="Unified pose correction and canonical-space mapping" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>Instrument and image pose estimation with joint pose, deformation, and representation optimization for 2D/3D deformable registration</h2>
    <p class="paper-meta">September 2023 — present</p>
    <p>Stereo near-infrared cameras and an IMU estimate probe pose, while an N-wire model provides spatiotemporal calibration between the probe and ultrasound image. Multi-sweep discrepancy is separated into sweep-level global rigid bias, frame-level high-frequency jitter, and force-conditioned diffeomorphic deformation.</p>
    <p>Hierarchical feature matching, Lie-group B-spline trajectory constraints, and a force-conditioned Morph field address these errors and are jointly optimized with NeRF/3DGS representations to map images, instruments, and tissue into a shared canonical space.</p>
  </div>
</div>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-segmentation.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-segmentation.png" alt="Overall task-branch mechanism for 2D semantic observations" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>Ultrasound canonicalization and enhancement with multi-task 2D semantic segmentation</h2>
    <p class="paper-meta">September 2024 — September 2025</p>
    <p>Manifold analysis of foundation-model features filters low-quality observations caused by unstable probe contact. Image-domain response modeling and acquisition-condition simulation then convert B-mode images from different devices and acquisition settings into a more stable canonical echo-intensity proxy.</p>
    <p>A shared encoder and task branches jointly segment the thyroid, nodules, vessels, and needle. Cross-task semantic guidance, anatomical constraints, class-imbalance handling, and tubular topology supervision provide reliable 2D semantic inputs for subsequent 3D reconstruction.</p>
  </div>
</div>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-semantic-field.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-semantic-field.png" alt="Comparison between voxel-probability fusion and a continuous 3D semantic neural field" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>3D inverse rendering and semantic fields with NeRF/3DGS and acoustic priors</h2>
    <p class="paper-meta">June 2024 — present</p>
    <p>Image-pose pairs define a continuous 3D field, while ultrasound propagation priors such as attenuation, backscatter, and direction-dependent reflection enter a differentiable renderer so that the implicit representation captures both image intensity and medium properties.</p>
    <p>A continuous semantic field replaces discrete voxel writing and fuses multi-view 2D probability observations into anatomy that can be queried at arbitrary coordinates, providing a dense, continuous, and multi-view-consistent spatial representation for path planning.</p>
  </div>
</div>

<div class="paper-box research-project-card">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/trajectory-puncture-planning.png" target="_blank" rel="noopener"><img src="/images/research/figures/trajectory-puncture-planning.png" alt="Spatial arc trajectory of a flexible puncture needle in a 3D tissue environment" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2>Origami puncture robot and puncture-path planning</h2>
    <p class="paper-meta">January 2026 — present</p>
    <p>I am developing a compact five-DoF robot for head-and-neck puncture. An origami-chain three-DoF parallel stage is combined with a lower five-bar two-DoF mechanism to adjust needle entry pose within a small form factor.</p>
    <p>Planning operates in multi-tissue 3D anatomy: BiT* searches for asymptotically optimal paths that respect flexible-needle motion and avoid risk structures, while learned models predict candidate entry points and non-uniform sampling regions.</p>
  </div>
</div>

<h1 id="publications" class="section-title">Publications</h1>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-gla-nerf.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-gla-nerf.png" alt="Overview of GLA-NeRF for ultrasound-image registration" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:kNdYIx-mwKoC">GLA-NeRF: global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Li, B. Liu, J. Yao, F. Jing, Z. Fu, J. Fei, R. Xie · <em>Physics in Medicine and Biology</em>, 2026</p>
    <p>GLA-NeRF models sweep-level global rigid bias and frame-level local jitter separately, combining hierarchical localization, continuous-trajectory regularization, and neural-rendering error to refine multi-sweep poses and learn a canonical representation.</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-upi-nerf.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-upi-nerf.png" alt="UPI-NeRF physics-informed ultrasound neural-rendering architecture" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><span class="publication-title">UPI-NeRF: ultrasonic-physics-informed neural radiance fields for freehand 3D ultrasound</span></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, et al. · Research manuscript</p>
    <p>UPI-NeRF strengthens the implicit representation and builds an explicit ultrasound renderer from Rayleigh backscatter, microfacet reflection, and direction parameterization, improving texture, interfaces, and view-dependent appearance in freehand 3D ultrasound.</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-eidc.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-eidc.png" alt="EIDC image-domain response modeling and canonical echo-intensity representation" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><span class="publication-title">From B-Mode Images to Canonical Echo-Intensity Representations for Robust Thyroid Ultrasound Segmentation</span></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, L. Li, B. Liu, J. Yao, F. Jing, Z. Fu, J. Fei, R. Xie · <em>PRAI</em>, 2026</p>
    <p>EIDC estimates an image-domain imaging response through phase-only initialization, domain-level prototypes, and image-level residual adaptation, then combines acquisition-condition augmentation to produce a more stable canonical echo-intensity proxy from public B-mode images.</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-life-prediction.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-life-prediction.png" alt="IMU and dimensionality-reduction pipeline for remaining bolt-loosening life prediction" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://doi.org/10.1109/TIM.2023.3276014">Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction</a></h2>
    <p class="paper-meta"><strong>Z. Fang</strong>, Z. Fu, L. Zhou, Z. Fu, Y. Guan · <em>IEEE Transactions on Instrumentation and Measurement</em> 72, 1–17, 2023</p>
    <p>Multi-domain features from bonded-IMU vibration signals pass through outlier handling, denoising, imputation, standardization, and dimensionality reduction before remaining bolt-loosening life is predicted for proactive maintenance.</p>
  </div>
</article>

<article class="paper-box featured-publication">
  <div class="paper-box-image">
    <a class="figure-link" href="/images/research/figures/publication-neural-rrt.png" target="_blank" rel="noopener"><img src="/images/research/figures/publication-neural-rrt.png" alt="Neural-Guided RRT entry-point selection and optimal-path prediction networks" loading="lazy"></a>
  </div>
  <div class="paper-box-text">
    <h2><a class="publication-title" href="https://scholar.google.com.hk/citations?view_op=view_citation&amp;hl=en&amp;user=bEc7mGgAAAAJ&amp;citation_for_view=bEc7mGgAAAAJ:Se3iqnhoufwC">Neural-Guided RRT*: Learning-Based Planning of Entry Point and Puncture Path for Steerable Bevel-Tip Needle Insertion</a></h2>
    <p class="paper-meta">J. Yao, Z. Fu, <strong>Z. Fang</strong>, Z. Guo, F. Jing · <em>IEEE Robotics and Automation Letters</em> 10(9), 9016–9023, 2025</p>
    <p>Two 3D U-Nets predict candidate entry points and path-probability distributions to guide non-uniform RRT* sampling, while kinematically feasible spatial arcs extend the tree for steerable bevel-tip needles.</p>
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

<h1 id="education" class="section-title">Education</h1>

<ul class="education-list">
  <li><span class="education-period">2021 — 2026</span><span><span class="education-degree">Ph.D. Candidate · Mechanical Engineering</span><br>School of Mechanical Engineering, Shanghai Jiao Tong University · Robotics Institute<br>Dissertation: implicit 3D thyroid-ultrasound reconstruction and puncture-navigation systems</span></li>
  <li><span class="education-period">2017 — 2021</span><span><span class="education-degree">B.Eng. · Mechanical Engineering</span><br>School of Mechanical Engineering, Shanghai Jiao Tong University<br>Pilot honors program · Outstanding graduate of the school</span></li>
  <li><span class="education-period">2014 — 2017</span><span><span class="education-degree">High School</span><br>Zhenhai High School of Ningbo</span></li>
</ul>
