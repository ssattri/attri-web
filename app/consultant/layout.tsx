import Link from "next/link";
import type{ReactNode}from"react";
export default function ConsultantLayout({children}:{children:ReactNode}){return <>{children}<nav className="consultant-quick-nav" aria-label="Consultant software navigation"><Link href="/consultant">Dashboard</Link><Link href="/consultant/workspace">Compass</Link><Link href="/consultant/reports">Report Studio</Link></nav></>}
