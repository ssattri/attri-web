import{requireAdminUser}from"../../../admin-auth";import CourseEditor from"../CourseEditor";
export const dynamic="force-dynamic";
export default async function AddCourse(){await requireAdminUser("/admin/courses/new");return <CourseEditor/>}
