export async function hasActiveAdministrator() {
  try {
    const database = (await import("cloudflare:workers")).env.DB;
    const account = await database.prepare("SELECT email FROM auth_accounts WHERE account_type='admin' AND status='active' LIMIT 1").first();
    return Boolean(account);
  } catch {
    return false;
  }
}
