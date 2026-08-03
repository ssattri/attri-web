import{requirePortalUser}from"../../../auth";import CourseEditor from"../CourseEditor";
export const dynamic="force-dynamic";
export default async function AddCourse(){const user=await requirePortalUser("/admin/courses/new");if(user.email.toLowerCase()!=="attriassociates99@gmail.com")return <main className="admin-denied"><h1>Access restricted</h1><a href="/">Return home</a></main>;return <CourseEditor/>}
