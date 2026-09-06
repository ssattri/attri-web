import { authenticateAdmin, createAdminSession, getAdminUser, isAdminPasswordConfigured, setAdminPassword, verifyRecoveryToken } from "../../../admin-auth";

type PasswordRequest = { mode?: "change" | "recovery" | "setup" | "first-login"; currentPassword?: string; recoveryToken?: string; password?: string; confirmPassword?: string };

export async function POST(request: Request) {
  const body = await request.json() as PasswordRequest;
  const mode = body.mode;
  const password = body.password?.trim() || "";
  if (password !== body.confirmPassword) return Response.json({ error: "Passwords do not match." }, { status: 400 });

  let actor = "";
  if (mode === "change" || mode === "first-login") {
    const user = await getAdminUser();
    if (!user || (mode === "first-login" ? !user.requiresPasswordSetup : !await authenticateAdmin(user.email, body.currentPassword || ""))) return Response.json({ error: "Your current password is incorrect." }, { status: 403 });
    actor = user.email;
  } else if (mode === "recovery") {
    if (!await verifyRecoveryToken(body.recoveryToken || "", "reset")) return Response.json({ error: "The recovery token is invalid or has expired." }, { status: 403 });
    actor = "recovery-token";
  } else if (mode === "setup") {
    if (await isAdminPasswordConfigured()) return Response.json({ error: "An administrator password is already configured." }, { status: 409 });
    if (!await verifyRecoveryToken(body.recoveryToken || "", "setup")) return Response.json({ error: "The setup token is invalid or has expired." }, { status: 403 });
    actor = "setup-token";
  } else return Response.json({ error: "Invalid password request." }, { status: 400 });

  try {
    await setAdminPassword(password, actor);
    await createAdminSession(request);
    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|connection|postgres/i.test(message)) {
      return Response.json({ error: "The administrator database is unavailable. Check the production database connection settings and redeploy." }, { status: 503 });
    }
    return Response.json({ error: message || "Unable to update the password." }, { status: 400 });
  }
}
