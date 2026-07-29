import { getChatGPTUser } from "../../../chatgpt-auth";

const OWNER_EMAILS = new Set(["attriassociates99@gmail.com"]);

async function authorize() {
  const user = await getChatGPTUser();
  return user && OWNER_EMAILS.has(user.email.toLowerCase()) ? user : null;
}

async function getDatabase() {
  const runtime = await import("cloudflare:workers");
  return runtime.env.DB;
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
}

export async function GET() {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await ensureSchema();
  const db = await getDatabase();
  const rows = await db.prepare(
    "SELECT id, title, slug, status, excerpt, updated_at AS updatedAt FROM cms_pages ORDER BY updated_at DESC LIMIT 100",
  ).all();
  return Response.json({ pages: rows.results });
}

export async function POST(request: Request) {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { title?: string; slug?: string; excerpt?: string };
  const title = body.title?.trim();
  const slug = body.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  if (!title || !slug) return Response.json({ error: "Title and slug are required" }, { status: 400 });
  await ensureSchema();
  const db = await getDatabase();
  try {
    const result = await db.prepare(
      "INSERT INTO cms_pages (title, slug, excerpt, author_email) VALUES (?, ?, ?, ?)",
    ).bind(title, slug, body.excerpt?.trim() ?? "", user.email).run();
    return Response.json({ id: result.meta.last_row_id, title, slug, status: "draft" }, { status: 201 });
  } catch {
    return Response.json({ error: "A page with this slug already exists" }, { status: 409 });
  }
}

export async function PATCH(request: Request) {
  const user = await authorize();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { id?: number; status?: string };
  if (!body.id || !["draft", "published", "archived"].includes(body.status ?? "")) {
    return Response.json({ error: "Valid page and status are required" }, { status: 400 });
  }
  await ensureSchema();
  const db = await getDatabase();
  await db.prepare("UPDATE cms_pages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.status, body.id).run();
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
