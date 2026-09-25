import { env } from "@server";
import { getRazorpayCredentials } from "../../../../razorpay-config";

async function digest(value:string,secret:string){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const signature=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));return Array.from(new Uint8Array(signature)).map(x=>x.toString(16).padStart(2,"0")).join("")}

export async function POST(request:Request){
  const raw=await request.text();const signature=request.headers.get("x-razorpay-signature")||"";const credentials=await getRazorpayCredentials(env.DB);
  if(!credentials.webhookSecret)return Response.json({error:"Webhook secret is not configured."},{status:503});
  const expected=await digest(raw,credentials.webhookSecret);if(expected!==signature)return Response.json({error:"Invalid webhook signature."},{status:401});
  const payload=JSON.parse(raw) as {event?:string;payload?:{payment?:{entity?:{id?:string;order_id?:string;status?:string}};order?:{entity?:{id?:string;receipt?:string}};refund?:{entity?:{payment_id?:string;id?:string}}}};
  const event=payload.event||"";const payment=payload.payload?.payment?.entity;const orderEntity=payload.payload?.order?.entity;const reference=orderEntity?.receipt||"";const razorpayOrderId=payment?.order_id||orderEntity?.id||"";
  let order=reference?await env.DB.prepare("SELECT id,reference FROM orders WHERE reference=?").bind(reference).first<{id:number;reference:string}>():null;
  if(!order&&razorpayOrderId)order=await env.DB.prepare("SELECT id,reference FROM orders WHERE admin_notes LIKE ?").bind(`%${razorpayOrderId}%`).first<{id:number;reference:string}>();
  if(!order)return Response.json({received:true});
  const paid=["payment.captured","order.paid"].includes(event),failed=event==="payment.failed",refunded=event.startsWith("refund.");
  if(paid)await env.DB.prepare("UPDATE orders SET payment_status='paid',status='confirmed',updated_at=CURRENT_TIMESTAMP,admin_notes=? WHERE id=?").bind(`Razorpay webhook ${payment?.id||event}`,order.id).run();
  else if(failed)await env.DB.prepare("UPDATE orders SET payment_status='failed',status='pending',updated_at=CURRENT_TIMESTAMP,admin_notes=? WHERE id=?").bind(`Razorpay payment failed ${payment?.id||""}`,order.id).run();
  else if(refunded)await env.DB.prepare("UPDATE orders SET payment_status='refunded',status='cancelled',updated_at=CURRENT_TIMESTAMP,admin_notes=? WHERE id=?").bind(`Razorpay refund ${payload.payload?.refund?.entity?.id||""}`,order.id).run();
  const eventStatus=paid?"paid":failed?"payment-failed":refunded?"refunded":event;const eventNote=`Razorpay webhook: ${event}`;const seen=await env.DB.prepare("SELECT id FROM order_events WHERE order_id=? AND status=? AND note=? LIMIT 1").bind(order.id,eventStatus,eventNote).first<{id:number}>();if(!seen)await env.DB.prepare("INSERT INTO order_events (order_id,status,note) VALUES (?,?,?)").bind(order.id,eventStatus,eventNote).run();
  return Response.json({received:true});
}
