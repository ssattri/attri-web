import { cookies } from "next/headers";

type AuthBody = { action?: "login" | "register"; role?: "user" | "consultant" | "admin"; fullName?: string; email?: string; phone?: string; password?: string; acceptedTerms?: boolean };
const encoder = new TextEncoder();
function bytesToHex(bytes: ArrayBuffer | Uint8Array) { const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes); return Array.from(view, byte => byte.toString(16).padStart(2, "0")).join(""); }
function randomToken(size = 32) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytesToHex(bytes); }
async function sha256(value: string) { return bytesToHex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
async function passwordHash(password: string, saltHex: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]); const salt = Uint8Array.from(saltHex.match(/.{2}/g) || [], part => Number.parseInt(part, 16)); return bytesToHex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 }, key, 256)); }
function constantTimeEqual(a: string, b: string) { if (a.length !== b.length) return false; let result = 0; for (let index = 0; index < a.length; index += 1) result |= a.charCodeAt(index) ^ b.charCodeAt(index); return result === 0; }

async function database() {
  const db = (await import("cloudflare:workers")).env.DB;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS auth_accounts (email TEXT PRIMARY KEY,full_name TEXT NOT NULL,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,account_type TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active',failed_login_count INTEGER NOT NULL DEFAULT 0,locked_until TEXT NOT NULL DEFAULT '',last_login_at TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS auth_sessions (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS auth_sessions_email_idx ON auth_sessions(email)"),
  ]);
  const columns = await db.prepare("PRAGMA table_info(auth_accounts)").all<{ name: string }>();
  if (!columns.results.some(column => column.name === "failed_login_count")) await db.prepare("ALTER TABLE auth_accounts ADD COLUMN failed_login_count INTEGER NOT NULL DEFAULT 0").run();
  if (!columns.results.some(column => column.name === "locked_until")) await db.prepare("ALTER TABLE auth_accounts ADD COLUMN locked_until TEXT NOT NULL DEFAULT ''").run();
  if (!columns.results.some(column => column.name === "last_login_at")) await db.prepare("ALTER TABLE auth_accounts ADD COLUMN last_login_at TEXT NOT NULL DEFAULT ''").run();
  return db;
}

async function createSession(email: string, accountType: string) {
  const token = randomToken(); const db = await database();
  const isAdmin = accountType === "admin"; const lifetime = isAdmin ? "+12 hours" : "+30 days";
  await db.prepare("DELETE FROM auth_sessions WHERE expires_at<=CURRENT_TIMESTAMP").run();
  await db.prepare("INSERT INTO auth_sessions (token_hash,email,expires_at) VALUES (?,?,datetime('now',?))").bind(await sha256(token), email, lifetime).run();
  (await cookies()).set("attri_session", token, { httpOnly: true, secure: true, sameSite: isAdmin ? "strict" : "lax", path: "/", maxAge: isAdmin ? 43200 : 2592000 });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin"); if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const body = await request.json() as AuthBody; const email = body.email?.trim().toLowerCase() || ""; const password = body.password || "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!password) return Response.json({ error: "Enter your password." }, { status: 400 });
  const db = await database();
  if (body.action === "register") {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(password)) return Response.json({ error: "Use at least 10 characters with uppercase, lowercase and a number." }, { status: 400 });
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
    await createSession(email, body.role);
    return Response.json({ success: true, destination: body.role === "consultant" ? "/consultant" : "/client" }, { status: 201 });
  }
  const account = await db.prepare("SELECT email,password_hash AS passwordHash,password_salt AS passwordSalt,account_type AS accountType,status,failed_login_count AS failedLoginCount,locked_until AS lockedUntil FROM auth_accounts WHERE lower(email)=?").bind(email).first<{ email: string; passwordHash: string; passwordSalt: string; accountType: string; status: string; failedLoginCount: number; lockedUntil: string }>();
  if (account?.lockedUntil && new Date(account.lockedUntil).getTime() > Date.now()) return Response.json({ error: "Too many failed attempts. Try again after 15 minutes." }, { status: 429 });
  const passwordMatches = account ? constantTimeEqual(await passwordHash(password, account.passwordSalt), account.passwordHash) : false;
  if (!account || account.status !== "active" || !passwordMatches) {
    if (account) { const attempts = account.failedLoginCount + 1; await db.prepare("UPDATE auth_accounts SET failed_login_count=?,locked_until=CASE WHEN ?>=5 THEN datetime('now','+15 minutes') ELSE '' END,updated_at=CURRENT_TIMESTAMP WHERE email=?").bind(attempts, attempts, account.email).run(); }
    return Response.json({ error: "Incorrect email or password." }, { status: 401 });
  }
  if (body.role && body.role !== account.accountType) return Response.json({ error: `This email is registered as a ${account.accountType} account.` }, { status: 403 });
  await db.prepare("UPDATE auth_accounts SET failed_login_count=0,locked_until='',last_login_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE email=?").bind(account.email).run();
  await createSession(account.email, account.accountType);
  return Response.json({ success: true, destination: account.accountType === "admin" ? "/admin" : account.accountType === "consultant" ? "/consultant" : "/client" });
}
