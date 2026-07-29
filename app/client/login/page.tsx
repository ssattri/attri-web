import{getChatGPTUser}from"../../chatgpt-auth";import{redirect}from"next/navigation";
export const dynamic="force-dynamic";
export default async function ClientLogin(){const user=await getChatGPTUser();if(user)redirect("/client");const signIn="/signin-with-chatgpt?return_to=%2Fclient";return <main className="client-access-page">
 <section className="client-access-brand"><a className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></a><div><p>SECURE CLIENT EXPERIENCE</p><h1>Your projects.<br/><em>One protected space.</em></h1><span>Access consultations, drawings, Vastu reports, invoices, orders, courses, certificates and support securely.</span></div><div className="access-trust"><b>Protected access</b><b>Private documents</b><b>One connected account</b></div></section>
 <section className="client-access-card"><div><p>CLIENT PORTAL</p><h2>Welcome to your workspace</h2><span>Sign in to continue, or create your client account in a few steps.</span></div>
  <a className="google-access" href={signIn}><strong>G</strong><span><b>Continue with Google</b><small>Use your Google-connected account</small></span><i>→</i></a>
  <a className="email-access" href={signIn}><strong>@</strong><span><b>Continue with email</b><small>Sign in securely with your email</small></span><i>→</i></a>
  <div className="access-divider"><span>NEW CLIENT</span></div>
  <a className="register-access" href={signIn}>Create your client account</a>
  <small className="access-note">Your account is registered automatically after identity verification. We never store your Google password.</small>
  <a className="access-back" href="/">← Return to website</a>
 </section>
 </main>}
