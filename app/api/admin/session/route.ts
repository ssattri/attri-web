import { adminRedirectUrl, adminSessionCookie, authenticateAdmin, expiredAdminSessionCookie, safeAdminPath } from "../../../admin-auth";
import { NextResponse } from "next/server";

// Never expose the auth endpoint as a browser page if a proxy or user follows it.
export async function GET(request: Request) {
  return Response.redirect(adminRedirectUrl(request, "/ss_attri/admin/login"), 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const returnTo = safeAdminPath(String(form.get("returnTo") || "/admin"));

  if (!await authenticateAdmin(email, password)) {
    if (request.headers.get("x-admin-login") === "1") return NextResponse.json({ error: "We could not verify those credentials." }, { status: 401 });
    return Response.redirect(adminRedirectUrl(request, `/ss_attri/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`), 303);
  }

  try {
    const cookie = await adminSessionCookie(request);
    if (request.headers.get("x-admin-login") === "1") { const response = NextResponse.json({ success: true }); response.cookies.set(cookie.name, cookie.value, cookie.options); return response; }
    const response = NextResponse.redirect(adminRedirectUrl(request, returnTo), 303);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch {
    return Response.redirect(adminRedirectUrl(request, `/ss_attri/admin/login?error=configuration&return_to=${encodeURIComponent(returnTo)}`), 303);
  }
}

export async function DELETE(request: Request) {
  const response = NextResponse.redirect(adminRedirectUrl(request, "/ss_attri/admin/login"), 303);
  const cookie = expiredAdminSessionCookie(request);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
