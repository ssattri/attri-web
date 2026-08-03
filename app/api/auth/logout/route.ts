import { cookies } from "next/headers";
export async function GET(request: Request) {
  const store = await cookies(); const token = store.get("attri_session")?.value;
  if (token) try { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)); const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join(""); const db = (await import("cloudflare:workers")).env.DB; await db.prepare("DELETE FROM auth_sessions WHERE token_hash=?").bind(hash).run(); } catch {}
  store.delete("attri_session"); return Response.redirect(new URL("/", request.url), 303);
}
