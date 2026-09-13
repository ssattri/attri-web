import { NextResponse } from "next/server";
import { signInWithPassword, signUpWithPassword, userSessionCookie, expiredUserSessionCookie } from "../../../user-auth";
export async function POST(request: Request) {
  const body = (request.headers.get("content-type") || "").includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries());
  if (body.action === "signout") { const response = (request.headers.get("content-type") || "").includes("application/json") ? NextResponse.json({ success: true }) : NextResponse.redirect(new URL("/client/login", request.url)); response.cookies.set(expiredUserSessionCookie()); return response; }
  const email = body.email?.trim().toLowerCase() || ""; const password = body.password || "";
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return NextResponse.json({ error: "Enter a valid email and a password of at least 8 characters." }, { status: 400 });
  try { const data = body.action === "signup" ? await signUpWithPassword(email, password, body.fullName?.trim() || "") : await signInWithPassword(email, password); const response = NextResponse.json({ success: true, requiresEmailConfirmation: !data.access_token }); if (data.access_token) response.cookies.set(userSessionCookie({ access_token: data.access_token, refresh_token: data.refresh_token })); return response; }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Authentication failed." }, { status: 401 }); }
}
