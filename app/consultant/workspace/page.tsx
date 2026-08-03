import{requireRegisteredAccount}from"../../chatgpt-auth";import CompassWorkspace from"./CompassWorkspace";
export const dynamic="force-dynamic";
export default async function WorkspacePage(){await requireRegisteredAccount("/consultant/workspace","consultant");return <CompassWorkspace/>}
