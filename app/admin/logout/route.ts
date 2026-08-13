import { clearAdminSession } from "../../admin-auth";

export async function GET(request: Request) {
  await clearAdminSession(request);
  return Response.redirect("/admin/login", 303);
}
