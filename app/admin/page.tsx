import { requireAdmin } from "../auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin("/admin");
  return <AdminDashboard displayName={user.fullName ?? "SS Attri"} module="overview" />;
}
