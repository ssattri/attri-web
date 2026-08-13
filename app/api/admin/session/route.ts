import { authenticateAdmin, clearAdminSession, createAdminSession, safeAdminPath } from "../../../admin-auth";

// Never expose the auth endpoint as a browser page if a proxy or user follows it.
export async function GET() {
  return Response.redirect("/admin/login", 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");
  const returnTo = safeAdminPath(String(form.get("returnTo") || "/admin"));

  if (!await authenticateAdmin(email, password)) {
    return Response.redirect(`/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`, 303);
  }

  await createAdminSession(request);
  return Response.redirect(returnTo, 303);
}

export async function DELETE(request: Request) {
  await clearAdminSession(request);
  return Response.redirect("/admin/login", 303);
}
