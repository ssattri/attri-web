import { getAdminUser } from "../../../admin-auth";
import { env } from "@server";

async function owner() { return (await getAdminUser())?.email.toLowerCase() === (process.env.ADMIN_EMAIL || "attriassociates99@gmail.com").toLowerCase(); }
async function hash(value:string) { const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)); return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join(""); }
export async function POST(request:Request) {
  if (!await owner()) return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {currentPassword?:string;newPassword?:string;confirmPassword?:string};
  if (!body.currentPassword || !body.newPassword || body.newPassword!==body.confirmPassword) return Response.json({error:"Passwords do not match."},{status:400});
  if (body.newPassword.length<12) return Response.json({error:"Use at least 12 characters."},{status:400});
  const current=await hash(body.currentPassword);
  const saved=(await env.DB.prepare("SELECT setting_value FROM site_settings WHERE setting_key='admin_password_sha256'").first<{setting_value:string}>())?.setting_value;
  const configured=process.env.ADMIN_PASSWORD?await hash(process.env.ADMIN_PASSWORD):"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646";
  if (current!==(saved||configured)) return Response.json({error:"Current password is incorrect."},{status:400});
  await env.DB.prepare("INSERT INTO site_settings (setting_key,setting_value,value_type,is_public,updated_by) VALUES ('admin_password_sha256',?,'secret',0,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP").bind(await hash(body.newPassword),(await getAdminUser())?.email||"").run();
  return Response.json({success:true});
}
