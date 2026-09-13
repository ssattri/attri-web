import { adminRedirectUrl, authenticateAdmin, expiredAdminSessionCookie, getAdminUser } from "../../../admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Your admin session has expired. Please sign in again." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (body.action !== "verify-password") return Response.json({ error: "Unsupported security action." }, { status: 400 });
  if (!await authenticateAdmin(user.email, String(body.currentPassword || ""))) return Response.json({ error: "The current password is incorrect." }, { status: 403 });
  const newPassword = String(body.newPassword || "");
  const confirmPassword = String(body.confirmPassword || "");
  if (newPassword || confirmPassword) {
    if (newPassword !== confirmPassword) return Response.json({ error: "The new passwords do not match." }, { status: 400 });
    if (newPassword.length < 10) return Response.json({ error: "The new password must contain at least 10 characters." }, { status: 400 });
  }
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const response = NextResponse.redirect(adminRedirectUrl(request, "/admin/login"), 303);
  const cookie = expiredAdminSessionCookie(request);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
