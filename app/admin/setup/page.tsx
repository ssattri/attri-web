import AdminSetupForm from "./AdminSetupForm";
import { hasActiveAdministrator } from "../admin-status";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function AdminSetup() { if(await hasActiveAdministrator()) redirect("/admin/login"); return <main className="admin-auth-page"><section><a className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></a><div><p>ONE-TIME OWNER ACTIVATION</p><h1>Secure the<br/><em>control centre.</em></h1><span>This page creates the first and only owner administrator. After successful activation, the setup code can no longer be used.</span></div></section><article><p>OWNER SETUP</p><h2>Activate administrator access</h2><span>Use the private activation code supplied for this deployment.</span><AdminSetupForm /></article></main>; }
