import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type PortalUser = { displayName: string; email: string; fullName: string | null };
export type RegisteredAccount = PortalUser & { accountType: "user" | "consultant" };

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function getPortalUser(): Promise<PortalUser | null> {
  const token = (await cookies()).get("attri_session")?.value;
  if (!token) return null;
  try {
    const database = (await import("cloudflare:workers")).env.DB;
    const row = await database.prepare(`SELECT a.email,a.full_name AS fullName FROM auth_sessions s JOIN auth_accounts a ON lower(a.email)=lower(s.email) WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP AND a.status='active' LIMIT 1`).bind(await sha256(token)).first<{ email: string; fullName: string }>();
    return row ? { displayName: row.fullName || row.email, email: row.email, fullName: row.fullName || null } : null;
  } catch { return null; }
}

export async function requirePortalUser(returnTo: string): Promise<PortalUser> {
  const user = await getPortalUser();
  if (user) return user;
  const safeReturn = returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/account";
  redirect(`/client/login?returnTo=${encodeURIComponent(safeReturn)}`);
}

export async function getRegisteredAccount(): Promise<RegisteredAccount | null> {
  const user = await getPortalUser();
  if (!user) return null;
  try {
    const database = (await import("cloudflare:workers")).env.DB;
    const profile = await database.prepare("SELECT account_type AS accountType,registration_completed AS registrationCompleted,status FROM customer_profiles WHERE lower(email)=?").bind(user.email.toLowerCase()).first<{ accountType: string; registrationCompleted: number; status: string }>();
    if (profile?.registrationCompleted !== 1 || profile.status !== "active" || !["user", "consultant"].includes(profile.accountType)) return null;
    return { ...user, accountType: profile.accountType as "user" | "consultant" };
  } catch { return null; }
}

export async function requireRegisteredAccount(returnTo: string, role?: "user" | "consultant"): Promise<RegisteredAccount> {
  await requirePortalUser(returnTo);
  const account = await getRegisteredAccount();
  if (!account) redirect("/client/login?mode=register");
  if (role && account.accountType !== role) redirect(account.accountType === "consultant" ? "/consultant" : "/client");
  return account;
}
