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
      <div><p>SECURE ADMINISTRATION</p><h1>Control your<br/><em>business.</em></h1><span>Manage content, customers, commerce and operations from one protected control centre.</span></div>
    </section>
    <section className="admin-login-card">
      <form action="/api/admin/session" method="post">
        <p>ADMIN SIGN IN</p><h2>Welcome back</h2>
        <input type="hidden" name="returnTo" value={returnTo}/>
        {query.error ? <div className="admin-login-error" role="alert">Incorrect email or password.</div> : null}
        <label>Email address<input name="email" type="email" autoComplete="username" required autoFocus/></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required/></label>
        <button type="submit">Sign in to control centre</button>
        <Link href="/">← Return to website</Link>
      </form>
    </section>
  </main>;
}
