import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";
export const dynamic = "force-dynamic";
export default function ResetPasswordPage() { return <main className="admin-auth-page"><section><Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>ATTRI</strong><small>ASSOCIATES</small></span></Link><div><p>ADMIN ACCOUNT RECOVERY</p><h1>Restore your<br/><em>access.</em></h1><span>Resetting your password signs every administrator session out to protect the control centre.</span></div></section><article><p>SECURE RECOVERY</p><h2>Set a new password</h2><span>Use a strong password with at least 14 characters, including uppercase, lowercase, a number, and a symbol.</span><ResetPasswordForm /></article></main>; }
