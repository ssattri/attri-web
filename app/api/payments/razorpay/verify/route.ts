import { getPortalUser } from "../../../../auth";
import { activateOrder, configured, ensurePaymentTable, equal, hmac, razorpayEnv, razorpayFetch } from "../../../../razorpay";

export async function POST(request:Request){
  const origin=request.headers.get("origin");if(origin&&origin!==new URL(request.url).origin)return Response.json({error:"Invalid request origin."},{status:403});
  const user=await getPortalUser();if(!user||user.accountType!=="user")return Response.json({error:"Unauthorized"},{status:401});
  const b=await request.json()as{razorpay_payment_id?:string;razorpay_order_id?:string;razorpay_signature?:string};if(!b.razorpay_payment_id||!b.razorpay_order_id||!b.razorpay_signature)return Response.json({error:"Incomplete payment confirmation."},{status:400});
  const e=await razorpayEnv();if(!configured(e))return Response.json({error:"Payment gateway unavailable."},{status:503});const db=await ensurePaymentTable();
  const attempt=await db.prepare("SELECT id,razorpay_order_id AS orderId,amount FROM course_payment_attempts WHERE razorpay_order_id=? AND lower(customer_email)=? LIMIT 1").bind(b.razorpay_order_id,user.email.toLowerCase()).first<{id:number;orderId:string;amount:number}>();if(!attempt)return Response.json({error:"Payment order not found."},{status:404});
  const expected=await hmac(`${attempt.orderId}|${b.razorpay_payment_id}`,e.RAZORPAY_KEY_SECRET||"");if(!equal(expected,b.razorpay_signature)){await db.prepare("UPDATE course_payment_attempts SET status='verification_failed',failure_reason='Invalid checkout signature',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(attempt.id).run();return Response.json({error:"Payment verification failed."},{status:400})}
  const payment=await razorpayFetch(`/payments/${encodeURIComponent(b.razorpay_payment_id)}`,e);if(payment.order_id!==attempt.orderId||Number(payment.amount)!==attempt.amount||payment.currency!=="INR")return Response.json({error:"Payment details do not match the order."},{status:400});
  if(payment.status!=="captured"){await db.prepare("UPDATE course_payment_attempts SET razorpay_payment_id=?,status=?,signature_verified=1,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(b.razorpay_payment_id,String(payment.status||"authorized"),attempt.id).run();return Response.json({success:true,pending:true,message:"Payment authorised. Course access will activate after capture."})}
  await activateOrder(attempt.orderId,b.razorpay_payment_id,1);return Response.json({success:true,destination:"/learning"});
}
