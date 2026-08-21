"use client";

import { FormEvent, useState } from "react";

export default function PasswordForm({ mode }: { mode: "change" | "recovery" | "setup" }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isChange = mode === "change";
  const title = mode === "setup" ? "Set administrator password" : isChange ? "Change administrator password" : "Reset administrator password";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/admin/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode, ...Object.fromEntries(new FormData(form)) }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "Unable to update the password."); setBusy(false); return; }
    window.location.assign("/admin");
  }

  return <form onSubmit={submit} className="admin-password-form" aria-describedby="password-help">
    <p>ADMIN SECURITY</p><h2>{title}</h2>
    <span className="admin-login-subtitle" id="password-help">Use at least 14 characters with uppercase, lowercase, number, and symbol characters.</span>
    {isChange ? <label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required autoFocus /></label> : <label>{mode === "setup" ? "Setup token" : "Recovery token"}<input name="recoveryToken" type="password" autoComplete="one-time-code" required autoFocus /></label>}
    <label>New password<input name="password" type="password" autoComplete="new-password" required /></label>
    <label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" required /></label>
    {message ? <div className="admin-login-error" role="alert">{message}</div> : null}
    <button type="submit" disabled={busy}>{busy ? "Saving…" : "Save secure password"}</button>
  </form>;
}
