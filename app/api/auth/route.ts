import { cookies } from "next/headers";

type AuthBody = { action?: "login" | "register"; role?: "user" | "consultant"; fullName?: string; email?: string; phone?: string; password?: string; acceptedTerms?: boolean };
const encoder = new TextEncoder();
function bytesToHex(bytes: ArrayBuffer | Uint8Array) { const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes); return Array.from(view, byte => byte.toString(16).padStart(2, "0")).join(""); }
function randomToken(size = 32) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytesToHex(bytes); }
async function sha256(value: string) { return bytesToHex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
async function passwordHash(password: string, saltHex: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]); const salt = Uint8Array.from(saltHex.match(/.{2}/g) || [], part => Number.parseInt(part, 16)); return bytesToHex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256)); }
function constantTimeEqual(a: string, b: string) { if (a.length !== b.length) return false; let result = 0; for (let index = 0; index < a.length; index += 1) result |= a.charCodeAt(index) ^ b.charCodeAt(index); return result === 0; }

async function database() {
  const db = (await import("cloudflare:workers")).env.DB;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS auth_accounts (email TEXT PRIMARY KEY,full_name TEXT NOT NULL,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,account_type TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS auth_sessions_email_idx ON auth_sessions(email)"),
  ]);
  return db;
}

async function createSession(email: string) {
  const token = randomToken(); const db = await database();
  await db.prepare("DELETE FROM auth_sessions WHERE expires_at<=CURRENT_TIMESTAMP").run();
  await db.prepare("INSERT INTO auth_sessions (token_hash,email,expires_at) VALUES (?,?,datetime('now','+30 days'))").bind(await sha256(token), email).run();
  (await cookies()).set("attri_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 2592000 });
}

export async function POST(request: Request) {
  const body = await request.json() as AuthBody; const email = body.email?.trim().toLowerCase() || ""; const password = body.password || "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
  const db = await database();
  if (body.action === "register") {
    const fullName = body.fullName?.trim() || ""; const phone = body.phone?.trim() || "";
    if (fullName.length < 2) return Response.json({ error: "Enter your full name." }, { status: 400 });
    if (!/^\+?[0-9 ()-]{8,18}$/.test(phone)) return Response.json({ error: "Enter a valid mobile number." }, { status: 400 });
    if (!body.role || !["user", "consultant"].includes(body.role)) return Response.json({ error: "Choose User or Consultant account." }, { status: 400 });
    if (body.acceptedTerms !== true) return Response.json({ error: "Please accept the Terms and Privacy Policy." }, { status: 400 });
    if (await db.prepare("SELECT email FROM auth_accounts WHERE lower(email)=?").bind(email).first()) return Response.json({ error: "An account already exists for this email. Please sign in." }, { status: 409 });
    const salt = randomToken(16); const hash = await passwordHash(password, salt);
    await db.batch([
      db.prepare("INSERT INTO auth_accounts (email,full_name,password_hash,password_salt,account_type) VALUES (?,?,?,?,?)").bind(email, fullName, hash, salt, body.role),
      db.prepare("INSERT INTO customer_profiles (email,full_name,phone,account_type,registration_completed,status) VALUES (?,?,?,?,1,'active') ON CONFLICT(email) DO UPDATE SET full_name=excluded.full_name,phone=excluded.phone,account_type=excluded.account_type,registration_completed=1,status='active',updated_at=CURRENT_TIMESTAMP").bind(email, fullName, phone, body.role),
    ]);
    await createSession(email);
    return Response.json({ success: true, destination: body.role === "consultant" ? "/consultant" : "/client" }, { status: 201 });
  }
  const account = await db.prepare("SELECT email,password_hash AS passwordHash,password_salt AS passwordSalt,account_type AS accountType,status FROM auth_accounts WHERE lower(email)=?").bind(email).first<{ email: string; passwordHash: string; passwordSalt: string; accountType: string; status: string }>();
  if (!account || account.status !== "active" || !constantTimeEqual(await passwordHash(password, account.passwordSalt), account.passwordHash)) return Response.json({ error: "Incorrect email or password." }, { status: 401 });
  if (body.role && body.role !== account.accountType) return Response.json({ error: `This email is registered as a ${account.accountType} account.` }, { status: 403 });
  await createSession(account.email);
  return Response.json({ success: true, destination: account.email.toLowerCase() === "attriassociates99@gmail.com" ? "/admin" : account.accountType === "consultant" ? "/consultant" : "/client" });
}
