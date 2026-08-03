import { requirePortalUser } from "../auth";
import LearningDashboard from "./LearningDashboard";
export const dynamic="force-dynamic";
export default async function LearningPage(){const user=await requirePortalUser("/learning");if(user.accountType!=="user")return <main className="admin-denied"><h1>User account required</h1><p>Courses and learning progress are available through a User account.</p><a href="/consultant">Return to consultant dashboard</a></main>;return <LearningDashboard name={user.fullName||user.displayName}/>}
