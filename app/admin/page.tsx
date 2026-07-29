import { requireChatGPTUser } from "../chatgpt-auth";
import AdminDashboard, { adminModules } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage({searchParams}:{searchParams:Promise<{module?:string}>}) {
  const requested=(await searchParams).module||"overview";
  const module=adminModules.some(([key])=>key===requested)?requested:"overview";
  const returnTo=module==="overview"?"/admin":`/admin?module=${encodeURIComponent(module)}`;
  const user = await requireChatGPTUser(returnTo);
  if (user.email.toLowerCase() !== "attriassociates99@gmail.com") {
    return <main className="admin-denied"><h1>Access restricted</h1><p>This control centre is limited to authorised administrators.</p><a href="/">Return to website</a></main>;
  }
  return <AdminDashboard displayName={user.fullName ?? "SS Attri"} module={module} />;
}
