import { redirect } from "next/navigation";
export default async function Onboarding({ searchParams }: { searchParams: Promise<{ role?: string }> }) { const { role } = await searchParams; redirect(`/client/login?mode=register&role=${role === "consultant" ? "consultant" : "user"}`); }
