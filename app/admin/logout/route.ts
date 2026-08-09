import { clearAdminSession } from "../../admin-auth";

export async function GET(request: Request) {
  await clearAdminSession();
  return Response.redirect(new URL("/admin/login", request.url), 303);
}
