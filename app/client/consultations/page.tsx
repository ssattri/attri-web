import Link from "next/link";
import { requireRegisteredAccount } from "../../chatgpt-auth";
import ConsultationActions from "../ConsultationActions";

export const dynamic = "force-dynamic";

export default async function ClientConsultations() {
  await requireRegisteredAccount("/client/consultations", "user");
  return <main className="portal-shell"><section className="consultation-actions-page"><header><div><p>CLIENT WORKSPACE / CONSULTATIONS</p><h1>Manage your bookings</h1></div><Link href="/client">← Back to portal</Link></header><ConsultationActions/></section></main>;
}
