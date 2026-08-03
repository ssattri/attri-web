import { getPortalUser } from "../../auth";
import { learningDb } from "../../learning-data";

export async function GET(request: Request) {
  const user = await getPortalUser();
  if (!user || user.accountType !== "user") return Response.json({ error: "User sign-in required." }, { status: 401 });
  const db = await learningDb(); const courseId = Number(new URL(request.url).searchParams.get("courseId") || 0);
  const enrollments = await db.prepare("SELECT e.id,e.reference,e.course_id AS courseId,e.status,e.payment_status AS paymentStatus,e.progress,c.title,c.slug,c.description,c.image_url AS imageUrl,c.instructor,c.duration,c.certificate FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE lower(e.email)=? AND e.status IN ('active','completed') ORDER BY e.created_at DESC").bind(user.email.toLowerCase()).all();
  if (!courseId) return Response.json({ enrollments: enrollments.results });
  const enrollment = enrollments.results.find(row => Number((row as Record<string,unknown>).courseId) === courseId);
  if (!enrollment) return Response.json({ error: "An active enrollment is required." }, { status: 403 });
  const sections = await db.prepare("SELECT id,title,sort_order AS sortOrder FROM course_sections WHERE course_id=? ORDER BY sort_order,id").bind(courseId).all();
  const lessons = await db.prepare("SELECT l.id,l.section_id AS sectionId,l.title,l.lesson_type AS lessonType,l.video_url AS videoUrl,l.content,l.duration_minutes AS durationMinutes,l.sort_order AS sortOrder,COALESCE(p.completed,0) AS completed FROM course_lessons l LEFT JOIN lesson_progress p ON p.lesson_id=l.id AND p.enrollment_id=? WHERE l.course_id=? AND l.status='published' ORDER BY l.sort_order,l.id").bind(Number((enrollment as Record<string,unknown>).id),courseId).all();
  return Response.json({ enrollment, sections: sections.results, lessons: lessons.results });
}

export async function POST(request: Request) {
  const origin=request.headers.get("origin"); if(origin&&origin!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  const user = await getPortalUser(); if (!user || user.accountType !== "user") return Response.json({ error: "User sign-in required." }, { status: 401 });
  const body = await request.json() as { lessonId?: number; completed?: boolean }; if (!body.lessonId) return Response.json({ error: "Lesson required." }, { status: 400 });
  const db = await learningDb();
  const access = await db.prepare("SELECT e.id AS enrollmentId,e.course_id AS courseId,e.student_name AS studentName,c.title AS courseTitle,c.certificate FROM enrollments e JOIN course_lessons l ON l.course_id=e.course_id JOIN courses c ON c.id=e.course_id WHERE l.id=? AND lower(e.email)=? AND e.status IN ('active','completed') LIMIT 1").bind(body.lessonId,user.email.toLowerCase()).first<{enrollmentId:number;courseId:number;studentName:string;courseTitle:string;certificate:number}>();
  if (!access) return Response.json({ error: "Course access denied." }, { status: 403 });
  await db.prepare("INSERT INTO lesson_progress (enrollment_id,lesson_id,completed,completed_at) VALUES (?,?,?,CASE WHEN ?=1 THEN CURRENT_TIMESTAMP ELSE '' END) ON CONFLICT(enrollment_id,lesson_id) DO UPDATE SET completed=excluded.completed,completed_at=excluded.completed_at,updated_at=CURRENT_TIMESTAMP").bind(access.enrollmentId,body.lessonId,body.completed?1:0,body.completed?1:0).run();
  const totals=await db.prepare("SELECT COUNT(*) AS total,SUM(CASE WHEN COALESCE(p.completed,0)=1 THEN 1 ELSE 0 END) AS done FROM course_lessons l LEFT JOIN lesson_progress p ON p.lesson_id=l.id AND p.enrollment_id=? WHERE l.course_id=? AND l.status='published'").bind(access.enrollmentId,access.courseId).first<{total:number;done:number}>();
  const progress=totals?.total?Math.round(((totals.done||0)/totals.total)*100):0;
  await db.prepare("UPDATE enrollments SET progress=?,status=CASE WHEN ?=100 THEN 'completed' ELSE 'active' END WHERE id=?").bind(progress,progress,access.enrollmentId).run();
  if(progress===100&&access.certificate){const exists=await db.prepare("SELECT id FROM certificates WHERE lower(student_email)=? AND course_title=? AND status='issued' LIMIT 1").bind(user.email.toLowerCase(),access.courseTitle).first();if(!exists){const reference=`CERT-${Date.now().toString(36).toUpperCase()}`;await db.prepare("INSERT INTO certificates (reference,student_name,student_email,course_title,issued_date,status) VALUES (?,?,?,?,date('now'),'issued')").bind(reference,access.studentName,user.email,access.courseTitle).run();}}
  return Response.json({ success:true,progress });
}
