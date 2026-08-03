import { cookies } from "next/headers";

const OWNER_EMAIL = "attriassociates99@gmail.com";
const encoder = new TextEncoder();
function hex(bytes: ArrayBuffer | Uint8Array) { const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes); return Array.from(view, value => value.toString(16).padStart(2, "0")).join(""); }
function random(size: number) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return hex(bytes); }
async function sha256(value: string) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
async function passwordHash(password: string, saltHex: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]); const salt = Uint8Array.from(saltHex.match(/.{2}/g) || [], part => Number.parseInt(part, 16)); return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256)); }
function equal(a: string, b: string) { if (a.length !== b.length) return false; let result = 0; for (let index = 0; index < a.length; index += 1) result |= a.charCodeAt(index) ^ b.charCodeAt(index); return result === 0; }

export async function POST(request: Request) {
  const origin = request.headers.get("origin"); if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const body = await request.json() as { code?: string; fullName?: string; email?: string; password?: string };
  const runtime = (await import("cloudflare:workers")).env as { DB: D1Database; ADMIN_SETUP_TOKEN_HASH?: string };
  const db = runtime.DB;
  const existingAdmin = await db.prepare("SELECT email FROM auth_accounts WHERE account_type='admin' AND status='active' LIMIT 1").first();
  if (existingAdmin) return Response.json({ error: "The owner administrator account is already activated." }, { status: 409 });
  if (!runtime.ADMIN_SETUP_TOKEN_HASH || !body.code || !equal(await sha256(body.code.trim()), runtime.ADMIN_SETUP_TOKEN_HASH)) return Response.json({ error: "Invalid owner activation code." }, { status: 403 });
  if (body.email?.trim().toLowerCase() !== OWNER_EMAIL) return Response.json({ error: "Use the authorised owner email address." }, { status: 403 });
  if ((body.fullName?.trim().length || 0) < 2) return Response.json({ error: "Enter the administrator name." }, { status: 400 });
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(body.password || "")) return Response.json({ error: "Use at least 10 characters with uppercase, lowercase and a number." }, { status: 400 });
  const salt = random(16); const hash = await passwordHash(body.password || "", salt); const email = OWNER_EMAIL;
  await db.prepare("INSERT INTO auth_accounts (email,full_name,password_hash,password_salt,account_type,status,failed_login_count,locked_until) VALUES (?,?,?,?, 'admin','active',0,'') ON CONFLICT(email) DO UPDATE SET full_name=excluded.full_name,password_hash=excluded.password_hash,password_salt=excluded.password_salt,account_type='admin',status='active',failed_login_count=0,locked_until='',updated_at=CURRENT_TIMESTAMP").bind(email, body.fullName?.trim(), hash, salt).run();
  const token = random(32); await db.prepare("INSERT INTO auth_sessions (token_hash,email,expires_at) VALUES (?,?,datetime('now','+12 hours'))").bind(await sha256(token), email).run();
  (await cookies()).set("attri_session", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 43200 });
  return Response.json({ success: true, destination: "/admin" }, { status: 201 });
}
