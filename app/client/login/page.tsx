import{getChatGPTUser}from"../../chatgpt-auth";
export const dynamic="force-dynamic";
export default async function ClientLogin(){const user=await getChatGPTUser();const userReturn=encodeURIComponent("/client/onboarding?role=user"),consultantReturn=encodeURIComponent("/client/onboarding?role=consultant");const userLink=user?"/client/onboarding?role=user":`/signin-with-chatgpt?return_to=${userReturn}`,consultantLink=user?"/client/onboarding?role=consultant":`/signin-with-chatgpt?return_to=${consultantReturn}`;return <main className="client-access-page">
 <section className="client-access-brand"><a className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></a><div><p>ONE SECURE ACCOUNT</p><h1>Choose your<br/><em>workspace.</em></h1><span>Register once with a verified identity. Your selected account type opens the tools and services designed for you.</span></div><div className="access-trust"><b>Verified identity</b><b>Role-based access</b><b>Protected workspace</b></div></section>
 <section className="client-access-card role-access-card"><div><p>ACCOUNT REGISTRATION</p><h2>How will you use Attri?</h2><span>Select your account type. You will verify your identity with Google, email, or ChatGPT on the next step.</span></div>
  <a className="role-choice user-choice" href={userLink}><strong>01</strong><span><b>I am a User</b><small>Buy courses, products, consultations, services and Vastu software subscriptions.</small><em>{user?"Complete setup":"Register / continue"} as User →</em></span></a>
  <a className="role-choice consultant-choice" href={consultantLink}><strong>02</strong><span><b>I am a Consultant</b><small>Use the cloud Vastu Compass, manage client projects, analyses and reports.</small><em>{user?"Complete setup":"Register / continue"} as Consultant →</em></span></a>
  <small className="access-note">One verified email creates one account type. Your password remains with your chosen identity provider.</small>
  <a className="access-back" href="/">← Return to website</a>
 </section>
 </main>}
