import { getAdminUser } from "../../../admin-auth";
import { env as runtimeEnv } from "@server";

async function authorize() {
  return await getAdminUser();
}

function getDatabase() {
  return runtimeEnv.DB;
}

async function ensureSchema() {
  const db = await getDatabase();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS cms_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'draft',
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      seo_title TEXT NOT NULL DEFAULT '',
      seo_description TEXT NOT NULL DEFAULT '',
      author_email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS cms_pages_status_idx ON cms_pages (status)"),
  ]);
  const columns = await db.prepare("PRAGMA table_info(cms_pages)").all<{name:string}>();
  if (!columns.results.some(column => column.name === "seo_keywords")) await db.prepare("ALTER TABLE cms_pages ADD COLUMN seo_keywords TEXT NOT NULL DEFAULT ''").run();
}

export async function GET() {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await ensureSchema();
  const db = await getDatabase();
  const rows = await db.prepare(
      "SELECT id, title, slug, status, excerpt, content, seo_title AS seoTitle, seo_keywords AS seoKeywords, seo_description AS seoDescription, updated_at AS updatedAt FROM cms_pages ORDER BY updated_at DESC LIMIT 100",
  ).all();
  return Response.json({ pages: rows.results });
}

export async function POST(request: Request) {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { title?: string; slug?: string; excerpt?: string; seoTitle?: string; seoKeywords?: string; seoDescription?: string };
  const title = body.title?.trim();
  const slug = body.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  if (!title || !slug) return Response.json({ error: "Title and slug are required" }, { status: 400 });
  await ensureSchema();
  const db = await getDatabase();
  try {
    const result = await db.prepare(
      "INSERT INTO cms_pages (title, slug, excerpt, seo_title, seo_keywords, seo_description, author_email) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(title, slug, body.excerpt?.trim() ?? "", body.seoTitle?.trim() || title, body.seoKeywords?.trim() || "", body.seoDescription?.trim() || body.excerpt?.trim() || "", user.email).run();
    return Response.json({ id: result.meta.last_row_id, title, slug, status: "draft" }, { status: 201 });
  } catch {
    return Response.json({ error: "A page with this slug already exists" }, { status: 409 });
  }
}

export async function PATCH(request: Request) {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { id?: number; status?: string; title?: string; slug?: string; excerpt?: string; content?: string; seoTitle?: string; seoKeywords?: string; seoDescription?: string };
  if (!body.id) return Response.json({ error: "A page is required" }, { status: 400 });
  await ensureSchema();
  const db = await getDatabase();
  if (body.title?.trim()) { const slug = (body.slug?.trim() || body.title).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""); await db.prepare("UPDATE cms_pages SET title=?,slug=?,excerpt=?,content=?,seo_title=?,seo_keywords=?,seo_description=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(body.title.trim(),slug,body.excerpt?.trim()||"",body.content||"",body.seoTitle?.trim()||body.title.trim(),body.seoKeywords?.trim()||"",body.seoDescription?.trim()||body.excerpt?.trim()||"",["draft","published","archived"].includes(body.status||"")?body.status:"draft",body.id).run(); }
  else if (["draft", "published", "archived"].includes(body.status ?? "")) await db.prepare("UPDATE cms_pages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(body.status, body.id).run();
  else return Response.json({ error: "Valid page fields are required" }, { status: 400 });
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return Response.json({ error: "Page id is required" }, { status: 400 });
  await ensureSchema();
  const db = await getDatabase();
  await db.prepare("DELETE FROM cms_pages WHERE id = ?").bind(id).run();
  return Response.json({ success: true });
}
