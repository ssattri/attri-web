import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
const modules=["overview","analytics","notifications","seo-manager","database","data-managers","permissions","pages","blog","faqs","projects","leads","appointments","products","product-categories","commerce","courses","course-categories","learning","support","finance","reports","operations","automation","media","vault","settings"];

export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  if(!modules.includes(module)) notFound();
  redirect(module==="overview"?"/admin":`/admin?module=${encodeURIComponent(module)}`);
}
