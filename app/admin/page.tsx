import { requirePortalUser } from "../auth";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requirePortalUser("/admin");
  if (user.email.toLowerCase() !== "attriassociates99@gmail.com") {
    return <main className="admin-denied"><h1>Access restricted</h1><p>This control centre is limited to authorised administrators.</p><a href="/">Return to website</a></main>;
  }
  return <AdminDashboard displayName={user.fullName ?? "SS Attri"} module="overview" />;
}
