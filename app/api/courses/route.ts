async function db(){return(await import("cloudflare:workers")).env.DB}
async function init(){
 const d=await db();await d.batch([
  d.prepare(`CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL,level TEXT NOT NULL DEFAULT 'Beginner',mode TEXT NOT NULL DEFAULT 'Recorded',duration TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',price INTEGER NOT NULL DEFAULT 0,lessons INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'published',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
 d.prepare(`CREATE TABLE IF NOT EXISTS enrollments (id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT NOT NULL UNIQUE,course_id INTEGER NOT NULL,student_name TEXT NOT NULL,email TEXT NOT NULL,phone TEXT NOT NULL,experience TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'pending',payment_status TEXT NOT NULL DEFAULT 'pending',progress INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
 ]);
 const columns=await d.prepare("PRAGMA table_info(courses)").all<{name:string}>();
 for(const [name,sql] of [
  ["image_url","ALTER TABLE courses ADD COLUMN image_url TEXT NOT NULL DEFAULT ''"],
  ["instructor","ALTER TABLE courses ADD COLUMN instructor TEXT NOT NULL DEFAULT 'Attri Academy Faculty'"],
  ["certificate","ALTER TABLE courses ADD COLUMN certificate INTEGER NOT NULL DEFAULT 1"],
  ["show_in_shop","ALTER TABLE courses ADD COLUMN show_in_shop INTEGER NOT NULL DEFAULT 1"],
  ["meta_title","ALTER TABLE courses ADD COLUMN meta_title TEXT NOT NULL DEFAULT ''"],
  ["meta_keywords","ALTER TABLE courses ADD COLUMN meta_keywords TEXT NOT NULL DEFAULT ''"],
  ["meta_description","ALTER TABLE courses ADD COLUMN meta_description TEXT NOT NULL DEFAULT ''"]
 ])if(!columns.results.some(x=>x.name===name))await d.prepare(sql).run();
 const c=await d.prepare("SELECT COUNT(*) AS total FROM courses").first<{total:number}>();if(!c?.total)await d.batch([
  d.prepare("INSERT INTO courses (title,slug,category,level,mode,duration,description,price,lessons) VALUES (?,?,?,?,?,?,?,?,?)").bind("Scientific Vastu Foundations","scientific-vastu-foundations","Vastu Shastra","Beginner","Recorded","8 weeks","Understand directions, elements, zones and practical residential analysis.",1499900,32),
  d.prepare("INSERT INTO courses (title,slug,category,level,mode,duration,description,price,lessons) VALUES (?,?,?,?,?,?,?,?,?)").bind("Advanced Industrial Vastu","advanced-industrial-vastu","Professional","Advanced","Live + Recorded","12 weeks","Factory planning, production flow, utilities, management and corrective strategy.",2999900,42),
  d.prepare("INSERT INTO courses (title,slug,category,level,mode,duration,description,price,lessons) VALUES (?,?,?,?,?,?,?,?,?)").bind("Vastu-Compliant Floor Planning","vastu-floor-planning","Architecture","Intermediate","Recorded","6 weeks","Turn Vastu principles into functional, buildable architectural plans.",1999900,24),
  d.prepare("INSERT INTO courses (title,slug,category,level,mode,duration,description,price,lessons) VALUES (?,?,?,?,?,?,?,?,?)").bind("Free Vastu Orientation","free-vastu-orientation","Vastu Shastra","Beginner","Recorded","90 minutes","A concise introduction to scientific Vastu and responsible practice.",0,6)
 ])
}
export async function GET(){await init();const d=await db();const r=await d.prepare("SELECT id,title,slug,category,level,mode,duration,description,price,lessons,image_url AS imageUrl,instructor,certificate FROM courses WHERE status='published' ORDER BY id DESC").all();return Response.json({courses:r.results})}
export async function POST(request:Request){
 const b=await request.json() as Record<string,string>;if(!b.courseId||!b.name||!b.email||!b.phone)return Response.json({error:"Complete all required enrollment details."},{status:400});
 await init();const d=await db();const course=await d.prepare("SELECT id FROM courses WHERE id=? AND status='published'").bind(Number(b.courseId)).first();if(!course)return Response.json({error:"Course is unavailable."},{status:404});
 const reference=`ENR-${Date.now().toString(36).toUpperCase()}`;await d.prepare("INSERT INTO enrollments (reference,course_id,student_name,email,phone,experience) VALUES (?,?,?,?,?,?)").bind(reference,Number(b.courseId),b.name.trim(),b.email.trim(),b.phone.trim(),b.experience??"").run();return Response.json({success:true,reference},{status:201})
}
