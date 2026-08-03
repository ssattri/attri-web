import PortalLogin from "./PortalLogin";
export const dynamic = "force-dynamic";
export default async function ClientLogin({ searchParams }: { searchParams: Promise<{ mode?: string; role?: string }> }) {
  const params = await searchParams; const initialMode = params.mode === "register" ? "register" : "login"; const initialRole = params.role === "consultant" ? "consultant" : "user";
  return <main className="client-access-page"><section className="client-access-brand"><a className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></a><div><p>ONE SECURE ACCOUNT</p><h1>Access your<br/><em>workspace.</em></h1><span>Sign in or register directly with Attri Associates as a User or Consultant.</span></div><div className="access-trust"><b>Secure sign-in</b><b>Direct registration</b><b>Role-based access</b></div></section><PortalLogin initialMode={initialMode} initialRole={initialRole} /></main>;
}
