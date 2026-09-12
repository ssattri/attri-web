import { getAdminUser } from "../../../admin-auth";
import { env } from "@server";

const businessKeys = ["business_name", "business_legal_name", "business_phone", "business_email", "business_address", "business_city", "business_state", "business_pincode", "business_country", "business_gstin", "business_hours", "business_currency"] as const;
const razorpayKeys = ["razorpay_key_id", "razorpay_key_secret", "razorpay_webhook_secret"] as const;
const permissionKeys = ["dashboard", "crm", "projects", "appointments", "commerce", "courses", "finance", "reports", "content", "files", "analytics", "settings"] as const;
type Permission = typeof permissionKeys[number];

async function owner() { return Boolean(await getAdminUser()); }
async function ensureTables() {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY AUTOINCREMENT,setting_key TEXT NOT NULL UNIQUE,setting_value TEXT NOT NULL DEFAULT '',value_type TEXT NOT NULL DEFAULT 'text',is_public INTEGER NOT NULL DEFAULT 0,updated_by TEXT NOT NULL DEFAULT '',updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS staff_members (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT NOT NULL UNIQUE,full_name TEXT NOT NULL,phone TEXT NOT NULL DEFAULT '',role TEXT NOT NULL,department TEXT NOT NULL,permissions_json TEXT NOT NULL DEFAULT '[]',status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)")
  ]);
}
function masked(value: string) { return value ? `••••••••${value.slice(-4)}` : ""; }

export async function GET() {
  if (!await owner()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTables();
  const keys = [...businessKeys, ...razorpayKeys];
  const settings = await env.DB.prepare(`SELECT setting_key AS key, setting_value AS value FROM site_settings WHERE setting_key IN (${keys.map(() => "?").join(",")})`).bind(...keys).all<{ key: string; value: string }>();
  const values = Object.fromEntries(settings.results.filter(item => !razorpayKeys.includes(item.key as typeof razorpayKeys[number])).map(item => [item.key, item.value]));
  const secretValues = Object.fromEntries(settings.results.filter(item => razorpayKeys.includes(item.key as typeof razorpayKeys[number])).map(item => [item.key, masked(item.value)]));
  const staff = await env.DB.prepare("SELECT id,email,full_name AS fullName,phone,role,department,permissions_json AS permissionsJson,status FROM staff_members ORDER BY full_name").all();
  return Response.json({ business: values, razorpay: secretValues, staff: staff.results, permissions: permissionKeys });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTables();
  const body = await request.json() as { kind?: string; values?: Record<string, string>; member?: { id?: number; fullName?: string; email?: string; phone?: string; role?: string; department?: string; status?: string; permissions?: Permission[] } };
  if (body.kind === "business" || body.kind === "razorpay") {
    const allowed = body.kind === "business" ? businessKeys : razorpayKeys;
    const entries = Object.entries(body.values || {}).filter(([key, value]) => allowed.includes(key as never) && typeof value === "string" && (body.kind === "business" || value.trim() !== ""));
    if (entries.length) await env.DB.batch(entries.map(([key, value]) => env.DB.prepare("INSERT INTO site_settings(setting_key,setting_value,value_type,is_public,updated_by,updated_at) VALUES (?,?,'secret',0,?,CURRENT_TIMESTAMP) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,value_type='secret',is_public=0,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP").bind(key, value.trim(), user.email)));
    await env.DB.prepare("INSERT INTO audit_logs(actor_email,action,entity_type,details_json) VALUES (?,?,?,?)").bind(user.email, "updated", body.kind === "business" ? "business_settings" : "razorpay_settings", JSON.stringify({ keys: entries.map(([key]) => key) })).run();
    return Response.json({ success: true });
  }
  if (body.kind === "member") {
    const member = body.member;
    if (!member?.fullName?.trim() || !member.email?.trim() || !member.role?.trim()) return Response.json({ error: "Name, email, and role are required." }, { status: 400 });
    const permissions = Array.isArray(member.permissions) ? member.permissions.filter((item): item is Permission => permissionKeys.includes(item as Permission)) : [];
    const status = member.status === "inactive" ? "inactive" : "active";
    if (member.id) await env.DB.prepare("UPDATE staff_members SET email=?,full_name=?,phone=?,role=?,department=?,permissions_json=?,status=? WHERE id=?").bind(member.email.trim().toLowerCase(), member.fullName.trim(), member.phone?.trim() || "", member.role.trim(), member.department?.trim() || "Administration", JSON.stringify(permissions), status, member.id).run();
    else await env.DB.prepare("INSERT INTO staff_members(email,full_name,phone,role,department,permissions_json,status) VALUES (?,?,?,?,?,?,?)").bind(member.email.trim().toLowerCase(), member.fullName.trim(), member.phone?.trim() || "", member.role.trim(), member.department?.trim() || "Administration", JSON.stringify(permissions), status).run();
    await env.DB.prepare("INSERT INTO audit_logs(actor_email,action,entity_type,details_json) VALUES (?,?,?,?)").bind(user.email, "saved", "admin_access_roster", JSON.stringify({ email: member.email.trim().toLowerCase(), role: member.role, permissions })).run();
    return Response.json({ success: true });
  }
  return Response.json({ error: "Invalid settings request." }, { status: 400 });
}
