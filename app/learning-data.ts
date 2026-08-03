export async function learningDb() {
  const db = (await import("cloudflare:workers")).env.DB;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS course_sections (id INTEGER PRIMARY KEY AUTOINCREMENT,course_id INTEGER NOT NULL,title TEXT NOT NULL,sort_order INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS course_lessons (id INTEGER PRIMARY KEY AUTOINCREMENT,course_id INTEGER NOT NULL,section_id INTEGER NOT NULL,title TEXT NOT NULL,lesson_type TEXT NOT NULL DEFAULT 'video',video_url TEXT NOT NULL DEFAULT '',content TEXT NOT NULL DEFAULT '',duration_minutes INTEGER NOT NULL DEFAULT 0,is_preview INTEGER NOT NULL DEFAULT 0,sort_order INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'published',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS lesson_progress (id INTEGER PRIMARY KEY AUTOINCREMENT,enrollment_id INTEGER NOT NULL,lesson_id INTEGER NOT NULL,completed INTEGER NOT NULL DEFAULT 0,completed_at TEXT NOT NULL DEFAULT '',updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_unique ON lesson_progress(enrollment_id,lesson_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS course_sections_course_idx ON course_sections(course_id,sort_order)"),
    db.prepare("CREATE INDEX IF NOT EXISTS course_lessons_course_idx ON course_lessons(course_id,section_id,sort_order)"),
  ]);
  return db;
}
