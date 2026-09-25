import { getAdminUser } from "../../admin-auth";
import { env as runtimeEnv } from "@server";

const db = () => runtimeEnv.DB;
const normalizeSlot=(value:string)=>value.replace(/â€“|–|-/g,"-").replace(/\s+/g," ").trim();
const approvedTimes=["10:00 AM - 11:00 AM","11:30 AM - 12:30 PM","2:00 PM - 3:00 PM","3:30 PM - 4:30 PM","5:00 PM - 6:00 PM"];
const approvedConsultants=["Any available consultant","Senior Vastu Consultant","Architecture Consultant","Interior & Design Consultant"];
async function owner(){return Boolean(await getAdminUser())}
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
  const columns=await database.prepare("PRAGMA table_info(appointments)").all<{name:string}>();
  for(const [name,sql] of [["consultant_preference","ALTER TABLE appointments ADD COLUMN consultant_preference TEXT NOT NULL DEFAULT 'Any available consultant'"],["booking_type","ALTER TABLE appointments ADD COLUMN booking_type TEXT NOT NULL DEFAULT 'scheduled'"],["meeting_url","ALTER TABLE appointments ADD COLUMN meeting_url TEXT NOT NULL DEFAULT ''"],["admin_notes","ALTER TABLE appointments ADD COLUMN admin_notes TEXT NOT NULL DEFAULT ''"]])if(!columns.results.some(item=>item.name===name))await database.prepare(sql).run();
}
export async function POST(request:Request){
  const body=await request.json() as Record<string,string>;
  const required=["name","email","phone","service","consultationMode","preferredDate","preferredTime"];
  if(required.some(k=>!body[k]?.trim()))return Response.json({error:"Please complete all required fields."},{status:400});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))return Response.json({error:"Enter a valid email address."},{status:400});
  if(!/^[+0-9 ()-]{8,18}$/.test(body.phone))return Response.json({error:"Enter a valid phone number."},{status:400});
  if(!/^\d{4}-\d{2}-\d{2}$/.test(body.preferredDate)||Number.isNaN(Date.parse(`${body.preferredDate}T00:00:00`))||body.preferredDate<new Date().toISOString().slice(0,10))return Response.json({error:"Choose a valid future consultation date."},{status:400});
  if(!approvedTimes.includes(normalizeSlot(body.preferredTime)))return Response.json({error:"Choose an available consultation time."},{status:400});
  if(body.consultantPreference&&!approvedConsultants.includes(body.consultantPreference))return Response.json({error:"Choose a valid consultant preference."},{status:400});
  const reference=`AA-${Date.now().toString(36).toUpperCase()}`;
  await init();const database=await db();
  const conflict=body.consultantPreference&&body.consultantPreference!=="Any available consultant"?await database.prepare("SELECT id FROM appointments WHERE preferred_date=? AND preferred_time=? AND consultant_preference=? AND status IN ('pending','confirmed') LIMIT 1").bind(body.preferredDate,body.preferredTime,body.consultantPreference).first<{id:number}>():await database.prepare("SELECT id FROM appointments WHERE preferred_date=? AND preferred_time=? AND status IN ('pending','confirmed') LIMIT 1").bind(body.preferredDate,body.preferredTime).first<{id:number}>();
  if(conflict)return Response.json({error:"That time slot was just booked. Please choose another available time."},{status:409});
  await database.prepare(`INSERT INTO appointments
    (reference,name,email,phone,service,consultation_mode,preferred_date,preferred_time,project_type,message,consultant_preference,booking_type)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`).bind(reference,body.name.trim(),body.email.trim(),body.phone.trim(),body.service,body.consultationMode,body.preferredDate,body.preferredTime,body.projectType??"",body.message?.trim()??"",body.consultantPreference?.trim()||"Any available consultant",body.bookingType==="now"?"now":"scheduled").run();
  return Response.json({success:true,reference},{status:201});
}
export async function GET(){
  if(!await owner())return Response.json({error:"Unauthorized"},{status:401});
  await init();const database=await db();
  const rows=await database.prepare(`SELECT id,reference,name,email,phone,service,consultation_mode AS consultationMode,
    preferred_date AS preferredDate,preferred_time AS preferredTime,project_type AS projectType,message,status,
    payment_status AS paymentStatus,consultant_preference AS consultantPreference,booking_type AS bookingType,meeting_url AS meetingUrl,admin_notes AS adminNotes,created_at AS createdAt FROM appointments ORDER BY preferred_date ASC, preferred_time ASC LIMIT 200`).all();
  return Response.json({appointments:rows.results});
}
export async function PATCH(request:Request){
  if(!await owner())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:number;status?:string;consultantPreference?:string;meetingUrl?:string;adminNotes?:string};
  if(!body.id||!["pending","confirmed","completed","cancelled"].includes(body.status??""))return Response.json({error:"Invalid appointment status"},{status:400});
  await init();const database=await db();
  const appointment=await database.prepare("SELECT reference,email,name,preferred_date AS preferredDate,preferred_time AS preferredTime FROM appointments WHERE id=?").bind(body.id).first<{reference:string;email:string;name:string;preferredDate:string;preferredTime:string}>();
  await database.prepare("UPDATE appointments SET status=?,consultant_preference=COALESCE(?,consultant_preference),meeting_url=COALESCE(?,meeting_url),admin_notes=COALESCE(?,admin_notes) WHERE id=?").bind(body.status,body.consultantPreference?.trim()||null,body.meetingUrl?.trim()||null,body.adminNotes?.trim()||null,body.id).run();
  if(appointment){await database.prepare("CREATE TABLE IF NOT EXISTS portal_notifications (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,message TEXT NOT NULL,audience TEXT NOT NULL DEFAULT 'all',recipient_email TEXT NOT NULL DEFAULT '',severity TEXT NOT NULL DEFAULT 'info',action_url TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'published',expires_at TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();await database.prepare("INSERT INTO portal_notifications(title,message,audience,recipient_email,severity,action_url) VALUES (?,?,?,?,?,?)").bind(`Consultation ${body.status}`,`Your consultation ${appointment.reference} for ${appointment.preferredDate} at ${appointment.preferredTime} is now ${body.status}. Check your client portal for the latest details.`,`individual`,appointment.email.toLowerCase(),body.status==="confirmed"?"success":"info","/client").run();}
  return Response.json({success:true});
}
