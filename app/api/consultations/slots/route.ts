import{getConsultantSlots}from"../../../consultant-availability";
export async function GET(r:Request){const q=new URL(r.url).searchParams,id=Number(q.get("consultantId")),date=String(q.get("date")||"");if(!id||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)||date<new Date().toISOString().slice(0,10))return Response.json({slots:[]});return Response.json({slots:await getConsultantSlots(id,date)})}
