import { adminRedirectUrl, clearAdminSession } from "../../admin-auth";

export async function GET(request: Request) {
  await clearAdminSession(request);
  return Response.redirect(adminRedirectUrl(request, "/admin/login"), 303);
}
