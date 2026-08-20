import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scientific Vastu Shastra Consultation | Attri Associates",
  description: "Understand scientific Vastu principles, our 16-direction analysis, Vastu audits, planning, dosha identification and practical remedies for homes, offices and industries.",
};

const applications = [
  ["Home & Apartment", "Entrance, kitchen, bedrooms, Brahmasthan, services and internal energy flow."],
  ["Office & Commercial", "Leadership zones, workstations, sales, finance, client movement and brand experience."],
  ["Factory & Industry", "Production flow, machinery, utilities, fire, storage, dispatch and management placement."],
  ["Hospitality & Healthcare", "Guest experience, healing environments, kitchens, services and operational planning."],
];

const process = [
  ["01", "Discovery", "We understand the site, occupants, purpose, constraints and expected outcomes."],
  ["02", "Mapping", "Plans are aligned to true north and examined through directional and elemental zoning."],
  ["03", "Diagnosis", "We document strengths, imbalances, planning conflicts and priority corrections."],
  ["04", "Resolution", "You receive practical design changes, placement guidance and non-demolition remedies."],
];

export default function VastuPage() {
  return (
    <main className="info-page">
      <header className="inner-nav">
        <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link>
        <nav><Link href="/about">About</Link><Link href="/architecture">Architecture</Link><Link className="active" href="/vastu-shastra">Vastu Shastra</Link><Link href="/#projects">Projects</Link><Link href="/#software">Software</Link></nav>
        <Link className="nav-cta" href="/#contact">Book consultation <span>↗</span></Link>
      </header>

      <section className="info-hero vastu-hero">
        <div className="info-hero-copy">
          <p className="eyebrow"><span /> Knowledge · Analysis · Alignment</p>
          <h1>Vastu Shastra for<br /><em>modern life.</em></h1>
          <p>Ancient spatial intelligence interpreted through measurement, planning logic and practical design decisions.</p>
          <Link className="button gold" href="/#contact">Request a Vastu audit <span>↗</span></Link>
        </div>
        <div className="vastu-mandala" aria-hidden="true"><div><span>N</span><b>ब्रह्मस्थान</b><span>S</span></div></div>
      </section>

      <section className="content-section two-col">
        <div><p className="section-kicker">The foundation</p><h2>What is <span>Vastu Shastra?</span></h2></div>
        <div className="rich-copy">
          <p>Vastu Shastra is the traditional Indian discipline of planning spaces in relationship with direction, proportion, movement, sunlight, natural elements and human activity.</p>
          <p>Our approach respects its classical foundation while applying it responsibly to contemporary homes, workplaces, factories and institutions. We avoid fear-based advice and focus on measurable orientation, functional planning and achievable improvements.</p>
        </div>
      </section>

      <section className="content-section tinted">
        <p className="section-kicker">Where we apply it</p>
        <div className="info-card-grid">
          {applications.map(([title, copy], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p><Link href="/#contact">Explore consultation →</Link></article>)}
        </div>
      </section>

      <section className="content-section indigo">
        <div className="section-title-row"><div><p className="section-kicker light">Our methodology</p><h2>From compass to<br /><span>clear action.</span></h2></div><p>Every recommendation is prioritised by impact, feasibility and your real-world constraints.</p></div>
        <div className="process-grid">
          {process.map(([n,title,copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="content-section faq">
        <p className="section-kicker">Frequently asked</p>
        <h2>Practical answers.<br /><span>No unnecessary fear.</span></h2>
        <details open><summary>Is demolition always required to correct Vastu?</summary><p>No. We first assess planning, usage and placement changes, followed by proportionate non-demolition measures wherever appropriate.</p></details>
        <details><summary>Can an existing floor plan be analysed online?</summary><p>Yes. Share a dimensioned plan with north direction and site details. We can conduct an online analysis and provide a structured report and consultation.</p></details>
        <details><summary>Do you design new plans according to Vastu?</summary><p>Yes. Our architects and Vastu experts work together from the beginning, preventing conflicts between functional design and directional principles.</p></details>
      </section>

      <section className="page-cta"><p>Plan with clarity</p><h2>Make your space work<br />with—not against—you.</h2><Link className="button gold" href="/#contact">Book a consultation <span>↗</span></Link></section>
      <footer className="simple-footer"><span>© 2026 Attri Associates & Vastu Consultants</span><Link href="/">Return home ↑</Link></footer>
    </main>
  );
}
