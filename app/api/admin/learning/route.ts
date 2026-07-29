import{getChatGPTUser}from"../../../chatgpt-auth";
async function db(){return(await import("cloudflare:workers")).env.DB}
async function ok(){return(await getChatGPTUser())?.email.toLowerCase()==="attriassociates99@gmail.com"}
async function ensureCourses(d:Awaited<ReturnType<typeof db>>){
  await d.prepare(`CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'Beginner',mode TEXT NOT NULL DEFAULT 'Recorded',duration TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',price INTEGER NOT NULL DEFAULT 0,lessons INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
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
}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)}
export async function GET(){
  if(!await ok())return Response.json({error:"Unauthorized"},{status:401});const d=await db();await ensureCourses(d);
  const courses=await d.prepare("SELECT id,title,slug,category,level,mode,duration,description,price,lessons,status,image_url AS imageUrl,instructor,certificate,show_in_shop AS showInShop,meta_title AS metaTitle,meta_keywords AS metaKeywords,meta_description AS metaDescription,created_at AS createdAt FROM courses ORDER BY id DESC").all();
  const enrollments=await d.prepare("SELECT e.id,e.reference,e.student_name AS studentName,e.email,e.phone,e.status,e.payment_status AS paymentStatus,e.progress,e.created_at AS createdAt,c.title AS courseTitle FROM enrollments e JOIN courses c ON c.id=e.course_id ORDER BY e.created_at DESC").all();
  return Response.json({courses:courses.results,enrollments:enrollments.results})
}
export async function POST(request:Request){
  if(!await ok())return Response.json({error:"Unauthorized"},{status:401});const b=await request.json()as Record<string,string>;
  if(!b.title||!b.category)return Response.json({error:"Title and category are required."},{status:400});
  const price=Math.round(Number(b.price||0)*100),lessons=Math.max(0,Math.floor(Number(b.lessons||0)));
  if(!Number.isFinite(price)||price<0||!Number.isFinite(lessons))return Response.json({error:"Enter a valid price and lesson count."},{status:400});
  const d=await db();await ensureCourses(d);
  try{await d.prepare("INSERT INTO courses (title,slug,category,level,mode,duration,description,price,lessons,status,image_url,instructor,certificate,show_in_shop,meta_title,meta_keywords,meta_description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .bind(b.title.trim(),slugify(b.slug||b.title),b.category,b.level||"Beginner",b.mode||"Recorded",b.duration||"",b.description||"",price,lessons,b.status==="published"?"published":"draft",b.imageUrl||"",b.instructor||"Attri Academy Faculty",b.certificate==="yes"?1:0,b.showInShop==="yes"?1:0,b.metaTitle?.trim()||b.title.trim(),b.metaKeywords?.trim()||"",b.metaDescription?.trim()||b.description?.trim()||"").run()}
  catch{return Response.json({error:"That course URL slug already exists."},{status:409})}
  return Response.json({success:true},{status:201})
}
export async function PATCH(request:Request){
  if(!await ok())return Response.json({error:"Unauthorized"},{status:401});const b=await request.json()as Record<string,string>&{id?:number};if(!b.id)return Response.json({error:"A record is required."},{status:400});
  const d=await db();
  if(b.kind==="course"){
    await ensureCourses(d);
    if(b.title){
      const price=Math.round(Number(b.price||0)*100),lessons=Math.max(0,Math.floor(Number(b.lessons||0)));
      if(!b.category||!Number.isFinite(price)||price<0||!Number.isFinite(lessons))return Response.json({error:"Enter valid course details."},{status:400});
      try{await d.prepare("UPDATE courses SET title=?,slug=?,category=?,level=?,mode=?,duration=?,description=?,price=?,lessons=?,status=?,image_url=?,instructor=?,certificate=?,show_in_shop=?,meta_title=?,meta_keywords=?,meta_description=? WHERE id=?")
        .bind(b.title.trim(),slugify(b.slug||b.title),b.category,b.level||"Beginner",b.mode||"Recorded",b.duration||"",b.description||"",price,lessons,b.status==="published"?"published":"draft",b.imageUrl||"",b.instructor||"Attri Academy Faculty",b.certificate==="yes"?1:0,b.showInShop==="yes"?1:0,b.metaTitle?.trim()||b.title.trim(),b.metaKeywords?.trim()||"",b.metaDescription?.trim()||b.description?.trim()||"",b.id).run()}
      catch{return Response.json({error:"That course URL slug already exists."},{status:409})}
    }else{
      if(!["published","draft"].includes(b.status??""))return Response.json({error:"Invalid course status."},{status:400});
      await d.prepare("UPDATE courses SET status=? WHERE id=?").bind(b.status,b.id).run();
    }
  }else{
    if(!["pending","confirmed","active","completed","cancelled"].includes(b.status??""))return Response.json({error:"Invalid enrollment status."},{status:400});
    await d.prepare("UPDATE enrollments SET status=? WHERE id=?").bind(b.status,b.id).run();
  }
  return Response.json({success:true})
}
export async function DELETE(request:Request){
  if(!await ok())return Response.json({error:"Unauthorized"},{status:401});const id=Number(new URL(request.url).searchParams.get("id"));if(!id)return Response.json({error:"A course is required."},{status:400});
  const d=await db();await ensureCourses(d);const enrollment=await d.prepare("SELECT id FROM enrollments WHERE course_id=? LIMIT 1").bind(id).first();
  if(enrollment)return Response.json({error:"This course has enrollments. Unpublish it instead of deleting it."},{status:409});
  await d.prepare("DELETE FROM courses WHERE id=?").bind(id).run();return Response.json({success:true})
}
