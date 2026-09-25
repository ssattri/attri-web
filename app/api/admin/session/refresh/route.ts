import {NextResponse} from "next/server";
import {adminSessionCookie,getAdminUser} from "../../../../admin-auth";
export async function GET(request:Request){if(!await getAdminUser())return NextResponse.json({authenticated:false},{status:401});const cookie=await adminSessionCookie(request);const response=NextResponse.json({authenticated:true});response.cookies.set(cookie.name,cookie.value,cookie.options);return response}
