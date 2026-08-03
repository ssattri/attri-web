import{requireAdmin}from"../../../auth";import ProductEditor from"../ProductEditor";
export const dynamic="force-dynamic";
export default async function AddProduct(){await requireAdmin("/admin/products/new");return <ProductEditor/>}
