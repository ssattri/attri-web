import { requirePortalUser } from "../../auth";
import LearningPlayer from "./LearningPlayer";
export const dynamic="force-dynamic";
export default async function CourseLearningPage({params}:{params:Promise<{courseId:string}>}){const user=await requirePortalUser(`/learning/${(await params).courseId}`);if(user.accountType!=="user")return null;return <LearningPlayer courseId={Number((await params).courseId)}/>}
