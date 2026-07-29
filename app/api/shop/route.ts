async function db(){return(await import("cloudflare:workers")).env.DB}
async function init(){
  const database=await db();
  await database.batch([
    database.prepare(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',price INTEGER NOT NULL,stock INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`),
    database.prepare(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT NOT NULL UNIQUE,customer_name TEXT NOT NULL,
      email TEXT NOT NULL,phone TEXT NOT NULL,address TEXT NOT NULL,city TEXT NOT NULL,state TEXT NOT NULL,
      pincode TEXT NOT NULL,items_json TEXT NOT NULL,subtotal INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
  ]);
  const columns=await database.prepare("PRAGMA table_info(products)").all<{name:string}>();
  if(!columns.results.some(x=>x.name==="image_url"))await database.prepare("ALTER TABLE products ADD COLUMN image_url TEXT NOT NULL DEFAULT ''").run();
  const count=await database.prepare("SELECT COUNT(*) AS total FROM products").first<{total:number}>();
  if(!count?.total)await database.batch([
    database.prepare("INSERT INTO products (name,slug,category,description,price,stock) VALUES (?,?,?,?,?,?)").bind("Vastu Direction Compass","vastu-direction-compass","Tools","Precision direction compass for site and plan analysis.",249900,25),
    database.prepare("INSERT INTO products (name,slug,category,description,price,stock) VALUES (?,?,?,?,?,?)").bind("Brahmasthan Energy Kit","brahmasthan-energy-kit","Remedies","Curated centre-balancing kit with placement guidance.",399900,18),
    database.prepare("INSERT INTO products (name,slug,category,description,price,stock) VALUES (?,?,?,?,?,?)").bind("Scientific Vastu Report","scientific-vastu-report","Reports","Structured digital assessment report for an uploaded floor plan.",599900,999),
    database.prepare("INSERT INTO products (name,slug,category,description,price,stock) VALUES (?,?,?,?,?,?)").bind("Vastu Planning Handbook","vastu-planning-handbook","Books","Practical reference for homes, offices and commercial planning.",149900,40),
    database.prepare("INSERT INTO products (name,slug,category,description,price,stock) VALUES (?,?,?,?,?,?)").bind("Copper Energy Pyramids","copper-energy-pyramids","Remedies","Set of nine copper pyramids for guided corrective placement.",219900,30),
    database.prepare("INSERT INTO products (name,slug,category,description,price,stock) VALUES (?,?,?,?,?,?)").bind("Design OS Early Access","design-os-early-access","Software","Priority access to Attri Design OS beta and onboarding.",999900,100)
  ]);
}
export async function GET(){
  await init();const database=await db();
  const rows=await database.prepare("SELECT id,name,slug,category,description,price,stock,image_url AS imageUrl FROM products WHERE status='active' ORDER BY id DESC").all();
  let courses:{results:unknown[]}={results:[]};
  try{courses=await database.prepare("SELECT id,title AS name,slug,'Courses' AS category,description,price,999 AS stock,image_url AS imageUrl FROM courses WHERE status='published' AND show_in_shop=1 ORDER BY id DESC").all()}
  catch{/* Courses are initialized by the academy workflow. */}
  return Response.json({products:rows.results,courses:courses.results});
}
export async function POST(request:Request){
  const body=await request.json() as {name?:string;email?:string;phone?:string;address?:string;city?:string;state?:string;pincode?:string;items?:Array<{id:number;quantity:number}>};
  if(!body.name||!body.email||!body.phone||!body.address||!body.city||!body.state||!body.pincode||!body.items?.length)return Response.json({error:"Complete all checkout fields and add at least one product."},{status:400});
  await init();const database=await db();const ids=body.items.map(x=>x.id);
  if(ids.length>20)return Response.json({error:"Too many cart items."},{status:400});
  const placeholders=ids.map(()=>"?").join(",");
  const found=await database.prepare(`SELECT id,name,price,stock FROM products WHERE id IN (${placeholders}) AND status='active'`).bind(...ids).all<{id:number;name:string;price:number;stock:number}>();
  const map=new Map(found.results.map(x=>[x.id,x]));let subtotal=0;
  const items=body.items.map(x=>{const product=map.get(x.id);const quantity=Math.max(1,Math.min(10,Number(x.quantity)||1));if(!product||product.stock<quantity)throw new Error("Product unavailable");subtotal+=product.price*quantity;return{id:product.id,name:product.name,price:product.price,quantity}});
  const reference=`ORD-${Date.now().toString(36).toUpperCase()}`;
  await database.prepare(`INSERT INTO orders (reference,customer_name,email,phone,address,city,state,pincode,items_json,subtotal)
    VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(reference,body.name.trim(),body.email.trim(),body.phone.trim(),body.address.trim(),body.city.trim(),body.state.trim(),body.pincode.trim(),JSON.stringify(items),subtotal).run();
  return Response.json({success:true,reference,subtotal},{status:201});
}
