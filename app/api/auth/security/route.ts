import { cookies } from "next/headers";
import { getPortalUser } from "../../../auth";

const encoder = new TextEncoder();
function hex(bytes: ArrayBuffer | Uint8Array) { const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes); return Array.from(view, value => value.toString(16).padStart(2, "0")).join(""); }
function random(size: number) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return hex(bytes); }
async function passwordHash(password: string, saltHex: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]); const salt = Uint8Array.from(saltHex.match(/.{2}/g) || [], part => Number.parseInt(part, 16)); return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256)); }
function equal(a: string, b: string) { if (a.length !== b.length) return false; let result = 0; for (let index = 0; index < a.length; index += 1) result |= a.charCodeAt(index) ^ b.charCodeAt(index); return result === 0; }

export async function GET() {
  const user = await getPortalUser(); if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = (await import("cloudflare:workers")).env.DB;
  const account = await db.prepare("SELECT email,full_name AS fullName,account_type AS accountType,status,last_login_at AS lastLoginAt,created_at AS createdAt FROM auth_accounts WHERE lower(email)=?").bind(user.email.toLowerCase()).first();
  const sessions = await db.prepare("SELECT COUNT(*) AS count FROM auth_sessions WHERE lower(email)=? AND expires_at>CURRENT_TIMESTAMP").bind(user.email.toLowerCase()).first<{ count: number }>();
  return Response.json({ account, activeSessions: sessions?.count || 0 });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin"); if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const user = await getPortalUser(); if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { currentPassword?: string; newPassword?: string; action?: string };
  const db = (await import("cloudflare:workers")).env.DB;
  if (body.action === "logout-all") { await db.prepare("DELETE FROM auth_sessions WHERE lower(email)=?").bind(user.email.toLowerCase()).run(); (await cookies()).delete("attri_session"); return Response.json({ success: true, destination: user.accountType === "admin" ? "/admin/login" : "/client/login" }); }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(body.newPassword || "")) return Response.json({ error: "New password must have 10 characters, uppercase, lowercase and a number." }, { status: 400 });
  const account = await db.prepare("SELECT password_hash AS hash,password_salt AS salt FROM auth_accounts WHERE lower(email)=?").bind(user.email.toLowerCase()).first<{ hash: string; salt: string }>();
  if (!account || !equal(await passwordHash(body.currentPassword || "", account.salt), account.hash)) return Response.json({ error: "Current password is incorrect." }, { status: 403 });
  const salt = random(16); const hash = await passwordHash(body.newPassword || "", salt);
  await db.batch([db.prepare("UPDATE auth_accounts SET password_hash=?,password_salt=?,failed_login_count=0,locked_until='',updated_at=CURRENT_TIMESTAMP WHERE lower(email)=?").bind(hash, salt, user.email.toLowerCase()), db.prepare("DELETE FROM auth_sessions WHERE lower(email)=?").bind(user.email.toLowerCase())]);
  (await cookies()).delete("attri_session");
  return Response.json({ success: true, destination: user.accountType === "admin" ? "/admin/login" : "/client/login" });
}
