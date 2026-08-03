"use client";
import { FormEvent, useState } from "react";
type Role = "user" | "consultant"; type Mode = "login" | "register";
export default function PortalLogin({ initialMode = "login", initialRole = "user" }: { initialMode?: Mode; initialRole?: Role }) {
  const [mode, setMode] = useState<Mode>(initialMode), [role, setRole] = useState<Role>(initialRole), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); const values = new FormData(event.currentTarget);
    const response = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: mode, role, fullName: values.get("fullName"), email: values.get("email"), phone: values.get("phone"), password: values.get("password"), acceptedTerms: values.get("acceptedTerms") === "on" }) });
    const data = await response.json(); if (response.ok) window.location.replace(data.destination); else { setError(data.error || "Unable to continue. Please try again."); setBusy(false); }
  }
  return <section className="client-access-card native-login-card">
    <div className="login-mode-tabs" role="tablist" aria-label="Account action"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">Sign in</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">Create account</button></div>
    <div className="native-login-heading"><p>{mode === "login" ? "WELCOME BACK" : "JOIN THE ATTRI ECOSYSTEM"}</p><h2>{mode === "login" ? "Choose your login type" : "Create your account"}</h2><span>{mode === "login" ? "Select your workspace and enter your account details." : "One registration gives you secure access to your selected workspace."}</span></div>
    <div className="login-role-grid"><button type="button" className={role === "user" ? "active" : ""} onClick={() => setRole("user")}><span>01</span><b>User</b><small>Shop, courses, services and consultations</small></button><button type="button" className={role === "consultant" ? "active" : ""} onClick={() => setRole("consultant")}><span>02</span><b>Consultant</b><small>Vastu Compass, projects and reports</small></button></div>
    <form className="native-login-form" onSubmit={submit}>{mode === "register" && <><label>Full name<input name="fullName" required autoComplete="name" placeholder="Your full name" /></label><label>Mobile number<input name="phone" required autoComplete="tel" placeholder="+91 99900 00000" /></label></>}<label>Email address<input type="email" name="email" required autoComplete="email" placeholder="name@example.com" /></label><label>Password<input type="password" name="password" required minLength={10} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="10+ characters, uppercase, lowercase and number" /></label>{mode === "register" && <label className="terms-check"><input name="acceptedTerms" type="checkbox" required /><span>I accept the Terms of Use and Privacy Policy.</span></label>}{error && <div className="registration-error" role="alert">{error}</div>}<button className="native-login-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? `Sign in as ${role} →` : `Create ${role} account →`}</button></form>
    <p className="native-login-security">Secure session · Encrypted password · Role-based access</p><a className="access-back" href="/">← Return to website</a>
  </section>;
}
