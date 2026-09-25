type SettingsDatabase = { prepare: (query: string) => { all: <T>() => Promise<{ results: T[] }> } };
export type RazorpayCredentials = { keyId: string; secret: string; webhookSecret: string; source: "env" | "database" | "missing" };

/** Environment credentials are authoritative; database values remain a backwards-compatible fallback. */
export async function getRazorpayCredentials(database: SettingsDatabase): Promise<RazorpayCredentials> {
  const envKeyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  const envSecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
  const envWebhook = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || "";
  if (envKeyId && envSecret) return { keyId: envKeyId, secret: envSecret, webhookSecret: envWebhook, source: "env" };
  const rows = await database.prepare("SELECT setting_key AS key, setting_value AS value FROM site_settings WHERE setting_key IN ('razorpay_key_id','razorpay_key_secret','razorpay_webhook_secret')").all<{ key: string; value: string }>();
  const values = Object.fromEntries(rows.results.map(item => [item.key, item.value]));
  const keyId = envKeyId || String(values.razorpay_key_id || "");
  const secret = envSecret || String(values.razorpay_key_secret || "");
  const webhookSecret = envWebhook || String(values.razorpay_webhook_secret || "");
  return { keyId, secret, webhookSecret, source: keyId && secret ? "database" : "missing" };
}
