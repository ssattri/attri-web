import {getChatGPTUser} from "../../../chatgpt-auth";
async function db(){return(await import("cloudflare:workers")).env.DB}
async function allowed(){return(await getChatGPTUser())?.email.toLowerCase()==="attriassociates99@gmail.com"}
async function ensureProducts(database:Awaited<ReturnType<typeof db>>){
  await database.prepare(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',price INTEGER NOT NULL,stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
  const columns=await database.prepare("PRAGMA table_info(products)").all<{name:string}>();
  if(!columns.results.some(x=>x.name==="image_url"))await database.prepare("ALTER TABLE products ADD COLUMN image_url TEXT NOT NULL DEFAULT ''").run();
}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)}
export async function GET(){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const database=await db();
  await ensureProducts(database);
  const orders=await database.prepare("SELECT id,reference,customer_name AS customerName,phone,items_json AS itemsJson,subtotal,status,payment_status AS paymentStatus,created_at AS createdAt FROM orders ORDER BY created_at DESC LIMIT 200").all();
  const products=await database.prepare("SELECT id,name,slug,category,description,price,stock,status,image_url AS imageUrl,created_at AS createdAt FROM products ORDER BY id DESC").all();
  return Response.json({orders:orders.results,products:products.results});
}
export async function POST(request:Request){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {name?:string;slug?:string;category?:string;description?:string;price?:string|number;stock?:string|number;status?:string;imageUrl?:string};
  const name=body.name?.trim()??"",slug=slugify(body.slug?.trim()||name),category=body.category?.trim()??"";
  const price=Math.round(Number(body.price)*100),stock=Math.max(0,Math.floor(Number(body.stock)));
  if(!name||!slug||!category||!Number.isFinite(price)||price<0||!Number.isFinite(stock))return Response.json({error:"Complete the product name, category, valid price and stock."},{status:400});
  const status=body.status==="draft"?"draft":"active";const database=await db();await ensureProducts(database);
  try{
    const result=await database.prepare("INSERT INTO products (name,slug,category,description,price,stock,status,image_url) VALUES (?,?,?,?,?,?,?,?)")
      .bind(name,slug,category,body.description?.trim()??"",price,stock,status,body.imageUrl?.trim()??"").run();
    return Response.json({success:true,id:result.meta.last_row_id},{status:201});
  }catch{return Response.json({error:"That product URL slug already exists. Please use a different slug."},{status:409})}
}
export async function PATCH(request:Request){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:number;kind?:string;status?:string;name?:string;slug?:string;category?:string;description?:string;price?:string|number;stock?:string|number;imageUrl?:string};
  if(!body.id)return Response.json({error:"A record is required."},{status:400});
  const database=await db();
  if(body.kind==="product"){
    await ensureProducts(database);
    if(body.name){
      const price=Math.round(Number(body.price)*100),stock=Math.max(0,Math.floor(Number(body.stock)));
      if(!body.category||!Number.isFinite(price)||price<0||!Number.isFinite(stock))return Response.json({error:"Enter a valid category, price and stock."},{status:400});
      try{await database.prepare("UPDATE products SET name=?,slug=?,category=?,description=?,price=?,stock=?,status=?,image_url=? WHERE id=?")
        .bind(body.name.trim(),slugify(body.slug||body.name),body.category.trim(),body.description?.trim()??"",price,stock,body.status==="draft"?"draft":"active",body.imageUrl?.trim()??"",body.id).run()}
      catch{return Response.json({error:"That product URL slug already exists."},{status:409})}
    }else{
      if(!["active","draft"].includes(body.status??""))return Response.json({error:"Invalid product status."},{status:400});
      await database.prepare("UPDATE products SET status=? WHERE id=?").bind(body.status,body.id).run();
    }
  }else{
    if(!["pending","confirmed","processing","shipped","completed","cancelled"].includes(body.status??""))return Response.json({error:"Invalid order status"},{status:400});
    await database.prepare("UPDATE orders SET status=? WHERE id=?").bind(body.status,body.id).run();
  }
  return Response.json({success:true});
}
export async function DELETE(request:Request){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const id=Number(new URL(request.url).searchParams.get("id"));
  if(!id)return Response.json({error:"A product is required."},{status:400});
  const database=await db();await ensureProducts(database);await database.prepare("DELETE FROM products WHERE id=?").bind(id).run();
  return Response.json({success:true});
}
