import{requireChatGPTUser}from"../../../chatgpt-auth";import ProductEditor from"../ProductEditor";
export const dynamic="force-dynamic";
export default async function AddProduct(){const user=await requireChatGPTUser("/admin/products/new");if(user.email.toLowerCase()!=="attriassociates99@gmail.com")return <main className="admin-denied"><h1>Access restricted</h1><a href="/">Return home</a></main>;return <ProductEditor/>}
