import{notFound}from"next/navigation";import{requireAdmin}from"../../../../auth";import CourseEditor from"../../CourseEditor";
export const dynamic="force-dynamic";
export default async function EditCourse({params}:{params:Promise<{id:string}>}){const{id}=await params;const courseId=Number(id);if(!Number.isInteger(courseId)||courseId<1)notFound();await requireAdmin(`/admin/courses/${id}/edit`);return <CourseEditor id={courseId}/>}
