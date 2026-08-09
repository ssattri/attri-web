import { canonicalSiteUrl, clearAdminSession } from "../../admin-auth";

export async function GET(request: Request) {
  await clearAdminSession();
  return Response.redirect(new URL("/admin/login", canonicalSiteUrl()), 303);
}
