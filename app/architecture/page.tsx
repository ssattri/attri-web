import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Architecture, Structural & Interior Design | Attri Associates",
  description: "Integrated architectural planning, structural engineering, interior design, BIM, 3D visualization and construction consultancy for residential, commercial and industrial projects.",
};

const disciplines = [
  ["Architecture Planning", "Site-responsive concepts, efficient layouts, elevations and coordinated working drawings."],
  ["Structural Engineering", "Safe and economical RCC and steel systems designed for performance and buildability."],
  ["Interior Architecture", "Materials, lighting, furniture and services composed into a coherent lived experience."],
  ["BIM & Visualization", "Coordinated 3D models, clash-aware documentation, renderings and cinematic walkthroughs."],
  ["MEP Coordination", "Electrical, plumbing, HVAC and fire systems integrated early with design and structure."],
  ["Site & Construction", "Tender assistance, quality review, milestone supervision and technical decision support."],
];

export default function ArchitecturePage() {
  return (
    <main className="info-page">
      <header className="inner-nav">
        <a className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></a>
        <nav><a href="/about">About</a><a className="active" href="/architecture">Architecture</a><a href="/vastu-shastra">Vastu Shastra</a><a href="/#projects">Projects</a><a href="/#software">Software</a></nav>
        <a className="nav-cta" href="/#contact">Start a project <span>↗</span></a>
      </header>

      <section className="info-hero architecture-hero">
        <div className="architectural-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="info-hero-copy">
          <p className="eyebrow"><span /> Architecture · Engineering · Experience</p>
          <h1>Ideas made<br /><em>buildable.</em></h1>
          <p>Integrated design for residential, commercial and industrial spaces—from the first line to the final detail.</p>
          <a className="button gold" href="/#contact">Discuss your project <span>↗</span></a>
        </div>
        <div className="architecture-index"><strong>01</strong><span>Context</span><strong>02</strong><span>Performance</span><strong>03</strong><span>Experience</span></div>
      </section>

      <section className="content-section two-col">
        <div><p className="section-kicker">Integrated practice</p><h2>Design without<br /><span>disciplinary gaps.</span></h2></div>
        <div className="rich-copy"><p>Good architecture is more than an attractive elevation. It aligns people, climate, structure, services, cost and construction into one clear idea.</p><p>Our architects, engineers and Vastu specialists collaborate from day one, creating coordinated solutions that are expressive, practical and easier to execute.</p></div>
      </section>

      <section className="content-section tinted">
        <p className="section-kicker">Capabilities</p>
        <div className="discipline-list">
          {disciplines.map(([title,copy], i) => <article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="content-section indigo">
        <div className="section-title-row"><div><p className="section-kicker light">Design process</p><h2>A rigorous path from<br /><span>brief to building.</span></h2></div><p>A transparent sequence keeps decisions timely, documentation coordinated and execution aligned.</p></div>
        <div className="process-timeline">
          {["Discover", "Define", "Design", "Develop", "Document", "Deliver"].map((item,i)=><div key={item}><span>0{i+1}</span><b>{item}</b></div>)}
        </div>
      </section>

      <section className="content-section project-types">
        <p className="section-kicker">Project sectors</p><h2>At every scale.<br /><span>For every purpose.</span></h2>
        <div><span>Luxury Residences</span><span>Housing & Apartments</span><span>Corporate Offices</span><span>Retail & Hospitality</span><span>Factories & Warehouses</span><span>Healthcare & Education</span></div>
      </section>

      <section className="page-cta"><p>Have a site or idea?</p><h2>Let’s turn its potential<br />into a precise plan.</h2><a className="button gold" href="/#contact">Start your project <span>↗</span></a></section>
      <footer className="simple-footer"><span>© 2026 Attri Associates & Vastu Consultants</span><a href="/">Return home ↑</a></footer>
    </main>
  );
}
