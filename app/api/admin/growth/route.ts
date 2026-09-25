import { getAdminUser } from "../../../admin-auth";
import { env as runtimeEnv } from "@server";

async function allowed() { return Boolean(await getAdminUser()); }
export async function GET() {
  if (!await allowed()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const d = runtimeEnv.DB;
  const [leads, appointments, orders, revenue, students, notifications, settings] = await Promise.all([
    d.prepare("SELECT COUNT(*) AS total,SUM(CASE WHEN status='won' THEN 1 ELSE 0 END) AS converted FROM leads").first(),
    d.prepare("SELECT COUNT(*) AS total,SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed FROM appointments").first(),
    d.prepare("SELECT COUNT(*) AS total,SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed FROM orders").first(),
    d.prepare("SELECT COALESCE(SUM(amount),0) AS total FROM payment_records WHERE status='successful'").first(),
    d.prepare("SELECT COUNT(*) AS total,SUM(CASE WHEN status IN ('active','completed') THEN 1 ELSE 0 END) AS active FROM enrollments").first(),
    d.prepare("SELECT id,recipient_email AS recipientEmail,channel,subject,status,scheduled_at AS scheduledAt FROM notifications ORDER BY created_at DESC LIMIT 30").all(),
    d.prepare("SELECT setting_key AS settingKey,setting_value AS settingValue FROM site_settings WHERE setting_key LIKE 'seo_%' OR setting_key LIKE 'tracking_%'").all()
  ]);
  const seo = Object.fromEntries((settings.results as Array<{ settingKey: string; settingValue: string }>).map(item => [item.settingKey, item.settingValue]));
  return Response.json({ metrics: { leads, appointments, orders, revenue, students }, notifications: notifications.results, seo, gateways: { razorpay: Boolean((runtimeEnv as Record<string, unknown>).RAZORPAY_KEY_ID), stripe: Boolean((runtimeEnv as Record<string, unknown>).STRIPE_SECRET_KEY), paypal: Boolean((runtimeEnv as Record<string, unknown>).PAYPAL_CLIENT_ID) } });
}
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as Record<string, string>;
  const d = runtimeEnv.DB;
  if (body.kind === "notification") {
    if (!body.recipientEmail || !body.subject || !body.message) return Response.json({ error: "Complete notification fields." }, { status: 400 });
    await d.prepare("INSERT INTO notifications (recipient_email,channel,subject,message,status,scheduled_at) VALUES (?,?,?,?,?,?)").bind(body.recipientEmail.toLowerCase(), body.channel || "email", body.subject, body.message, "queued", body.scheduledAt || new Date().toISOString()).run();
    await d.prepare("INSERT INTO audit_logs (actor_email,action,entity_type) VALUES (?,?,?)").bind(user.email, "queued", "notification").run();
    return Response.json({ success: true }, { status: 201 });
  }
  if (body.kind === "seo") {
    const entries = [["seo_default_title", body.defaultTitle || ""], ["seo_default_keywords", body.defaultKeywords || ""], ["seo_default_description", body.defaultDescription || ""], ["seo_google_verification", body.googleVerification || ""], ["tracking_ga4_id", body.ga4Id || ""], ["tracking_meta_pixel_id", body.metaPixelId || ""], ["tracking_linkedin_id", body.linkedinId || ""]];
    await d.batch(entries.map(([key, value]) => d.prepare("INSERT INTO site_settings (setting_key,setting_value,value_type,is_public,updated_by) VALUES (?,?,?,0,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value,updated_by=excluded.updated_by,updated_at=CURRENT_TIMESTAMP").bind(key, value, "text", user.email)));
    return Response.json({ success: true });
  }
  return Response.json({ error: "Invalid request." }, { status: 400 });
}
