import { isAdminPasswordConfigured } from "../../admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PasswordForm from "../PasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminSetup() {
  if (await isAdminPasswordConfigured()) redirect("/admin/login");
  return <main className="admin-login-page"><section className="admin-login-intro"><Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link><div className="admin-login-hero-copy"><p>FIRST-TIME SETUP</p><h1>Secure your<br/><em>control centre.</em></h1><span>Use the one-time setup token stored only in your server environment to create the first administrator password.</span></div></section><section className="admin-login-card"><PasswordForm mode="setup"/></section></main>;
}
