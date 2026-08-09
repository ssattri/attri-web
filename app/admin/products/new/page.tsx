import{requireAdminUser}from"../../../admin-auth";import ProductEditor from"../ProductEditor";
export const dynamic="force-dynamic";
export default async function AddProduct(){await requireAdminUser("/admin/products/new");return <ProductEditor/>}
