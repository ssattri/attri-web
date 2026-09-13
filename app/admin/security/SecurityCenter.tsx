"use client";

import { FormEvent, useState } from "react";

export default function SecurityCenter() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/admin/security", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "verify-password", currentPassword: String(values.currentPassword || ""), newPassword: String(values.newPassword || ""), confirmPassword: String(values.confirmPassword || "") }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) setError(result.error || "Password verification failed.");
    else setMessage("Password verified. To change it, update ADMIN_PASSWORD in your server environment and redeploy.");
    setBusy(false);
  }

  return <article className="security-password-card"><p>CHANGE PASSWORD</p><h2>Update your password</h2><form onSubmit={verify}><label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required /></label><label>New password<input name="newPassword" type="password" autoComplete="new-password" placeholder="Uppercase, lowercase, number, 10+ characters" /></label><label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" /></label>{error && <div className="security-form-error" role="alert">{error}</div>}{message && <div className="security-form-success" role="status">{message}</div>}<button type="submit" disabled={busy}>{busy ? "Verifying…" : "Verify password & continue →"}</button></form><small className="security-env-note">Administrator credentials are managed securely with <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code>. Password updates take effect after redeployment.</small></article>;
}
