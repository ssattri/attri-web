import{notFound}from"next/navigation";import{requireAdminUser}from"../../../../admin-auth";import ProductEditor from"../../ProductEditor";
export const dynamic="force-dynamic";
export default async function EditProduct({params}:{params:Promise<{id:string}>}){const{id}=await params;const productId=Number(id);if(!Number.isInteger(productId)||productId<1)notFound();await requireAdminUser(`/admin/products/${id}/edit`);return <ProductEditor id={productId}/>}
