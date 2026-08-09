import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "attri_admin_session";
const DEFAULT_ADMIN_EMAIL = "attriassociates99@gmail.com";
const DEFAULT_PASSWORD_SHA256 =
  "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

export type AdminUser = {
  displayName: string;
  email: string;
  fullName: string;
};

export function adminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

export async function authenticateAdmin(email: string, password: string) {
  const submittedEmail = email.trim().toLowerCase();
  const expectedPasswordHash = process.env.ADMIN_PASSWORD
    ? await sha256(process.env.ADMIN_PASSWORD)
    : DEFAULT_PASSWORD_SHA256;
  const submittedPasswordHash = await sha256(password);

  return (
    safeEqual(submittedEmail, adminEmail()) &&
    safeEqual(submittedPasswordHash, expectedPasswordHash)
  );
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS;
  const payload = `${adminEmail()}.${expires}`;
  const signature = await sign(payload);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!session) return null;

  const separator = session.lastIndexOf(".");
  if (separator < 0) return null;
  const payload = session.slice(0, separator);
  const signature = session.slice(separator + 1);
  const expirySeparator = payload.lastIndexOf(".");
  if (expirySeparator < 0) return null;
  const email = payload.slice(0, expirySeparator);
  const expires = Number(payload.slice(expirySeparator + 1));
  if (
    email !== adminEmail() ||
    !Number.isInteger(expires) ||
    expires <= Math.floor(Date.now() / 1000) ||
    !safeEqual(signature, await sign(payload))
  ) return null;

  return { displayName: "SS Attri", email, fullName: "SS Attri" };
}

export async function requireAdminUser(returnTo: string): Promise<AdminUser> {
  const user = await getAdminUser();
  if (user) return user;
  redirect(`/admin/login?return_to=${encodeURIComponent(safeAdminPath(returnTo))}`);
}

export function safeAdminPath(value: string | null | undefined) {
  if (!value?.startsWith("/admin") || value.startsWith("//")) return "/admin";
  try {
    const url = new URL(value, "https://app.local");
    if (url.origin !== "https://app.local" || url.pathname === "/admin/login") return "/admin";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/admin";
  }
}

async function sign(payload: string) {
  const fallbackSecret = `attri-admin-session:${DEFAULT_PASSWORD_SHA256}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || fallbackSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bytesToHex(new Uint8Array(signature));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string) {
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index++) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}
