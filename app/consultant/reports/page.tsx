import{requireRegisteredAccount}from"../../chatgpt-auth";import ReportStudio from"./ReportStudio";
export const dynamic="force-dynamic";
export default async function ReportsPage(){const u=await requireRegisteredAccount("/consultant/reports","consultant");return <ReportStudio consultantName={u.fullName||u.displayName}/>}
