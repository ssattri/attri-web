import { getChatGPTUser } from "../../chatgpt-auth";

async function database(){ return (await import("cloudflare:workers")).env.DB; }

async function initialise(){
  const d=await database();
  await d.batch([
    d.prepare(`CREATE TABLE IF NOT EXISTS portal_notifications (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,message TEXT NOT NULL,audience TEXT NOT NULL DEFAULT 'all',recipient_email TEXT NOT NULL DEFAULT '',severity TEXT NOT NULL DEFAULT 'info',action_url TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'published',expires_at TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
    d.prepare(`CREATE TABLE IF NOT EXISTS notification_reads (id INTEGER PRIMARY KEY AUTOINCREMENT,notification_id INTEGER NOT NULL,user_email TEXT NOT NULL,read_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
    d.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS notification_read_unique ON notification_reads(notification_id,user_email)`),
  ]);
}

export async function GET(){
  const user=await getChatGPTUser(); if(!user)return Response.json({error:"Unauthorized"},{status:401});
  await initialise(); const d=await database(); const email=user.email.toLowerCase();
  const profile=await d.prepare("SELECT account_type AS accountType FROM customer_profiles WHERE lower(email)=?").bind(email).first<{accountType:string}>();
  const role=profile?.accountType; if(!["user","consultant"].includes(role??""))return Response.json({error:"Complete account setup."},{status:403});
  const result=await d.prepare(`SELECT n.id,n.title,n.message,n.severity,n.action_url AS actionUrl,n.created_at AS createdAt,CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS isRead FROM portal_notifications n LEFT JOIN notification_reads r ON r.notification_id=n.id AND lower(r.user_email)=? WHERE n.status='published' AND (n.expires_at='' OR n.expires_at>=date('now')) AND (n.audience='all' OR n.audience=? OR lower(n.recipient_email)=?) ORDER BY n.created_at DESC LIMIT 50`).bind(email,role,email).all();
  return Response.json({role,notifications:result.results,unread:result.results.filter((x:any)=>!x.isRead).length});
}

export async function PATCH(request:Request){
  const user=await getChatGPTUser(); if(!user)return Response.json({error:"Unauthorized"},{status:401});
  await initialise(); const d=await database(); const body=await request.json() as {id?:number;all?:boolean};
  if(body.all){
    const profile=await d.prepare("SELECT account_type AS accountType FROM customer_profiles WHERE lower(email)=?").bind(user.email.toLowerCase()).first<{accountType:string}>();
    await d.prepare(`INSERT OR IGNORE INTO notification_reads(notification_id,user_email) SELECT id,? FROM portal_notifications WHERE status='published' AND (audience='all' OR audience=? OR lower(recipient_email)=?)`).bind(user.email.toLowerCase(),profile?.accountType??"",user.email.toLowerCase()).run();
  }else if(body.id){ await d.prepare("INSERT OR IGNORE INTO notification_reads(notification_id,user_email) VALUES (?,?)").bind(body.id,user.email.toLowerCase()).run(); }
  else return Response.json({error:"Notification id required."},{status:400});
  return Response.json({success:true});
}
