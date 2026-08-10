import { clearAdminSession } from "../../admin-auth";

export async function GET(request: Request) {
  await clearAdminSession();
  return Response.redirect("/admin/login", 303);
}
