import { env } from "@server";

const defaultSlots=["10:00 AM â€“ 11:00 AM","11:30 AM â€“ 12:30 PM","2:00 PM â€“ 3:00 PM","3:30 PM â€“ 4:30 PM","5:00 PM â€“ 6:00 PM"];
const defaultConsultants=["Senior Vastu Consultant","Architecture Consultant","Interior & Design Consultant"];
const normalizeSlot=(value:string)=>value.replace(/â€“|–|-/g,"-").replace(/\s+/g," ").trim();
const indiaToday=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
async function configuredList(key:string,fallback:string[]){try{const row=await env.DB.prepare("SELECT setting_value AS value FROM site_settings WHERE setting_key=?").bind(key).first<{value:string}>();const values=(row?.value||"").split(/[\n,]+/).map(value=>value.trim()).filter(Boolean);return values.length?values:fallback}catch{return fallback}}

export async function GET(request:Request){
  const params=new URL(request.url).searchParams;
  const date=params.get("date")||"";
  const consultant=params.get("consultant")||"Any available consultant";
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(`${date}T00:00:00`))||date<indiaToday())return Response.json({error:"Choose a valid future consultation date."},{status:400});
  try{
    const slots=await configuredList("consultation_slots",defaultSlots);const namedConsultants=(await configuredList("consultation_consultants",defaultConsultants)).filter(name=>name!=="Any available consultant");
    const rows=await env.DB.prepare("SELECT preferred_time AS time, consultant_preference AS consultant FROM appointments WHERE preferred_date=? AND status IN ('pending','confirmed')").bind(date).all<{time:string;consultant:string}>();
    const booked=rows.results;
    const availability=slots.map(time=>{
      const matching=booked.filter(row=>normalizeSlot(row.time)===normalizeSlot(time));
      const blockedForAll=matching.some(row=>row.consultant==="Any available consultant")||namedConsultants.every(name=>matching.some(row=>row.consultant===name));
      const blockedForConsultant=matching.some(row=>row.consultant===consultant);
      return {time,available:consultant==="Any available consultant"?!blockedForAll:!blockedForAll&&!blockedForConsultant};
    });
    return Response.json({date,consultant,slots:availability});
  }catch{return Response.json({date,consultant,slots:defaultSlots.map(time=>({time,available:true}))});}
}
