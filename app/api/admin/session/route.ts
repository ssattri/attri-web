import { adminRedirectUrl, authenticateAdmin, clearAdminSession, createAdminSession, safeAdminPath } from "../../../admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const returnTo = safeAdminPath(String(form.get("returnTo") || "/admin"));

  if (!await authenticateAdmin(email, password)) {
    return Response.redirect(adminRedirectUrl(request, `/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`), 303);
  }

  await createAdminSession();
  return Response.redirect(adminRedirectUrl(request, returnTo), 303);
}

export async function DELETE(request: Request) {
  await clearAdminSession();
  return Response.redirect(adminRedirectUrl(request, "/admin/login"), 303);
}
