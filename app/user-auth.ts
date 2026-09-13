import { cookies } from "next/headers";

const COOKIE = "attri_user_session";
const supabaseUrl = () => (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const publishableKey = () => process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export type AppUser = { id: string; email: string; fullName: string | null; displayName: string };

type Session = { access_token: string; refresh_token?: string; expires_at?: number };

function decode(value: string): Session | null {
  try { return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Session; } catch { return null; }
}
function encode(value: Session) { return Buffer.from(JSON.stringify(value)).toString("base64url"); }

export function userSessionCookie(session: Session) {
  return { name: COOKIE, value: encode(session), httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 };
}
export function expiredUserSessionCookie() { return { name: COOKIE, value: "", httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 }; }

async function authRequest(path: string, init: RequestInit = {}) {
  const key = publishableKey();
  if (!supabaseUrl() || !key) throw new Error("Supabase Auth is not configured.");
  const headers = new Headers(init.headers); headers.set("apikey", key); headers.set("Content-Type", "application/json");
  return fetch(`${supabaseUrl()}/auth/v1${path}`, { ...init, headers, cache: "no-store" });
}

export async function signInWithPassword(email: string, password: string) {
  const r = await authRequest("/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
  const data = await r.json(); if (!r.ok) throw new Error(data.error_description || data.msg || "Unable to sign in."); return data as Session & { user: { id: string; email: string; user_metadata?: { full_name?: string } } };
}
export async function signUpWithPassword(email: string, password: string, fullName: string) {
  const r = await authRequest("/signup", { method: "POST", body: JSON.stringify({ email, password, data: { full_name: fullName } }) });
  const data = await r.json(); if (!r.ok) throw new Error(data.msg || data.error_description || "Unable to create account."); return data as Session & { user?: { id: string; email: string; user_metadata?: { full_name?: string } } };
}

export async function getAppUser(): Promise<AppUser | null> {
  const jar = await cookies(); const raw = jar.get(COOKIE)?.value; if (!raw) return null; const session = decode(raw); if (!session?.access_token) return null;
  const r = await authRequest("/user", { headers: { Authorization: `Bearer ${session.access_token}` } });
  if (!r.ok) return null;
  const user = await r.json() as { id: string; email?: string; user_metadata?: { full_name?: string } };
  const email = user.email || ""; const fullName = user.user_metadata?.full_name || null;
  return { id: user.id, email, fullName, displayName: fullName || email };
}

export { COOKIE as USER_SESSION_COOKIE };
