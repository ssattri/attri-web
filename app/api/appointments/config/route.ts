import {env} from "@server";

const defaultSlots=["10:00 AM â€“ 11:00 AM","11:30 AM â€“ 12:30 PM","2:00 PM â€“ 3:00 PM","3:30 PM â€“ 4:30 PM","5:00 PM â€“ 6:00 PM"];
const defaultConsultants=["Any available consultant","Senior Vastu Consultant","Architecture Consultant","Interior & Design Consultant"];
async function configuredList(key:string,fallback:string[]){try{const row=await env.DB.prepare("SELECT setting_value AS value FROM site_settings WHERE setting_key=?").bind(key).first<{value:string}>();const values=(row?.value||"").split(/[\n,]+/).map(value=>value.trim()).filter(Boolean);return values.length?values:fallback}catch{return fallback}}
const indiaToday=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
export async function GET(){const slots=await configuredList("consultation_slots",defaultSlots);const consultants=(await configuredList("consultation_consultants",defaultConsultants.slice(1))).filter(value=>value!=="Any available consultant");return Response.json({today:indiaToday(),slots,consultants:["Any available consultant",...consultants]},{headers:{"cache-control":"no-store"}})}
