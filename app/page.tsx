const services = [
  ["01", "Scientific Vastu", "Residential, commercial and industrial audits grounded in directional analysis."],
  ["02", "Architecture", "Context-led planning, timeless form and buildable detail from concept to completion."],
  ["03", "Structural Design", "Safe, efficient systems coordinated closely with architecture and execution."],
  ["04", "Interior Design", "Material, light and movement shaped into calm, high-performing spaces."],
  ["05", "Construction Advisory", "Cost, quality, schedule and site supervision with one accountable team."],
  ["06", "BIM & Visualization", "2D drawings, 3D models, walkthroughs, BIM and MEP coordination."],
];

const sectors = ["Residences", "Workplaces", "Factories", "Hospitality", "Healthcare", "Education"];

const projects = [
  { title: "Aangan House", type: "Residential · Faridabad", className: "project-one" },
  { title: "Axis Works", type: "Industrial · Manesar", className: "project-two" },
  { title: "Aranya Retreat", type: "Hospitality · Rishikesh", className: "project-three" },
];

const platformFeatures = [
  "AI-assisted floor planning",
  "2D + 3D visual editor",
  "Automatic Vastu analysis",
  "Dosha detection and remedies",
  "Plan upload and OCR",
  "Client-ready PDF reports",
];

export default function Home() {
  return (
    <main>
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="Attri Associates home">
          <span className="brand-mark">A</span>
          <span><strong>ATTRI</strong><small>ASSOCIATES</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/about">About</a>
          <a href="/architecture">Architecture</a>
          <a href="/vastu-shastra">Vastu Shastra</a>
          <a href="#projects">Projects</a>
          <a href="#software">Software</a>
          <a href="/courses">Courses</a>
          <a href="/shop">Shop</a>
        </nav>
        <div className="nav-actions"><a href="/client/login">Client login</a><a className="nav-cta" href="/book-consultation">Book consultation <span>↗</span></a></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" />
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-content">
          <p className="eyebrow"><span /> Architecture · Engineering · Scientific Vastu</p>
          <h1>Spaces that align<br />purpose with <em>energy.</em></h1>
          <p className="hero-copy">
            We unite modern architecture, structural intelligence and Vedic spatial
            science to create places that perform beautifully.
          </p>
          <div className="hero-actions">
            <a className="button gold" href="/book-consultation">Begin your project <span>↗</span></a>
            <a className="text-link" href="#projects"><span className="play">▶</span> Explore our work</a>
          </div>
        </div>
        <div className="compass" aria-hidden="true">
          <div className="compass-ring"><span>N</span><i /><span>S</span><i /></div>
          <div className="compass-core">वास्तु<small>ENERGY · FORM</small></div>
        </div>
        <div className="hero-foot">
          <span>Scroll to discover</span>
          <div className="hero-stat"><strong>25+</strong><span>Years of<br />combined expertise</span></div>
          <div className="hero-stat"><strong>850+</strong><span>Spaces planned<br />and transformed</span></div>
          <div className="hero-stat"><strong>32</strong><span>Cities served<br />across India</span></div>
        </div>
      </section>

      <section className="intro section" id="about">
        <p className="section-kicker">A multidisciplinary practice</p>
        <div className="intro-grid">
          <h2>Ancient intelligence.<br /><span>Contemporary expression.</span></h2>
          <div>
            <p className="lead">
              Attri Associates & Vastu Consultants is an integrated design and
              advisory studio creating high-performance spaces for living, working
              and industry.
            </p>
            <p>
              One team brings architecture, engineering, interiors, construction
              and scientific Vastu together—reducing friction from the first
              sketch to the final handover.
            </p>
            <a className="arrow-link" href="#contact">Meet the studio <span>→</span></a>
          </div>
        </div>
      </section>

      <section className="expertise section" id="expertise">
        <div className="section-head">
          <div><p className="section-kicker light">Our expertise</p><h2>One vision.<br />Every discipline.</h2></div>
          <p>Integrated thinking creates stronger outcomes. Our specialists collaborate across every layer of the built environment.</p>
        </div>
        <div className="service-list">
          {services.map(([n, title, copy]) => (
            <a className="service-row" href="#contact" key={title}>
              <span>{n}</span><h3>{title}</h3><p>{copy}</p><b>↗</b>
            </a>
          ))}
        </div>
        <div className="sector-line">{sectors.map((sector) => <span key={sector}>{sector}</span>)}</div>
      </section>

      <section className="projects section" id="projects">
        <div className="section-title-row">
          <div><p className="section-kicker">Selected work</p><h2>Designed for impact.<br /><span>Built for life.</span></h2></div>
          <a className="arrow-link" href="#contact">View all projects <span>→</span></a>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project-card ${project.className}`} key={project.title}>
              <div className="project-number">0{index + 1}</div>
              <div className="project-info"><p>{project.type}</p><h3>{project.title}</h3><span>View project ↗</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="software section" id="software">
        <div className="software-copy">
          <p className="section-kicker light">Flagship platform · Coming soon</p>
          <h2>Design with intelligence.<br /><span>Align with confidence.</span></h2>
          <p>
            A cloud workspace that makes architectural planning and scientific
            Vastu analysis accessible—from first-time homeowners to enterprise teams.
          </p>
          <div className="feature-grid">
            {platformFeatures.map((feature) => <div key={feature}><i>✓</i>{feature}</div>)}
          </div>
          <div className="hero-actions">
            <a className="button gold" href="#contact">Join early access <span>↗</span></a>
            <a className="text-link light-link" href="#contact">Watch product film</a>
          </div>
        </div>
        <div className="software-ui" aria-label="Vastu design software concept">
          <div className="ui-top"><span /><span /><span /><b>ATTRI DESIGN OS</b></div>
          <div className="ui-body">
            <aside><i>⌂</i><i>⌗</i><i>◫</i><i>◎</i><i>⚙</i></aside>
            <div className="plan">
              <div className="room room-a">LIVING</div><div className="room room-b">BEDROOM</div>
              <div className="room room-c">KITCHEN</div><div className="room room-d">COURTYARD</div>
              <div className="plan-compass">N<br /><span>✦</span></div>
            </div>
            <div className="score"><small>VASTU SCORE</small><strong>92</strong><span>Excellent alignment</span></div>
          </div>
        </div>
      </section>

      <section className="ecosystem section" id="learn">
        <div className="section-title-row">
          <div><p className="section-kicker">Knowledge ecosystem</p><h2>Learn. Apply.<br /><span>Transform.</span></h2></div>
          <p>Professional education, practical tools and trusted products in one connected destination.</p>
        </div>
        <div className="ecosystem-grid">
          <article><span>01</span><div className="eco-icon">◈</div><h3>Academy</h3><p>Live and recorded courses, assignments, certifications and practitioner learning paths.</p><a href="/courses">Explore courses →</a></article>
          <article id="shop"><span>02</span><div className="eco-icon">✦</div><h3>Vastu Shop</h3><p>Curated remedies, tools, books, reports and digital resources with expert guidance.</p><a href="/shop">Visit the shop →</a></article>
          <article><span>03</span><div className="eco-icon">⌁</div><h3>Calculators</h3><p>Direction, area, construction cost, material quantity and planning calculators.</p><a href="#contact">Use free tools →</a></article>
        </div>
      </section>

      <section className="quote">
        <div className="quote-symbol">“</div>
        <blockquote>We do not merely design buildings.<br />We choreograph <em>energy, purpose and experience.</em></blockquote>
        <p>CE. S. S. Attri · Chartered Engineer & Scientific Vastu Expert</p>
      </section>

      <section className="testimonials section">
        <div className="section-title-row">
          <div><p className="section-kicker">Client experience</p><h2>Trust is built<br /><span>project by project.</span></h2></div>
          <p>Clear advice, coordinated expertise and practical solutions define the experience we aim to deliver.</p>
        </div>
        <div className="testimonial-grid">
          <article><div className="stars">★★★★★</div><blockquote>“The team connected Vastu recommendations with the actual architecture instead of treating them as separate decisions.”</blockquote><div><b>Residential consultation</b><span>Home planning · Delhi NCR</span></div></article>
          <article><div className="stars">★★★★★</div><blockquote>“We received clear priorities, practical corrections and a report our project team could genuinely implement.”</blockquote><div><b>Industrial Vastu audit</b><span>Factory planning · Haryana</span></div></article>
          <article><div className="stars">★★★★★</div><blockquote>“From planning to structure and services, having one coordinated team made every discussion more efficient.”</blockquote><div><b>Architecture client</b><span>Commercial project · North India</span></div></article>
        </div>
        <p className="testimonial-note">Illustrative presentation—replace with verified client reviews before public launch.</p>
      </section>

      <section className="home-faq section">
        <div className="faq-intro">
          <p className="section-kicker light">Questions, answered</p>
          <h2>Before you<br /><span>begin.</span></h2>
          <p>Not sure which service fits your project? Start here, or speak directly with our team.</p>
          <a className="arrow-link" href="#contact">Ask a question <span>→</span></a>
        </div>
        <div className="faq-list">
          <details open><summary>Can architecture and Vastu planning be done together?</summary><p>Yes. This is our preferred approach for new projects. Architects and Vastu experts collaborate from the first planning stage, reducing later revisions and compromises.</p></details>
          <details><summary>Do you provide online Vastu consultations?</summary><p>Yes. You can share a dimensioned plan, north direction, photographs and project information. We then conduct the analysis, consultation and report delivery online.</p></details>
          <details><summary>Do you undertake residential, commercial and industrial projects?</summary><p>Yes. Our multidisciplinary services cover homes, apartments, offices, retail, hospitality, factories, warehouses, healthcare and educational facilities.</p></details>
          <details><summary>Can you review an existing architectural drawing?</summary><p>Yes. We can audit existing drawings for planning, circulation, structure coordination and Vastu alignment before construction or renovation.</p></details>
          <details><summary>What will I receive after a consultation?</summary><p>The deliverables depend on the selected service and may include observations, marked plans, recommendations, remedies, drawings, reports and an implementation discussion.</p></details>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div>
          <p className="section-kicker light">Start a conversation</p>
          <h2>Every meaningful space<br />begins with a <span>clear intention.</span></h2>
        </div>
        <div className="contact-panel">
          <p>Tell us what you are planning. Our team will recommend the right consultation and next step.</p>
          <a className="button gold" href="/book-consultation">Book a consultation <span>↗</span></a>
          <div className="contact-meta"><span>Architecture</span><span>Vastu</span><span>Engineering</span><span>Interiors</span></div>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES & VASTU CONSULTANTS</small></span></a>
        <p>Infinite World of Modern & Vedic Vastu Science</p>
        <div><a href="#expertise">Services</a><a href="#projects">Projects</a><a href="#software">Software</a><a href="#contact">Contact</a></div>
        <small>© 2026 Attri Associates. All rights reserved.</small>
      </footer>
    </main>
  );
}
