import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Attri Associates & Vastu Consultants",
  description: "Meet the multidisciplinary practice bringing architecture, structural engineering, interior design, construction advice and scientific Vastu together.",
};

const values = [
  ["Clarity", "We translate complex technical and Vastu considerations into decisions clients can understand and act upon."],
  ["Integration", "Architecture, structure, services, interiors and Vastu are coordinated as one connected design system."],
  ["Responsibility", "Recommendations are practical, proportionate and mindful of budget, safety, function and context."],
  ["Curiosity", "We respect traditional knowledge while continually exploring modern tools, materials and methods."],
];

export default function AboutPage() {
  return (
    <main className="info-page">
      <header className="inner-nav">
        <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link>
        <nav><Link className="active" href="/about">About</Link><Link href="/architecture">Architecture</Link><Link href="/vastu-shastra">Vastu Shastra</Link><Link href="/#projects">Projects</Link><Link href="/#software">Software</Link></nav>
        <Link className="nav-cta" href="/#contact">Start a conversation <span>↗</span></Link>
      </header>
      <section className="info-hero about-hero">
        <div className="about-monogram" aria-hidden="true">A</div>
        <div className="info-hero-copy"><p className="eyebrow"><span /> The multidisciplinary studio</p><h1>Many disciplines.<br /><em>One intention.</em></h1><p>To create balanced, high-performing spaces by bringing modern design intelligence and Vedic spatial wisdom into one collaborative practice.</p><Link className="button gold" href="/#contact">Meet our team <span>↗</span></Link></div>
      </section>
      <section className="content-section two-col">
        <div><p className="section-kicker">Our perspective</p><h2>Designing the whole,<br /><span>not isolated parts.</span></h2></div>
        <div className="rich-copy"><p>Attri Associates & Vastu Consultants bridges science, tradition and contemporary design.</p><p>Our practice brings architects, engineers and Vastu specialists together to guide projects from early feasibility and planning through structure, interiors, visualization and construction support.</p></div>
      </section>
      <section className="founder-section content-section">
        <div className="founder-portrait"><span>CE</span><strong>SS ATTRI</strong></div>
        <div><p className="section-kicker light">Leadership</p><h2>CE. S. S. Attri</h2><h3>Chartered Engineer & Scientific Vastu Expert</h3><p>Leading an integrated approach to architecture, engineering and scientific Vastu, with an emphasis on practical recommendations, coordinated planning and responsible implementation.</p><div className="founder-tags"><span>Architecture</span><span>Engineering</span><span>Scientific Vastu</span><span>Planning</span></div></div>
      </section>
      <section className="content-section tinted"><p className="section-kicker">What guides us</p><div className="value-grid">{values.map(([title,copy],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
      <section className="content-section about-model"><p className="section-kicker">A connected ecosystem</p><h2>Consult. Design.<br /><span>Build. Learn.</span></h2><div><span>Consultancy</span><span>Architecture</span><span>Engineering</span><span>Vastu Software</span><span>Academy</span><span>Curated Products</span></div></section>
      <section className="page-cta"><p>Work with us</p><h2>Bring your site, plan<br />or challenge.</h2><Link className="button gold" href="/#contact">Start a conversation <span>↗</span></Link></section>
      <footer className="simple-footer"><span>© 2026 Attri Associates & Vastu Consultants</span><Link href="/">Return home ↑</Link></footer>
    </main>
  );
}
