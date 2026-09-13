import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "../../admin-auth";
import SecurityCenter from "./SecurityCenter";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login?return_to=%2Fadmin%2Fsecurity");
  return <main className="security-page-reference"><header><Link className="security-brand" href="/admin"><span>A</span><div><b>ATTRI</b><small>ACCOUNT SECURITY</small></div></Link><Link className="security-return" href="/admin">Return to dashboard →</Link></header><section className="security-page-grid"><div className="security-summary"><p>ACCOUNT PROTECTION</p><h1>Security<br/><em>centre.</em></h1><span>Review your account and protect access to your Attri workspace.</span><dl><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Account type</dt><dd>Admin</dd></div><div><dt>Active sessions</dt><dd>1</dd></div><div><dt>Password source</dt><dd>Environment</dd></div></dl><Link className="security-signout-everywhere" href="/admin/logout">Sign out current session</Link></div><SecurityCenter/></section></main>;
}
