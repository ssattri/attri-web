import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ResetPassword() {
  return <main className="admin-login-page"><section className="admin-login-intro"><Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link><div className="admin-login-hero-copy"><p>ADMIN SECURITY</p><h1>Reset your<br/><em>access.</em></h1><span>Administrator credentials are managed only through your server environment.</span></div></section><section className="admin-login-card"><div className="admin-password-form"><p>ENVIRONMENT-MANAGED ACCESS</p><h2>Update your<br/>server password</h2><span className="admin-login-subtitle">Change <code>ADMIN_PASSWORD</code> in your production environment, redeploy the website, then sign in with the new value. The password cannot be changed from this page.</span><div className="admin-login-links"><Link href="/admin/login">← Return to login</Link></div></div></section></main>;
}
