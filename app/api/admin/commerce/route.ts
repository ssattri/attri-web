import {getChatGPTUser} from "../../../chatgpt-auth";
async function db(){return(await import("cloudflare:workers")).env.DB}
async function allowed(){return(await getChatGPTUser())?.email.toLowerCase()==="attriassociates99@gmail.com"}
async function ensureProducts(database:Awaited<ReturnType<typeof db>>){
  await database.prepare(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',price INTEGER NOT NULL,stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
  const columns=await database.prepare("PRAGMA table_info(products)").all<{name:string}>();
  for(const [name,sql] of [
    ["image_url","ALTER TABLE products ADD COLUMN image_url TEXT NOT NULL DEFAULT ''"],
    ["item_type","ALTER TABLE products ADD COLUMN item_type TEXT NOT NULL DEFAULT 'physical'"],
    ["delivery_mode","ALTER TABLE products ADD COLUMN delivery_mode TEXT NOT NULL DEFAULT 'Online'"],
    ["special_price","ALTER TABLE products ADD COLUMN special_price INTEGER NOT NULL DEFAULT 0"],
    ["special_from","ALTER TABLE products ADD COLUMN special_from TEXT NOT NULL DEFAULT ''"],
    ["special_to","ALTER TABLE products ADD COLUMN special_to TEXT NOT NULL DEFAULT ''"],
    ["duration","ALTER TABLE products ADD COLUMN duration TEXT NOT NULL DEFAULT ''"],
    ["classes","ALTER TABLE products ADD COLUMN classes INTEGER NOT NULL DEFAULT 0"],
    ["sort_order","ALTER TABLE products ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0"]
  ])if(!columns.results.some(x=>x.name===name))await database.prepare(sql).run();
}
function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)}
export async function GET(){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const database=await db();
  await ensureProducts(database);
  const orders=await database.prepare("SELECT id,reference,customer_name AS customerName,phone,items_json AS itemsJson,subtotal,status,payment_status AS paymentStatus,created_at AS createdAt FROM orders ORDER BY created_at DESC LIMIT 200").all();
  const products=await database.prepare("SELECT id,name,slug,category,description,price,stock,status,image_url AS imageUrl,item_type AS itemType,delivery_mode AS deliveryMode,special_price AS specialPrice,special_from AS specialFrom,special_to AS specialTo,duration,classes,sort_order AS sortOrder,created_at AS createdAt FROM products ORDER BY sort_order,id DESC").all();
  return Response.json({orders:orders.results,products:products.results});
}
export async function POST(request:Request){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {name?:string;slug?:string;category?:string;description?:string;price?:string|number;stock?:string|number;status?:string;imageUrl?:string;itemType?:string;deliveryMode?:string;specialPrice?:string|number;specialFrom?:string;specialTo?:string;duration?:string;classes?:string|number;sortOrder?:string|number};
  const name=body.name?.trim()??"",slug=slugify(body.slug?.trim()||name),category=body.category?.trim()??"";
  const price=Math.round(Number(body.price)*100),specialPrice=Math.round(Number(body.specialPrice||0)*100),stock=Math.max(0,Math.floor(Number(body.stock))),classes=Math.max(0,Math.floor(Number(body.classes||0))),sortOrder=Math.floor(Number(body.sortOrder||0));
  if(!name||!slug||!category||!Number.isFinite(price)||price<0||!Number.isFinite(specialPrice)||specialPrice<0||!Number.isFinite(stock)||!Number.isFinite(classes)||!Number.isFinite(sortOrder))return Response.json({error:"Complete the product name, category, valid pricing, stock and order."},{status:400});
  if(specialPrice>0&&specialPrice>=price)return Response.json({error:"Special price must be lower than the regular price."},{status:400});
  const status=body.status==="draft"?"draft":"active";const database=await db();await ensureProducts(database);
  try{
    const result=await database.prepare("INSERT INTO products (name,slug,category,description,price,stock,status,image_url,item_type,delivery_mode,special_price,special_from,special_to,duration,classes,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
      .bind(name,slug,category,body.description?.trim()??"",price,stock,status,body.imageUrl?.trim()??"",["physical","digital","course","service"].includes(body.itemType??"")?body.itemType:"physical",body.deliveryMode==="Offline"?"Offline":body.deliveryMode==="Online + Offline"?"Online + Offline":"Online",specialPrice,body.specialFrom||"",body.specialTo||"",body.itemType==="course"?body.duration||"":"",body.itemType==="course"?classes:0,sortOrder).run();
    return Response.json({success:true,id:result.meta.last_row_id},{status:201});
  }catch{return Response.json({error:"That product URL slug already exists. Please use a different slug."},{status:409})}
}
export async function PATCH(request:Request){
  if(!await allowed())return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:number;kind?:string;status?:string;name?:string;slug?:string;category?:string;description?:string;price?:string|number;stock?:string|number;imageUrl?:string;itemType?:string;deliveryMode?:string;specialPrice?:string|number;specialFrom?:string;specialTo?:string;duration?:string;classes?:string|number;sortOrder?:string|number};
  if(!body.id)return Response.json({error:"A record is required."},{status:400});
  const database=await db();
  if(body.kind==="product"){
    await ensureProducts(database);
    if(body.name){
      const price=Math.round(Number(body.price)*100),specialPrice=Math.round(Number(body.specialPrice||0)*100),stock=Math.max(0,Math.floor(Number(body.stock))),classes=Math.max(0,Math.floor(Number(body.classes||0))),sortOrder=Math.floor(Number(body.sortOrder||0));
      if(!body.category||!Number.isFinite(price)||price<0||!Number.isFinite(specialPrice)||specialPrice<0||!Number.isFinite(stock)||!Number.isFinite(classes)||!Number.isFinite(sortOrder))return Response.json({error:"Enter valid product pricing, stock and order."},{status:400});
      if(specialPrice>0&&specialPrice>=price)return Response.json({error:"Special price must be lower than the regular price."},{status:400});
      const itemType=["physical","digital","course","service"].includes(body.itemType??"")?body.itemType:"physical";
      try{await database.prepare("UPDATE products SET name=?,slug=?,category=?,description=?,price=?,stock=?,status=?,image_url=?,item_type=?,delivery_mode=?,special_price=?,special_from=?,special_to=?,duration=?,classes=?,sort_order=? WHERE id=?")
        .bind(body.name.trim(),slugify(body.slug||body.name),body.category.trim(),body.description?.trim()??"",price,stock,body.status==="draft"?"draft":"active",body.imageUrl?.trim()??"",itemType,body.deliveryMode==="Offline"?"Offline":body.deliveryMode==="Online + Offline"?"Online + Offline":"Online",specialPrice,body.specialFrom||"",body.specialTo||"",itemType==="course"?body.duration||"":"",itemType==="course"?classes:0,sortOrder,body.id).run()}
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
