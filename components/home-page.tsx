import Image from "next/image";
import { ChatAssistant } from "./chat-assistant";
import {
  education,
  profile,
  projects,
  publications,
  researchSteps,
  type Locale,
  ui,
} from "../content/site";

const selectedPublications = publications.filter((publication) => publication.selected);

export function HomePage({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const languageHref = locale === "zh" ? "/en/" : "/";

  return (
    <main className="site-shell" lang={locale === "zh" ? "zh-CN" : "en"} data-pagefind-lang={locale === "zh" ? "zh-CN" : "en"}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={profile.name[locale]}>
          <span className="wordmark-mark">ZF</span>
          <span className="wordmark-copy">
            <strong>{profile.name[locale]}</strong>
            <small>{locale === "zh" ? "研究主页" : "Research"}</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label={locale === "zh" ? "主导航" : "Main navigation"}>
          {t.nav.map((item, index) => (
            <a key={t.navIds[index]} href={`#${t.navIds[index]}`}>
              {item}
            </a>
          ))}
        </nav>
        <a className="language-switch" href={languageHref} aria-label={t.languageLabel}>
          {t.language}
          <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            {locale === "zh" ? "上海 · 开放研究交流" : "Shanghai · Open to research conversations"}
          </div>
          <p className="hero-focus">{profile.focus[locale]}</p>
          <h1>
            {locale === "zh" ? (
              <>
                让三维感知
                <br />
                <span>抵达物理世界。</span>
              </>
            ) : (
              <>
                Perceive in 3D.
                <br />
                <span>Act in the physical world.</span>
              </>
            )}
          </h1>
          <p className="hero-intro">{profile.intro[locale]}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#research">
              {t.explore}<span aria-hidden="true">↓</span>
            </a>
            <a className="button button-quiet" href="#ask">
              {t.ask}<span aria-hidden="true">↗</span>
            </a>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>11</dt>
              <dd>{locale === "zh" ? "篇公开论文" : "publications"}</dd>
            </div>
            <div>
              <dt>05</dt>
              <dd>{locale === "zh" ? "步研究链" : "research stages"}</dd>
            </div>
            <div>
              <dt>2026</dt>
              <dd>{locale === "zh" ? "博士论文" : "doctoral thesis"}</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual" aria-label={locale === "zh" ? "方子的研究画像" : "Research portrait of Zi Fang"}>
          <div className="coordinate-plane plane-back" />
          <div className="coordinate-plane plane-front" />
          <div className="portrait-frame">
            <Image
              src={profile.image}
              alt={profile.name[locale]}
              width={400}
              height={475}
              sizes="(max-width: 720px) 68vw, 360px"
              priority
            />
            <div className="portrait-caption">
              <strong>{profile.name[locale]}</strong>
              <span>{profile.role[locale]}</span>
            </div>
          </div>
          <div className="signal-card signal-card-top">
            <span>OBSERVATION</span>
            <strong>B-mode → 3D field</strong>
          </div>
          <div className="signal-card signal-card-bottom">
            <span>COORDINATE</span>
            <strong>Image → World → Tool</strong>
          </div>
          <div className="axis-label axis-x">X</div>
          <div className="axis-label axis-y">Y</div>
          <div className="axis-label axis-z">Z</div>
        </div>
      </section>

      <section className="section research-section" id="research">
        <SectionHeading kicker={t.researchKicker} title={t.researchTitle} lead={t.researchLead} />
        <div className="research-chain">
          {researchSteps.map((step) => (
            <article className="research-step" key={step.index}>
              <div className="step-index">{step.index}</div>
              <div className="step-node"><span /></div>
              <h3>{step.title[locale]}</h3>
              <p>{step.text[locale]}</p>
            </article>
          ))}
        </div>
        <div className="evidence-note">
          <span>{locale === "zh" ? "证据原则" : "EVIDENCE PRINCIPLE"}</span>
          <p>
            {locale === "zh"
              ? "模块结果只支持模块结论。标定残差不外推为端到端穿刺精度，假体验证不外推为临床安全性。"
              : "Module-level results support module-level claims only. Calibration residuals are not end-to-end puncture accuracy, and phantom validation is not clinical safety evidence."}
          </p>
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <SectionHeading kicker={t.projectsKicker} title={t.projectsTitle} />
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project-card project-${project.accent} ${project.image ? "project-with-image" : ""}`} key={project.id}>
              {project.image ? (
                <div className="project-image-wrap">
                  <Image
                    src={project.image}
                    alt={project.title[locale]}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="field-visual" aria-hidden="true">
                  <div className="field-slice slice-one" />
                  <div className="field-slice slice-two" />
                  <div className="field-slice slice-three" />
                  <span className="field-pulse pulse-one" />
                  <span className="field-pulse pulse-two" />
                </div>
              )}
              <div className="project-content">
                <div className="project-meta">
                  <span>PROJECT {project.number}</span>
                  <span>{index < 2 ? "CORE METHOD" : "SYSTEM LINK"}</span>
                </div>
                <p className="project-subtitle">{project.subtitle[locale]}</p>
                <h3>{project.title[locale]}</h3>
                <p className="project-description">{project.description[locale]}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section publication-section" id="publications">
        <div className="publication-heading-row">
          <SectionHeading kicker={t.publicationsKicker} title={t.publicationsTitle} />
          <a className="text-link" href={profile.scholar} target="_blank" rel="noreferrer">
            {t.allWorks}<span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="publication-list">
          {selectedPublications.map((publication, index) => (
            <article className="publication-item" key={publication.title}>
              <span className="publication-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="publication-copy">
                <h3>{publication.title}</h3>
                <p>{publication.venue}</p>
              </div>
              <time>{publication.year}</time>
            </article>
          ))}
        </div>
        <p className="snapshot-note">{t.snapshot}</p>
      </section>

      <section className="section about-section" id="about">
        <SectionHeading kicker={t.aboutKicker} title={t.aboutTitle} />
        <div className="about-grid">
          <div className="timeline">
            {education.map((item) => (
              <article className="timeline-item" key={item.period}>
                <time>{item.period}</time>
                <div>
                  <h3>{item.degree[locale]}</h3>
                  <p>{item.school[locale]}</p>
                  <span>{item.detail[locale]}</span>
                </div>
              </article>
            ))}
          </div>
          <aside className="capability-card">
            <div className="capability-label">{locale === "zh" ? "能力图谱" : "CAPABILITY MAP"}</div>
            <div className="capability-groups">
              <div><span>01</span><p>{locale === "zh" ? "神经场、三维重建、逆渲染" : "Neural fields, 3D reconstruction, inverse rendering"}</p></div>
              <div><span>02</span><p>{locale === "zh" ? "多传感器定位、配准、路径规划" : "Multi-sensor tracking, registration, path planning"}</p></div>
              <div><span>03</span><p>{locale === "zh" ? "医学影像语义、低标注学习" : "Medical-image semantics, low-label learning"}</p></div>
              <div><span>04</span><p>{locale === "zh" ? "机器人原理样机、软件与机电集成" : "Robot prototypes, software, and mechatronic integration"}</p></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section ask-section" id="ask">
        <div className="ask-heading">
          <SectionHeading kicker={t.askKicker} title={t.askTitle} lead={t.askLead} />
          <div className="ask-data-flow" aria-hidden="true">
            <span>QUERY</span><i />
            <span>RETRIEVE</span><i />
            <span>CITE</span>
          </div>
        </div>
        <ChatAssistant locale={locale} />
      </section>

      <footer className="site-footer">
        <div>
          <span className="footer-mark">ZF</span>
          <p>{profile.focus[locale]}</p>
        </div>
        <div className="footer-links">
          <a href={`mailto:${profile.email}`}>{t.contact}</a>
          <a href={profile.scholar} target="_blank" rel="noreferrer">{t.scholar}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p className="copyright">© 2026 Zi Fang · {locale === "zh" ? "上海" : "Shanghai"}</p>
      </footer>
      <a className="floating-ask" href="#ask" aria-label={t.ask}>
        <span className="floating-pulse" />
        {locale === "zh" ? "问研究" : "Ask"}
      </a>
    </main>
  );
}

function SectionHeading({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </div>
  );
}
