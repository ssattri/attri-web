import { getPortalUser, getRegisteredAccount } from "../../auth";

async function db(){return(await import("cloudflare:workers")).env.DB}
async function owner(){const u=await getPortalUser();return u?.accountType==="admin"}
async function init(){
  const database=await db();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      email TEXT NOT NULL, phone TEXT NOT NULL, service TEXT NOT NULL, consultation_mode TEXT NOT NULL,
      preferred_date TEXT NOT NULL, preferred_time TEXT NOT NULL, project_type TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'not-required', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    database.prepare("CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments (status)"),
    database.prepare("CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments (preferred_date)")
  ]);
}
export async function POST(request:Request){
  const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  const account=await getRegisteredAccount();if(!account||account.accountType!=="user")return Response.json({error:"Sign in or register as a User before booking a consultation."},{status:401});
  const body=await request.json() as Record<string,string>;
  const required=["name","email","phone","service","consultationMode","preferredDate","preferredTime"];
  if(required.some(k=>!body[k]?.trim()))return Response.json({error:"Please complete all required fields."},{status:400});
  if(!/^[+0-9 ()-]{8,18}$/.test(body.phone))return Response.json({error:"Enter a valid phone number."},{status:400});
  const reference=`AA-${Date.now().toString(36).toUpperCase()}`;
  await init();const database=await db();
  await database.prepare(`INSERT INTO appointments
    (reference,name,email,phone,service,consultation_mode,preferred_date,preferred_time,project_type,message)
    VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(reference,body.name.trim(),account.email.toLowerCase(),body.phone.trim(),body.service,body.consultationMode,body.preferredDate,body.preferredTime,body.projectType??"",body.message?.trim()??"").run();
  return Response.json({success:true,reference},{status:201});
}
export async function GET(){
  if(!await owner())return Response.json({error:"Unauthorized"},{status:401});
  await init();const database=await db();
  const rows=await database.prepare(`SELECT id,reference,name,email,phone,service,consultation_mode AS consultationMode,
    preferred_date AS preferredDate,preferred_time AS preferredTime,project_type AS projectType,message,status,
    payment_status AS paymentStatus,amount,duration_minutes AS durationMinutes,meeting_url AS meetingUrl,assigned_to AS assignedTo,admin_notes AS adminNotes,created_at AS createdAt FROM appointments ORDER BY preferred_date ASC, preferred_time ASC LIMIT 200`).all();
  return Response.json({appointments:rows.results});
}
export async function PATCH(request:Request){
  if(!await owner())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:number,status?:string;meetingUrl?:string;assignedTo?:string;adminNotes?:string};
  if(!body.id||!["pending","confirmed","completed","cancelled"].includes(body.status??""))return Response.json({error:"Invalid appointment status"},{status:400});
  await init();const database=await db();
  await database.prepare("UPDATE appointments SET status=?,meeting_url=COALESCE(?,meeting_url),assigned_to=COALESCE(?,assigned_to),admin_notes=COALESCE(?,admin_notes) WHERE id=?").bind(body.status,body.meetingUrl??null,body.assignedTo??null,body.adminNotes??null,body.id).run();
  return Response.json({success:true});
}
