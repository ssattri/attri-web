import{requireRegisteredAccount}from"../auth";import ClientPortal from"./ClientPortal";
export const dynamic="force-dynamic";export default async function ClientPage(){await requireRegisteredAccount("/client","user");return <><ClientPortal/><div className="portal-floating-actions"><a href="/client/invoices">Invoices</a><a href="/client/feedback">Reviews & support</a></div></>}
