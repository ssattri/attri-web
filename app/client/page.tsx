import{requireRegisteredAccount}from"../chatgpt-auth";import ClientPortal from"./ClientPortal";
export const dynamic="force-dynamic";export default async function ClientPage(){await requireRegisteredAccount("/client","user");return <ClientPortal/>}
