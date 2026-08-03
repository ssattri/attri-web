import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
const modules=["overview","analytics","notifications","seo-manager","database","data-managers","permissions","pages","blog","banners","testimonials","faqs","projects","leads","enquiries","appointments","consultations","consultancy","products","product-categories","commerce","shipping","tax","courses","course-categories","learning","support","reviews","finance","reports","operations","automation","module-control","media","vault","settings"];

export default async function AdminModulePage({params}:{params:Promise<{module:string}>}) {
  const {module}=await params;
  if(!modules.includes(module)) notFound();
  redirect(module==="overview"?"/admin":`/admin?module=${encodeURIComponent(module)}`);
}
