import { requirePortalUser } from "../../auth";
import SecurityClient from "./SecurityClient";
export const dynamic = "force-dynamic";
export default async function SecurityPage() { await requirePortalUser("/account/security"); return <SecurityClient />; }
