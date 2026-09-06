"use client";

import Link from "next/link";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="admin-login-page">
    <section className="admin-login-intro"><Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link><div className="admin-login-hero-copy"><p>ADMINISTRATION</p><h1>Let&apos;s restore<br/><em>your access.</em></h1><span>The control centre could not be refreshed. Your site data is safe and no changes have been made.</span></div></section>
    <section className="admin-login-card" aria-label="Admin recovery"><div className="admin-password-form"><p>SESSION RECOVERY</p><h2>Unable to load<br/>the control centre</h2><span className="admin-login-subtitle">Try again first. If the issue persists, return to sign in and start a fresh secure session.</span><button type="button" onClick={reset}>Try again</button><div className="admin-login-links"><Link href="/admin/login">Return to sign in</Link><Link href="/admin/reset-password">Reset administrator password</Link></div></div></section>
  </main>;
}
