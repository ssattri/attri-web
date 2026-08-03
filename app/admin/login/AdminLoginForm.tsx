"use client";
import { FormEvent, useState } from "react";
export default function AdminLoginForm() {
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(""); const values = new FormData(event.currentTarget); const response = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "login", role: "admin", email: values.get("email"), password: values.get("password") }) }); const data = await response.json(); if (response.ok) window.location.replace("/admin"); else { setError(data.error || "Unable to sign in."); setBusy(false); } }
  return <form className="admin-login-form" onSubmit={submit}><label>Administrator email<input name="email" type="email" required autoComplete="username" placeholder="admin@example.com" /></label><label>Password<input name="password" type="password" required autoComplete="current-password" placeholder="Your secure password" /></label>{error && <div className="registration-error" role="alert">{error}</div>}<button disabled={busy}>{busy ? "Verifying…" : "Enter control centre →"}</button><a href="/admin/setup">First-time owner activation</a><a href="/">← Return to website</a></form>;
}
