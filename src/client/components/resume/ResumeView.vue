<script setup lang="ts">
const skills = [
  'Backend Architecture',
  'Node.js / TypeScript',
  'NestJS / Express / Hono',
  'PostgreSQL / SQLite / Drizzle',
  'Auth / RBAC / Multi-tenant',
  'Billing / Payments',
  'Redis / Queues',
  'Docker / Deployment',
  'Docker / Deployment2',
  'Docker / Deployment23',
  'Docker / Deployment234',
  'Docker / Deployment2345',
  'Docker / Deployment23456',
  'Docker / Deployment212',
  'Docker / Deployment99',
  'Docker / Deployment00',
  'Docker / Deployment01',
  'Docker / Deployment02',
  'Docker / Deployment03',
  'Docker / Deployment04',
]

const projects = [
  {
    title: 'Developer Platform',
    description:
      'Personal developer platform with Astro, Vue, SQLite, Drizzle, i18n, Markdown rendering, and SSR.',
  },
  {
    title: 'Express DI Example',
    description:
      'TypeScript backend architecture sandbox with explicit DI, decorator DI, clean modules, and transport separation.',
  },
  {
    title: 'Nodex',
    description:
      'Electron-based desktop application architecture with transport abstraction and backend-like main process.',
  },
]
</script>

<template>
  <section class="mx-auto w-full max-w-[1120px] py-10">
    <article class="resume-card">
      <div class="resume-card__accent"></div>

      <header class="resume-card__hero">
        <div>
          <p class="resume-card__eyebrow">
            Backend / Fullstack Developer
          </p>

          <h1 class="resume-card__title">Everi Vladislav</h1>

          <p class="resume-card__subtitle">Software Engineer</p>
        </div>

        <div class="resume-card__contacts">
          <div>
            <span>M</span>
            <a href="mailto:your@email.com">your@email.com</a>
          </div>

          <div>
            <span>G</span>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              github.com/your-profile
            </a>
          </div>

          <div>
            <span>L</span>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              linkedin.com/in/your-profile
            </a>
          </div>

          <div>
            <span>P</span>
            <p>Georgia / Remote</p>
          </div>
        </div>
      </header>

      <div class="resume-card__grid">
        <main class="resume-card__content">
          <section class="resume-section">
            <h2 class="resume-section__title">Summary</h2>

            <div
              class="resume-section__body resume-section__body--bordered"
            >
              <p>
                Backend-focused software engineer working with
                TypeScript, Node.js, modular backend architecture,
                authentication, billing, databases, and developer
                tooling. I build practical systems with clear boundaries,
                maintainable structure, and production-oriented
                engineering decisions.
              </p>
            </div>
          </section>

          <section class="resume-section">
            <h2 class="resume-section__title">Work Experience</h2>

            <div class="experience-item">
              <div class="experience-item__header">
                <h3>Backend / Fullstack Engineer</h3>
                <p>
                  Production SaaS systems | Auth, Billing, Multi-tenant
                </p>
              </div>

              <ul>
                <li>
                  Worked on production authentication, user access,
                  sessions, company-based ownership, and role separation.
                </li>
                <li>
                  Participated in billing and payment-related flows with
                  event-driven communication and production migrations.
                </li>
                <li>
                  Designed backend modules with clear
                  domain/application/database boundaries.
                </li>
              </ul>
            </div>

            <div class="experience-item">
              <div class="experience-item__header">
                <h3>Backend Engineer</h3>
                <p>UI Rules / structured design-rules platform</p>
              </div>

              <ul>
                <li>
                  Built backend modules for projects, rules, rule groups,
                  templates, snapshots, export flows, and API keys.
                </li>
                <li>
                  Implemented scoped access logic, API contracts, and
                  modular NestJS backend structure.
                </li>
              </ul>
            </div>
          </section>

          <section class="resume-section">
            <h2 class="resume-section__title">Projects</h2>

            <div class="project-list">
              <article
                v-for="project in projects"
                :key="project.title"
                class="project-item"
              >
                <h3>{{ project.title }}</h3>
                <p>{{ project.description }}</p>
              </article>
            </div>
          </section>
        </main>

        <aside class="resume-card__sidebar">
          <div class="profile-photo">
            <div class="profile-photo__placeholder">EV</div>
          </div>

          <section class="resume-section">
            <h2
              class="resume-section__title resume-section__title--line"
            >
              Education
            </h2>

            <div class="side-block">
              <h3>Software Engineering</h3>
              <p>
                Self-directed backend, system design, architecture, and
                production engineering.
              </p>
            </div>
          </section>

          <section class="resume-section">
            <h2
              class="resume-section__title resume-section__title--line"
            >
              Skills
            </h2>

            <div class="side-block">
              <h3>Technical</h3>

              <ul class="skill-list">
                <li v-for="skill in skills" :key="skill">
                  {{ skill }}
                </li>
              </ul>
            </div>
          </section>

          <section class="resume-section">
            <h2
              class="resume-section__title resume-section__title--line"
            >
              Languages
            </h2>

            <div class="side-block">
              <ul class="skill-list">
                <li>Russian: Native</li>
                <li>English: Professional working</li>
              </ul>
            </div>
          </section>
        </aside>
      </div>
    </article>
  </section>
</template>

<style scoped>
.resume-card {
  position: relative;
  overflow: hidden;
  min-height: 1120px;
  padding: 64px 72px;
  /* border: 1px solid rgba(255, 255, 255, 0.12); */
  background-color: var(--primary-color-2);
  /* background:
    radial-gradient(circle at 15% 0%, var(--bg-color-1), transparent 28%),
    linear-gradient(135deg, #f6f6f3 0%, #e8e7e1 48%, #f8f8f5 100%); */
  color: var(--cv-text-color-1);
}

.resume-card__accent {
  position: absolute;
  top: 88px;
  left: 0;
  width: 28px;
  height: 120px;
  background: var(--text-color-1);
}

.resume-card__hero {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 360px);
  gap: 56px;
  align-items: start;
  margin-bottom: 54px;
}

.resume-card__eyebrow {
  margin: 0 0 8px;
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.resume-card__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(42px, 5vw, 64px);
  font-weight: 800;
  line-height: 0.96;
  text-transform: uppercase;
}

.resume-card__subtitle {
  margin: 18px 0 0;
  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.resume-card__contacts {
  display: grid;
  gap: 8px;
  padding-top: 8px;
  font-size: 14px;
  color: var(--text-color-2);
}

.resume-card__contacts div {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  align-items: center;
}

.resume-card__contacts span {
  font-weight: 800;
}

.resume-card__contacts a,
.resume-card__contacts p {
  margin: 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.45);
}

.resume-card__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 72px;
}

.resume-card__content {
  display: grid;
  gap: 42px;
}

.resume-card__sidebar {
  display: grid;
  align-content: start;
  gap: 42px;
}

.resume-section {
  min-width: 0;
}

.resume-section__title {
  margin: 0 0 18px;
  font-family: var(--font-heading);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.resume-section__title::after {
  content: '';
  display: block;
  width: 220px;
  height: 1px;
  margin-top: 9px;
  background: rgba(0, 0, 0, 0.45);
}

.resume-section__title--line {
  display: flex;
  align-items: center;
  gap: 14px;
}

.resume-section__title--line::after {
  flex: 1;
  width: auto;
  margin-top: 0;
}

.resume-section__body {
  color: var(--text-color-2);
  font-size: 15px;
  line-height: 1.48;
}

.resume-section__body--bordered {
  padding-left: 22px;
  border-left: 2px solid rgba(0, 0, 0, 0.35);
}

.resume-section__body p {
  margin: 0;
}

.experience-item {
  margin-bottom: 36px;
}

.experience-item:last-child {
  margin-bottom: 0;
}

.experience-item__header {
  margin-bottom: 14px;
}

.experience-item h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 800;
  text-transform: uppercase;
}

.experience-item p {
  margin: 5px 0 0;
  color: var(--text-color-2);
  font-size: 15px;
  font-weight: 700;
}

.experience-item ul,
.skill-list {
  margin: 0;
  padding-left: 18px;
}

.experience-item li,
.skill-list li {
  margin-bottom: 8px;
  color: var(--text-color-2);
  font-size: 14px;
  line-height: 1.45;
}

.project-list {
  display: grid;
  gap: 14px;
}

.project-item h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 800;
}

.project-item p {
  margin: 0;
  color: var(--text-color-2);
  font-size: 14px;
  line-height: 1.45;
}

.profile-photo {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;
}

.profile-photo__placeholder {
  display: grid;
  width: 220px;
  height: 220px;
  place-items: center;
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.22)),
    #d9d8d2;
  color: var(--bg-color-1);
  font-family: var(--font-heading);
  font-size: 54px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.side-block h3 {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 800;
}

.side-block p {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 980px) {
  .resume-card {
    padding: 40px 28px;
  }

  .resume-card__hero,
  .resume-card__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .resume-card__sidebar {
    order: -1;
  }

  .profile-photo {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .resume-card {
    min-height: auto;
    padding: 32px 20px;
  }

  .resume-card__accent {
    display: none;
  }

  .resume-card__subtitle {
    letter-spacing: 0.25em;
  }

  .profile-photo__placeholder {
    width: 160px;
    height: 160px;
    font-size: 40px;
  }
}
</style>
