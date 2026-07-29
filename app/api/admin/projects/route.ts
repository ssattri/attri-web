import { getChatGPTUser } from "../../../chatgpt-auth";

async function db() { return (await import("cloudflare:workers")).env.DB; }
async function allowed() { const user = await getChatGPTUser(); return user?.email.toLowerCase() === "attriassociates99@gmail.com"; }
async function init() {
  const database = await db();
  await database.prepare(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'draft',
    description TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}
export async function GET() {
  if (!await allowed()) return Response.json({error:"Unauthorized"},{status:401});
  await init(); const database=await db();
  const rows=await database.prepare("SELECT id,title,category,location,status,description,created_at AS createdAt FROM projects ORDER BY created_at DESC LIMIT 100").all();
  return Response.json({projects:rows.results});
}
export async function POST(request:Request) {
  if (!await allowed()) return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as Record<string,string>;
  if(!body.title?.trim() || !body.category?.trim()) return Response.json({error:"Title and category are required"},{status:400});
  await init(); const database=await db();
  await database.prepare("INSERT INTO projects (title,category,location,description) VALUES (?,?,?,?)").bind(body.title.trim(),body.category.trim(),body.location?.trim()??"",body.description?.trim()??"").run();
  return Response.json({success:true},{status:201});
}
export async function PATCH(request:Request) {
  if (!await allowed()) return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:number,status?:string};
  if(!body.id || !["draft","active","completed","featured"].includes(body.status??"")) return Response.json({error:"Invalid project status"},{status:400});
  await init(); const database=await db();
  await database.prepare("UPDATE projects SET status=? WHERE id=?").bind(body.status,body.id).run();
  return Response.json({success:true});
}
