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

  return <main className="admin-login-page">
    <section className="admin-login-intro">
      <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link>
      <div className="admin-login-hero-copy"><p>SECURE ADMINISTRATION</p><h1>Control centre<br/><em>access.</em></h1><span>Administration is isolated from customer accounts and protected by role validation, lockout controls and short owner sessions.</span><div className="admin-login-badges"><b>ADMIN ONLY</b><b>ATTEMPT LOCKOUT</b><b>AUDIT READY</b></div></div>
    </section>
    <section className="admin-login-card">
      <form action="/api/admin/session" method="post">
        <p>ADMIN LOGIN</p><h2>Authorised personnel<br/>only</h2><span className="admin-login-subtitle">Enter your administrator credentials to continue.</span>
        <input type="hidden" name="returnTo" value={returnTo}/>
        {query.error ? <div className="admin-login-error" role="alert">Incorrect email or password.</div> : null}
        <label>Administrator email<input name="email" type="email" autoComplete="username" placeholder="admin@example.com" required autoFocus/></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Your secure password" required/></label>
        <button type="submit">Enter control centre →</button>
        <Link href="/">← Return to website</Link>
      </form>
    </section>
  </main>;
}
