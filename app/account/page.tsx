import{requireRegisteredAccount}from"../chatgpt-auth";import{redirect}from"next/navigation";
export const dynamic="force-dynamic";export default async function AccountRouter(){const account=await requireRegisteredAccount("/account");redirect(account.accountType==="consultant"?"/consultant":"/client")}
