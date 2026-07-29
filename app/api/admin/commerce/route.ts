import {getChatGPTUser} from "../../../chatgpt-auth";
async function db(){return(await import("cloudflare:workers")).env.DB}
async function allowed(){return(await getChatGPTUser())?.email.toLowerCase()==="attriassociates99@gmail.com"}
export async function GET(){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const database=await db();
  const orders=await database.prepare("SELECT id,reference,customer_name AS customerName,phone,items_json AS itemsJson,subtotal,status,payment_status AS paymentStatus,created_at AS createdAt FROM orders ORDER BY created_at DESC LIMIT 200").all();
  const products=await database.prepare("SELECT id,name,category,price,stock,status FROM products ORDER BY id DESC").all();
  return Response.json({orders:orders.results,products:products.results});
}
export async function PATCH(request:Request){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:number,status?:string};
  if(!body.id||!["pending","confirmed","processing","shipped","completed","cancelled"].includes(body.status??""))return Response.json({error:"Invalid order status"},{status:400});
  const database=await db();await database.prepare("UPDATE orders SET status=? WHERE id=?").bind(body.status,body.id).run();
  return Response.json({success:true});
}
