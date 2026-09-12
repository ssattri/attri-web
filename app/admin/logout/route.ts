import { adminRedirectUrl, expiredAdminSessionCookie } from "../../admin-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(adminRedirectUrl(request, "/admin/login"), 303);
  const cookie = expiredAdminSessionCookie(request);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
