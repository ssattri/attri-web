import { requireAdminUser } from "../admin-auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdminUser("/admin");
  return <AdminDashboard displayName={user.fullName ?? "SS Attri"} module="overview" />;
}
