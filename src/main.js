import "./styles.css";
import { initPaintedBackground } from "./background.js";
import { initAnimations } from "./animations.js";
import { packages, processSteps, projects, services, stats } from "./projects.js";

const app = document.querySelector("#app");

document.body.insertAdjacentHTML("afterbegin", '<div class="webgl-bg" aria-hidden="true"></div>');

function projectCard(project, index, extraClass = "") {
  return `
    <article class="project-card ${extraClass}" tabindex="0" style="--i:${index}">
      <img src="${project.image}" alt="${project.title}" loading="${index < 3 ? "eager" : "lazy"}" />
      <div class="project-card__meta">
        <span>${project.category}</span>
        <strong>${project.title}</strong>
        <small>${project.summary}</small>
      </div>
    </article>
  `;
}

function serviceCard(service) {
  return `
    <article class="service-card reveal">
      <span>${service.number}</span>
      <h3>${service.title}</h3>
      <p>${service.text}</p>
      <a href="https://wa.me/966547869396" target="_blank" rel="noreferrer">اطلب الخدمة</a>
    </article>
  `;
}

function statCard(stat) {
  return `
    <article class="stat-card reveal">
      <strong>${stat.value}</strong>
      <span>${stat.label}</span>
    </article>
  `;
}

function packageCard(item) {
  const packageItems = item.items
    .map((entry) => `<li class="package-card__item">${entry}</li>`)
    .join("");
  const packageDetails = item.optionsTitle
    ? `
      <div class="package-card__options">
        <span>${item.optionsTitle}</span>
        <ul class="package-card__list">${packageItems}</ul>
      </div>
    `
    : `<ul class="package-card__list">${packageItems}</ul>`;

  return `
    <article class="package-card ${item.badge ? "package-card--featured" : ""} reveal">
      ${item.badge ? `<span class="package-card__badge">${item.badge}</span>` : ""}
      <small>${item.number}</small>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <div class="package-card__body">
        <strong>${item.label}</strong>
        ${packageDetails}
      </div>
      <a class="package-card__cta" href="https://wa.me/966547869396" target="_blank" rel="noreferrer">تواصل معنا ←</a>
    </article>
  `;
}

function processRow(step) {
  return `
    <article class="process-row reveal">
      <span>${step.number}</span>
      <h3>${step.title}</h3>
      <p>${step.text}</p>
    </article>
  `;
}

function brandOrbit() {
  const cards = [
    { label: "إبداع", icon: "✦", className: "orbit-card--idea" },
    { label: "تصميم", icon: "□", className: "orbit-card--design" },
    { label: "استراتيجية", icon: "☆", className: "orbit-card--strategy" },
    { label: "تطوير", icon: "↗", className: "orbit-card--growth" },
  ];

  return `
    <div class="brand-orbit reveal" aria-label="Thought Creators interactive orbit">
      <div class="orbit-path orbit-path--one"></div>
      <div class="orbit-path orbit-path--two"></div>
      <div class="orbit-path orbit-path--three"></div>
      <span class="orbit-node orbit-node--one"></span>
      <span class="orbit-node orbit-node--two"></span>
      <span class="orbit-node orbit-node--three"></span>
      <span class="orbit-node orbit-node--four"></span>
      <img src="/assets/thought-creators-orb.png" class="hero-orb-image" alt="Thought Creators orb" />
      ${cards
        .map(
          (card) => `
            <button class="orbit-card ${card.className}" type="button" aria-label="${card.label}">
              <span>${card.icon}</span>
              <strong>${card.label}</strong>
              <small></small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

app.innerHTML = `
  <header class="site-nav">
    <a class="brand" href="#hero" aria-label="Thought Creators">
      <img src="/assets/brand/logo-mark.png" alt="" />
      <span>Thought Creators</span>
    </a>
    <nav aria-label="Primary">
      <a href="#services">خدماتنا</a>
      <a href="#about">عن الوكالة</a>
      <a href="#packages">الباقات</a>
      <a href="#process">طريقة عملنا</a>
      <a href="#projects">المشاريع</a>
      <a href="#contact">تواصل</a>
    </nav>
    <a class="nav-cta" href="https://wa.me/966547869396" target="_blank" rel="noreferrer">ابدأ الآن</a>
  </header>

  <section id="hero" class="scene hero" data-chapter="01">
    <div class="hero__copy">
      <p class="eyebrow reveal">وكالة إبداعية متكاملة</p>
      <h1 class="chapter-title reveal">نصنع الأفكار التي تترك أثراً</h1>
      <p class="hero__lead reveal">من التصميم إلى التنفيذ — نقدم حلولاً إبداعية متكاملة تجعل علامتك التجارية تبرز وتنمو، بأيدي فريق من المبدعين المتخصصين.</p>
      <div class="hero__actions reveal">
        <button class="button button--light" data-scroll-target="#services">اكتشف خدماتنا</button>
        <a class="button button--ghost" href="https://wa.me/966547869396" target="_blank" rel="noreferrer">تواصل معنا</a>
      </div>
    </div>
    ${brandOrbit()}
    <div class="scene-index reveal">
      <span>6,745 متابع</span>
      <span>62 عمل منشور</span>
      <span>5 خدمات متكاملة</span>
      <span>الشرقية والرياض</span>
    </div>
  </section>

  <section id="projects" class="scene projects-scene" data-chapter="02">
    <div class="scene-heading">
      <p class="eyebrow reveal">أعمال من الواقع</p>
      <h2 class="chapter-title reveal">المشاريع هي القصة.</h2>
      <p class="section-copy reveal">مرّر فوق الصور لترى اسم المشروع ونوعه. كل بطاقة مصممة كفصل بصري، لا كصورة صامتة.</p>
    </div>
    <div class="project-gallery">
      ${projects.map((project, index) => projectCard(project, index)).join("")}
    </div>
  </section>

  <section id="services" class="scene services-scene" data-chapter="03">
    <div class="scene-heading">
      <p class="eyebrow reveal">خدماتنا</p>
      <h2 class="chapter-title reveal">كل ما تحتاجه تحت سقف واحد.</h2>
      <p class="section-copy reveal">خدمات متكاملة تغطي كل احتياجات علامتك التجارية — من الفكرة إلى التنفيذ النهائي.</p>
    </div>
    <div class="services-grid">
      ${services.map(serviceCard).join("")}
    </div>
  </section>

  <section id="about" class="scene about-scene" data-chapter="04">
    <div class="about-copy">
      <p class="eyebrow reveal">من نحن</p>
      <h2 class="chapter-title reveal">نحوّل أفكارك إلى تجارب لا تُنسى</h2>
      <p class="section-copy reveal">Thought Creators وكالة إبداعية متخصصة في تقديم حلول متكاملة تجمع بين التصميم الإبداعي والتنفيذ الاحترافي. نؤمن أن كل علامة تجارية لها قصة، ومهمتنا هي أن نرويها بطريقة لا تُنسى.</p>
      <p class="section-copy reveal">من اللوغو الأول إلى افتتاح المحل، ومن أول بوست إنستقرام إلى أكبر فعالية — نقف بجانبك في كل خطوة.</p>
    </div>
    <div class="stats-grid">
      ${stats.map(statCard).join("")}
    </div>
  </section>

  <section id="packages" class="scene packages-scene" data-chapter="05">
    <div class="scene-heading">
      <p class="eyebrow reveal">باقاتنا</p>
      <h2 class="chapter-title reveal">خدمات مصممة لنجاح مشروعك.</h2>
      <p class="section-copy reveal">خمس باقات متخصصة تغطي كل احتياجاتك — من التصميم إلى التنفيذ إلى التسويق.</p>
    </div>
    <div class="packages-grid">
      ${packages.map(packageCard).join("")}
    </div>
    <div class="package-help reveal">
      <h3>هل تحتاج مساعدة في الاختيار؟</h3>
      <p>فريقنا جاهز للإجابة على كل استفساراتك ومساعدتك في اختيار الباقة المناسبة لمشروعك.</p>
      <div class="package-help__actions">
        <a class="button button--light" href="https://wa.me/966547869396" target="_blank" rel="noreferrer">واتساب — 0547869396</a>
        <a class="button button--ghost" href="https://wa.me/966540995592" target="_blank" rel="noreferrer">واتساب — 0540995592</a>
      </div>
    </div>
  </section>

  <section id="process" class="scene process-scene" data-chapter="06">
    <div class="scene-heading">
      <p class="eyebrow reveal">طريقة العمل</p>
      <h2 class="chapter-title reveal">أربع خطوات بسيطة لنتيجة استثنائية.</h2>
      <p class="section-copy reveal">عملية واضحة وشفافة من أول استفسار حتى التسليم النهائي.</p>
    </div>
    <div class="process-list">
      ${processSteps.map(processRow).join("")}
    </div>
  </section>

  <section id="contact" class="scene contact-scene" data-chapter="07">
    <p class="eyebrow reveal">ابدأ مشروعك</p>
    <h2 class="chapter-title reveal">جاهز تبدأ مشروعك القادم؟</h2>
    <p class="section-copy reveal">تواصل معنا الآن واحصل على استشارة مجانية. فريقنا جاهز للإجابة على كل أسئلتك خلال 24 ساعة.</p>
    <div class="contact-actions reveal">
      <a class="button button--light" href="https://wa.me/966547869396" target="_blank" rel="noreferrer">واتساب — 0547869396</a>
      <a class="button button--ghost" href="https://wa.me/966540995592" target="_blank" rel="noreferrer">واتساب — 0540995592</a>
      <a class="button button--ghost" href="mailto:creativethougths.est@gmail.com">إرسال إيميل</a>
    </div>
    <footer class="site-footer reveal">
      <a class="footer-brand" href="#hero">Thought Creators فكر المبدعون</a>
      <p>وكالة إبداعية متكاملة — نحول أفكارك إلى تجارب بصرية لا تُنسى، ونرافقك من الفكرة إلى التنفيذ.</p>
      <div class="footer-links">
        <span>تصميم جرافيك</span>
        <span>تصميم داخلي</span>
        <span>تحليل إنستقرام</span>
        <span>تنفيذ وتشطيبات</span>
        <span>تنظيم الفعاليات</span>
      </div>
      <small>© 2025 Thought Creators — فكر المبدعون · جميع الحقوق محفوظة</small>
    </footer>
  </section>
`;

const background = initPaintedBackground(document.querySelector(".webgl-bg"));
initAnimations(background);
