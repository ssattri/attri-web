import { getChatGPTUser } from "../../../chatgpt-auth";

async function db() { return (await import("cloudflare:workers")).env.DB; }
async function allowed() { const user = await getChatGPTUser(); return user?.email.toLowerCase() === "attriassociates99@gmail.com"; }
async function init() {
  const database = await db();
  await database.prepare(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '', service TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

export async function GET() {
  if (!await allowed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await init(); const database = await db();
  const rows = await database.prepare("SELECT id,name,email,phone,service,status,created_at AS createdAt FROM leads ORDER BY created_at DESC LIMIT 100").all();
  return Response.json({ leads: rows.results });
}
export async function POST(request: Request) {
  if (!await allowed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string,string>;
  if (!body.name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });
  await init(); const database = await db();
  await database.prepare("INSERT INTO leads (name,email,phone,service) VALUES (?,?,?,?)").bind(body.name.trim(),body.email?.trim() ?? "",body.phone?.trim() ?? "",body.service?.trim() ?? "").run();
  return Response.json({ success:true },{status:201});
}
export async function PATCH(request: Request) {
  if (!await allowed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as {id?:number,status?:string};
  if (!body.id || !["new","contacted","qualified","won","lost"].includes(body.status ?? "")) return Response.json({error:"Invalid lead status"},{status:400});
  await init(); const database = await db();
  await database.prepare("UPDATE leads SET status=? WHERE id=?").bind(body.status,body.id).run();
  return Response.json({success:true});
}
