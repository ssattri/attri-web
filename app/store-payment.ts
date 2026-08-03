import { ensurePaymentTable } from "./razorpay";

export async function ensureStorePaymentTable(){
  const db=await ensurePaymentTable();
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS store_payment_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT NOT NULL UNIQUE,order_id INTEGER NOT NULL,customer_email TEXT NOT NULL,amount INTEGER NOT NULL,currency TEXT NOT NULL DEFAULT 'INR',razorpay_order_id TEXT NOT NULL UNIQUE,razorpay_payment_id TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'created',signature_verified INTEGER NOT NULL DEFAULT 0,failure_reason TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE INDEX IF NOT EXISTS store_payment_email_idx ON store_payment_attempts(customer_email,created_at)"),
  ]);
  return db;
}

type Line={id:number;name:string;price:number;quantity:number;gstRate?:number};
export async function activateStoreOrder(razorpayOrderId:string,paymentId:string,verified:number){
  const db=await ensureStorePaymentTable();
  const attempt=await db.prepare("SELECT p.id,p.order_id AS orderId,p.customer_email AS email,p.amount,o.reference,o.customer_name AS customerName,o.items_json AS itemsJson,o.payment_status AS paymentStatus FROM store_payment_attempts p JOIN orders o ON o.id=p.order_id WHERE p.razorpay_order_id=? LIMIT 1").bind(razorpayOrderId).first<{id:number;orderId:number;email:string;amount:number;reference:string;customerName:string;itemsJson:string;paymentStatus:string}>();
  if(!attempt)return false;
  if(attempt.paymentStatus==="paid")return true;
  const items=JSON.parse(attempt.itemsJson) as Line[];
  for(const item of items){const row=await db.prepare("SELECT stock FROM products WHERE id=? AND status='active'").bind(item.id).first<{stock:number}>();if(!row||row.stock<item.quantity){await db.prepare("UPDATE store_payment_attempts SET status='stock_review',razorpay_payment_id=?,signature_verified=MAX(signature_verified,?),failure_reason='Stock changed after checkout',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(paymentId,verified,attempt.id).run();await db.prepare("INSERT INTO notifications(recipient_email,channel,subject,message,status) VALUES ('admin','dashboard',?,?, 'queued')").bind(`Stock review: ${attempt.reference}`,`Payment captured, but one or more products need manual stock review for ${attempt.reference}.`).run();return true}}
  const invoiceNumber=`INV-${attempt.reference.replace(/^ORD-/,"")}`;
  const taxRate=Math.round(items.reduce((sum,x)=>sum+(x.gstRate||0)*x.price*x.quantity,0)/Math.max(1,items.reduce((sum,x)=>sum+x.price*x.quantity,0)));
  await db.batch([
    ...items.map(item=>db.prepare("UPDATE products SET stock=stock-? WHERE id=? AND stock>=?").bind(item.quantity,item.id,item.quantity)),
    db.prepare("UPDATE store_payment_attempts SET razorpay_payment_id=?,status='captured',signature_verified=MAX(signature_verified,?),failure_reason='',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(paymentId,verified,attempt.id),
    db.prepare("UPDATE orders SET payment_status='paid',status='confirmed',payment_method='razorpay',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(attempt.orderId),
    db.prepare("INSERT INTO order_events(order_id,status,note) VALUES (?,'confirmed','Razorpay payment captured and order confirmed')").bind(attempt.orderId),
    db.prepare("INSERT OR IGNORE INTO invoices(number,customer_name,customer_email,description,amount,tax_rate,status,due_date) VALUES (?,?,?,?,?,?,'paid',date('now'))").bind(invoiceNumber,attempt.customerName,attempt.email,`GST invoice for store order ${attempt.reference}`,attempt.amount,taxRate),
    db.prepare("INSERT INTO notifications(recipient_email,channel,subject,message,status) VALUES (?,'email',?,?, 'queued')").bind(attempt.email,`Order confirmed: ${attempt.reference}`,`Your payment was received. Invoice ${invoiceNumber} is available in your client portal.`),
    db.prepare("INSERT INTO notifications(recipient_email,channel,subject,message,status) VALUES ('admin','dashboard',?,?, 'queued')").bind(`New paid order: ${attempt.reference}`,`Razorpay payment received for ${attempt.reference}. The order is ready for fulfilment.`),
  ]);
  const existing=await db.prepare("SELECT id FROM payment_records WHERE transaction_id=? LIMIT 1").bind(paymentId).first();
  if(!existing)await db.prepare("INSERT INTO payment_records(reference,customer_name,customer_email,purpose,gateway,transaction_id,amount,status) VALUES (?,?,?,?,?,?,?,'successful')").bind(`PAY-${Date.now().toString(36).toUpperCase()}`,attempt.customerName,attempt.email,`Store order ${attempt.reference}`,"Razorpay",paymentId,attempt.amount).run();
  return true;
}
