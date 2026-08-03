import { getRegisteredAccount } from "../../../../../auth";
import { configured, razorpayEnv, razorpayFetch } from "../../../../../razorpay";
import { ensureStorePaymentTable } from "../../../../../store-payment";

type CartItem={id:number;quantity:number};
export async function POST(request:Request){
  const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  const user=await getRegisteredAccount();if(!user||user.accountType!=="user")return Response.json({error:"Sign in with a registered User account to checkout."},{status:401});
  const e=await razorpayEnv();if(!configured(e))return Response.json({error:"Razorpay is awaiting merchant credentials. Your cart is saved; please try again after payments are enabled."},{status:503});
  const body=await request.json() as {name?:string;phone?:string;address?:string;city?:string;state?:string;pincode?:string;gstin?:string;items?:CartItem[]};
  if(!body.name||!body.phone||!body.address||!body.city||!body.state||!/^[0-9]{6}$/.test(body.pincode||"")||!body.items?.length)return Response.json({error:"Complete the delivery details and add at least one product."},{status:400});
  if(body.items.length>20)return Response.json({error:"Too many cart items."},{status:400});
  const ids=body.items.map(x=>Number(x.id)).filter(x=>x>0),db=await ensureStorePaymentTable();if(ids.length!==body.items.length)return Response.json({error:"Courses must be purchased from the Courses page."},{status:400});
  const found=await db.prepare(`SELECT id,name,CASE WHEN special_price>0 AND (special_from='' OR date('now')>=special_from) AND (special_to='' OR date('now')<=special_to) THEN special_price ELSE price END AS price,stock,gst_rate AS gstRate FROM products WHERE id IN (${ids.map(()=>"?").join(",")}) AND status='active'`).bind(...ids).all<{id:number;name:string;price:number;stock:number;gstRate:number}>();
  const map=new Map(found.results.map(x=>[x.id,x]));let subtotal=0;let items;
  try{items=body.items.map(x=>{const product=map.get(Number(x.id)),quantity=Math.max(1,Math.min(10,Number(x.quantity)||1));if(!product||product.stock<quantity)throw new Error();subtotal+=product.price*quantity;return{id:product.id,name:product.name,price:product.price,quantity,gstRate:product.gstRate}})}catch{return Response.json({error:"One or more products are unavailable in the requested quantity."},{status:409})}
  const shippingAmount=subtotal>=500000?0:19900,total=subtotal+shippingAmount,reference=`ORD-${Date.now().toString(36).toUpperCase()}`;
  const inserted=await db.prepare("INSERT INTO orders(reference,customer_name,email,phone,address,city,state,pincode,items_json,subtotal,shipping_amount,total,payment_method,status,payment_status,admin_notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'payment-pending','pending',?) RETURNING id").bind(reference,body.name.trim(),user.email.toLowerCase(),body.phone.trim(),body.address.trim(),body.city.trim(),body.state.trim(),body.pincode,JSON.stringify(items),subtotal,shippingAmount,total,"razorpay",body.gstin?`GSTIN: ${body.gstin.trim().toUpperCase()}`:"").first<{id:number}>();
  const order=await razorpayFetch("/orders",e,{method:"POST",body:JSON.stringify({amount:total,currency:"INR",receipt:reference.slice(0,40),notes:{store_order_id:String(inserted?.id),reference,customer_email:user.email}})}),orderId=String(order.id||"");
  if(!orderId)return Response.json({error:"Payment order could not be created."},{status:502});
  await db.batch([db.prepare("INSERT INTO store_payment_attempts(reference,order_id,customer_email,amount,razorpay_order_id,status) VALUES (?,?,?,?,?,'created')").bind(`RZP-${Date.now().toString(36).toUpperCase()}`,inserted?.id,user.email.toLowerCase(),total,orderId),db.prepare("INSERT INTO order_events(order_id,status,note) VALUES (?,'payment-pending','Razorpay checkout started')").bind(inserted?.id)]);
  return Response.json({keyId:e.RAZORPAY_KEY_ID,orderId,amount:total,currency:"INR",reference,prefill:{name:body.name,email:user.email,contact:body.phone}});
}
