import{requireRegisteredAccount}from"../auth";import ClientPortal from"./ClientPortal";
export const dynamic="force-dynamic";export default async function ClientPage(){await requireRegisteredAccount("/client","user");return <><ClientPortal/><a className="portal-feedback-launch" href="/client/feedback">Reviews & support</a></>}
