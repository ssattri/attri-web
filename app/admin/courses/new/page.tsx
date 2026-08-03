import{requireAdmin}from"../../../auth";import CourseEditor from"../CourseEditor";
export const dynamic="force-dynamic";
export default async function AddCourse(){await requireAdmin("/admin/courses/new");return <CourseEditor/>}
