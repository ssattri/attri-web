import { getAdminModulePermissions, requireAdmin } from "../auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin("/admin");
  const permissions = await getAdminModulePermissions(user.email);
  return <AdminDashboard displayName={user.fullName ?? "SS Attri"} module="overview" allowedModules={permissions} />;
}
