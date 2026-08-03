"use client";

import { useState } from "react";

const links = [
  ["/about", "About"],
  ["/architecture", "Architecture"],
  ["/vastu-shastra", "Vastu Shastra"],
  ["/#projects", "Projects"],
  ["/#software", "Software"],
  ["/courses", "Courses"],
  ["/shop", "Shop"],
] as const;

export default function SiteHeader({ active = "" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return <header className={`nav-wrap shared-site-header${open ? " menu-open" : ""}`}>
    <a className="brand" href="/" aria-label="Attri Associates home">
      <span className="brand-mark">A</span>
      <span><strong>ATTRI</strong><small>ASSOCIATES</small></span>
    </a>
    <nav className="desktop-nav" aria-label="Primary navigation">
      {links.map(([href, label]) => <a className={active === href ? "active" : ""} href={href} key={href}>{label}</a>)}
    </nav>
    <div className="nav-actions">
      <a className="nav-cta" href="/book-consultation">Book consultation <span>↗</span></a>
      <a className="client-login-icon" href="/client/login" aria-label="User and consultant login" title="Account login"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm-7.25 8.5c.55-4.1 3-6.25 7.25-6.25s6.7 2.15 7.25 6.25"/></svg></a>
      <button className="mobile-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(value => !value)}><span/><span/></button>
    </div>
    <nav className="mobile-site-menu" aria-label="Mobile navigation">
      {links.map(([href, label]) => <a className={active === href ? "active" : ""} href={href} key={href} onClick={() => setOpen(false)}>{label}<span>↗</span></a>)}
      <a href="/book-consultation" onClick={() => setOpen(false)}>Book consultation<span>↗</span></a>
    </nav>
  </header>;
}
