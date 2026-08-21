"use client";

import { FormEvent, useState } from "react";

export default function ResetPasswordForm() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const values = new FormData(event.currentTarget); if (values.get("password") !== values.get("confirmPassword")) { setMessage("Passwords do not match."); return; } setBusy(true); setMessage(""); const response = await fetch("/api/auth/admin-recovery", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: values.get("token"), password: values.get("password") }) }); const result = await response.json(); if (!response.ok) { setMessage(result.error || "Unable to reset the password."); setBusy(false); return; } window.location.assign("/admin/login?reset=1"); }
  return <form className="admin-login-form admin-setup-form" onSubmit={submit}><label>Recovery token<input name="token" type="password" autoComplete="one-time-code" required autoFocus /></label><p>Enter the private recovery token stored in the production environment. It is never shown on this page.</p><label>New password<input name="password" type="password" minLength={14} autoComplete="new-password" required /></label><label>Confirm new password<input name="confirmPassword" type="password" minLength={14} autoComplete="new-password" required /></label>{message ? <div className="registration-error" role="alert">{message}</div> : null}<button type="submit" disabled={busy}>{busy ? "Resetting…" : "Reset administrator password"}</button><a href="/admin/login">← Return to admin login</a></form>;
}
