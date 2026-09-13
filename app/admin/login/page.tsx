import { adminEmail, getAdminUser, safeAdminPath } from "../../admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; return_to?: string; returnTo?: string }>;
}) {
  const query = await searchParams;
  const returnTo = safeAdminPath(query.return_to || query.returnTo);
  if (await getAdminUser()) redirect(returnTo);

  const hasError = Boolean(query.error);
  return <main className="admin-auth-page">
    <section aria-labelledby="admin-login-title">
      <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link>
      <div><p>SECURE ADMINISTRATION</p><h1 id="admin-login-title">Control centre<br/><em>access.</em></h1><span>Administration is isolated from customer accounts and protected by role validation, lockout controls and short owner sessions.</span></div>
      <div className="admin-auth-badges" aria-label="Security features"><b>Admin only</b><b>Attempt lockout</b><b>Audit ready</b></div>
    </section>
    <article aria-label="Administrator sign in">
      <p>ADMIN LOGIN</p><h2>Authorised personnel only</h2><span>Enter your administrator credentials to continue.</span>
      <form className="admin-login-form" action="/api/admin/session" method="post" aria-describedby="login-help">
        <span className="sr-only" id="login-help">Administrator credentials are required.</span>
        <input type="hidden" name="returnTo" value={returnTo}/>
        {hasError ? <div className="admin-login-error" role="alert">{query.error === "configuration" ? "Admin sign-in is not configured correctly yet. Use the secure recovery flow or contact the site owner." : "We could not verify those credentials. Check your email and password, then try again."}</div> : null}
        <label>Administrator email<input name="email" type="email" autoComplete="username" inputMode="email" defaultValue={adminEmail()} placeholder="admin@example.com" aria-invalid={hasError} required autoFocus/></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="Your secure password" aria-invalid={hasError} required/></label>
        <button type="submit">Enter control centre →</button>
        <Link href="/admin/reset-password">Forgot administrator password?</Link><Link href="/">← Return to website</Link>
      </form>
    </article>
  </main>;
}
