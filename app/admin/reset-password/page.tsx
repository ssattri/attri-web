import { getAdminUser } from "../../admin-auth";
import Link from "next/link";
import PasswordForm from "../PasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPassword() {
  const user = await getAdminUser();
  return <main className="admin-login-page"><section className="admin-login-intro"><Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link><div className="admin-login-hero-copy"><p>ADMIN SECURITY</p><h1>Protect your<br/><em>access.</em></h1><span>{user ? "Confirm your current password before choosing a new one." : "Enter the recovery token kept in your server environment to reset access securely."}</span></div></section><section className="admin-login-card"><PasswordForm mode={user ? "change" : "recovery"}/><Link href="/admin/login">← Return to login</Link></section></main>;
}
