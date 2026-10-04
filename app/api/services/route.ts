import {env} from "@server";
export async function GET(){try{const rows=await env.DB.prepare("SELECT id,name,slug,category,summary,base_price AS basePrice,duration,delivery_mode AS deliveryMode FROM service_catalog WHERE status='active' ORDER BY id DESC").all();return Response.json({services:rows.results})}catch{return Response.json({services:[]})}}
