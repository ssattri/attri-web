import { getPortalUser } from "../../auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "./AdminLoginForm";
export const dynamic = "force-dynamic";
export default async function AdminLogin() { const user = await getPortalUser(); if (user?.accountType === "admin") redirect("/admin"); return <main className="admin-auth-page"><section><a className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></a><div><p>SECURE ADMINISTRATION</p><h1>Control centre<br/><em>access.</em></h1><span>Administration is isolated from customer accounts and protected by role validation, lockout controls and short owner sessions.</span></div><div className="admin-auth-badges"><b>Admin only</b><b>Attempt lockout</b><b>Audit ready</b></div></section><article><p>ADMIN LOGIN</p><h2>Authorised personnel only</h2><span>Use the administrator account activated by the business owner.</span><AdminLoginForm /></article></main>; }
