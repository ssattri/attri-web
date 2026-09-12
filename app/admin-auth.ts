import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "attri_admin_session_v2";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 8;

function isProduction() { return process.env.NODE_ENV === "production"; }
export function canonicalSiteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.attriassociates.com").replace(/\/$/, ""); }
export function adminRedirectUrl(request: Request, path: string) { const incoming = new URL(request.url); return new URL(path, !isProduction() && ["localhost", "127.0.0.1", "0.0.0.0"].includes(incoming.hostname) ? incoming.origin : canonicalSiteUrl()); }
export type AdminUser = { displayName: string; email: string; fullName: string };

export function adminEmail() {
  const configured = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configured) throw new Error("ADMIN_EMAIL must be configured.");
  return configured;
}

function adminPassword() {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || configured.startsWith("replace-")) throw new Error("ADMIN_PASSWORD must be configured.");
  return configured;
}

export async function isAdminPasswordConfigured() {
  try { return Boolean(adminEmail() && adminPassword()); } catch { return false; }
}

export async function authenticateAdmin(email: string, password: string) {
  try { return safeEqual(email.trim().toLowerCase(), adminEmail()) && safeEqual(password, adminPassword()); } catch { return false; }
}

export async function createAdminSession(request?: Request) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS;
  const payload = `${adminEmail()}.${expires}`;
  (await cookies()).set(ADMIN_SESSION_COOKIE, `${payload}.${await sign(payload)}`, sessionCookieOptions(request, SESSION_LIFETIME_SECONDS));
}

export async function clearAdminSession(request?: Request) {
  (await cookies()).set(ADMIN_SESSION_COOKIE, "", sessionCookieOptions(request, 0));
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (!session) return null;
    const index = session.lastIndexOf(".");
    if (index < 0) return null;
    const payload = session.slice(0, index), signature = session.slice(index + 1), separator = payload.lastIndexOf(".");
    if (separator < 1) return null;
    const email = payload.slice(0, separator), expires = Number(payload.slice(separator + 1));
    if (email !== adminEmail() || !Number.isInteger(expires) || expires <= Math.floor(Date.now() / 1000) || !safeEqual(signature, await sign(payload))) return null;
    return { displayName: "SS Attri", email, fullName: "SS Attri" };
  } catch { return null; }
}

export async function requireAdminUser(returnTo: string): Promise<AdminUser> { const user = await getAdminUser(); if (user) return user; redirect(`/admin/login?return_to=${encodeURIComponent(safeAdminPath(returnTo))}`); }
export function safeAdminPath(value: string | null | undefined) { if (!value?.startsWith("/admin") || value.startsWith("//")) return "/admin"; try { const url = new URL(value, "https://app.local"); return url.origin === "https://app.local" && url.pathname !== "/admin/login" ? `${url.pathname}${url.search}${url.hash}` : "/admin"; } catch { return "/admin"; } }

function sessionCookieOptions(request: Request | undefined, maxAge: number) {
  const forwarded = request?.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const secure = isProduction() || forwarded === "https" || (!forwarded && request ? new URL(request.url).protocol === "https:" : false);
  const hostname = new URL(canonicalSiteUrl()).hostname.replace(/^www\./, "");
  const domain = isProduction() && hostname === "attriassociates.com" ? hostname : undefined;
  return { httpOnly: true, sameSite: "lax" as const, secure, path: "/", maxAge, ...(domain ? { domain } : {}) };
}

async function sign(payload: string) {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (!configured || configured.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(configured), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))));
}
function toHex(bytes: Uint8Array) { return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join(""); }
function safeEqual(left: string, right: string) { let difference = left.length ^ right.length; const length = Math.max(left.length, right.length); for (let index = 0; index < length; index += 1) difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0); return difference === 0; }
