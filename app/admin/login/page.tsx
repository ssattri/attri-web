import { getAdminUser, safeAdminPath } from "../../admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; return_to?: string }>;
}) {
  const query = await searchParams;
  const returnTo = safeAdminPath(query.return_to);
  if (await getAdminUser()) redirect(returnTo);

  const hasError = Boolean(query.error);
  return <main className="admin-login-page">
    <section className="admin-login-intro" aria-labelledby="admin-login-title">
      <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link>
      <div className="admin-login-hero-copy"><p>SECURE ADMINISTRATION</p><h1 id="admin-login-title">Control centre<br/><em>access.</em></h1><span>Administration is separate from customer accounts and protected with signed, short-lived owner sessions.</span><div className="admin-login-badges" aria-label="Security features"><b>ADMIN ONLY</b><b>8-HOUR SESSION</b><b>SECURE COOKIE</b></div></div>
    </section>
    <section className="admin-login-card" aria-label="Administrator sign in">
      <form action="/api/admin/session" method="post" aria-describedby="login-help">
        <p>ADMIN LOGIN</p><h2>Welcome<br/>back.</h2><span className="admin-login-subtitle" id="login-help">Enter your administrator credentials to continue.</span>
        <input type="hidden" name="returnTo" value={returnTo}/>
        {hasError ? <div className="admin-login-error" role="alert">We could not verify those credentials. Check your email and password, then try again.</div> : null}
        <label>Administrator email<input name="email" type="email" autoComplete="username" inputMode="email" placeholder="admin@example.com" aria-invalid={hasError} required autoFocus/></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" aria-invalid={hasError} required/></label>
        <button type="submit">Enter control centre →</button>
        <div className="admin-login-links"><Link href="/admin/reset-password">Need to reset your password?</Link><Link href="/">← Return to website</Link></div>
        <p className="admin-login-footnote">For authorised administrators only. Your session expires automatically.</p>
      </form>
    </section>
  </main>;
}
