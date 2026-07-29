import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
const modules=["overview","analytics","notifications","seo-manager","database","data-managers","permissions","pages","projects","leads","appointments","products","commerce","courses","learning","support","finance","reports","operations","automation","vault"];

export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  if(!modules.includes(module)) notFound();
  redirect(module==="overview"?"/admin":`/admin?module=${encodeURIComponent(module)}`);
}
