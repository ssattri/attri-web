import { notFound, redirect } from "next/navigation";
import { adminModules } from "../AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  if(!adminModules.some(([key])=>key===module)) notFound();
  redirect(module==="overview"?"/admin":`/admin?module=${encodeURIComponent(module)}`);
}
