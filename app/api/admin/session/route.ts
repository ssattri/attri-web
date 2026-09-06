import { adminRedirectUrl, authenticateAdmin, clearAdminSession, consumeAdminOneTimePassword, createAdminSession, isAdminOneTimePassword, safeAdminPath } from "../../../admin-auth";

// Never expose the auth endpoint as a browser page if a proxy or user follows it.
export async function GET(request: Request) {
  return Response.redirect(adminRedirectUrl(request, "/admin/login"), 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const returnTo = safeAdminPath(String(form.get("returnTo") || "/admin"));

  const oneTimePassword = await isAdminOneTimePassword(email, password);
  if (!oneTimePassword && !await authenticateAdmin(email, password)) {
    return Response.redirect(adminRedirectUrl(request, `/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`), 303);
  }

  try {
    await createAdminSession(request, oneTimePassword);
    if (oneTimePassword) await consumeAdminOneTimePassword();
    return Response.redirect(adminRedirectUrl(request, oneTimePassword ? "/admin/setup?first=1" : returnTo), 303);
  } catch {
    return Response.redirect(adminRedirectUrl(request, `/admin/login?error=configuration&return_to=${encodeURIComponent(returnTo)}`), 303);
  }
}

export async function DELETE(request: Request) {
  await clearAdminSession(request);
  return Response.redirect(adminRedirectUrl(request, "/admin/login"), 303);
}
