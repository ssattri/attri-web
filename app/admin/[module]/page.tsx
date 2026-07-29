import { notFound } from "next/navigation";
import { requireChatGPTUser } from "../../chatgpt-auth";
import AdminDashboard, { adminModules } from "../AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  if(!adminModules.some(([key])=>key===module)) notFound();
  const user=await requireChatGPTUser(`/admin/${module}`);
  if(user.email.toLowerCase()!=="attriassociates99@gmail.com"){
    return <main className="admin-denied"><h1>Access restricted</h1><p>This control centre is limited to authorised administrators.</p><a href="/">Return to website</a></main>;
  }
  return <AdminDashboard displayName={user.fullName??"SS Attri"} module={module}/>;
}
