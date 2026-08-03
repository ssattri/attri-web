import{requirePortalUser}from"../../../auth";import ProductEditor from"../ProductEditor";
export const dynamic="force-dynamic";
export default async function AddProduct(){const user=await requirePortalUser("/admin/products/new");if(user.email.toLowerCase()!=="attriassociates99@gmail.com")return <main className="admin-denied"><h1>Access restricted</h1><a href="/">Return home</a></main>;return <ProductEditor/>}
