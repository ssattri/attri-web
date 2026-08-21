"use client";

import Link from "next/link";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="admin-auth-page">
    <section>
      <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link>
      <div><p>ADMINISTRATION</p><h1>Let&apos;s restore<br/><em>your session.</em></h1><span>Your administration workspace could not be refreshed. Your information is protected; no changes have been made.</span></div>
    </section>
    <article className="admin-session-recovery">
      <p>SESSION RECOVERY</p><h2>Unable to load the control centre</h2>
      <span>Try loading the workspace again. If the issue continues, return to the sign-in page and start a new administrator session.</span>
      <div><button type="button" onClick={reset}>Try again</button><Link href="/admin/login">Return to sign in</Link></div>
    </article>
  </main>;
}
