import type{ReactNode}from"react";
export default function ConsultantLayout({children}:{children:ReactNode}){return <>{children}<nav className="consultant-quick-nav" aria-label="Consultant software navigation"><a href="/consultant">Dashboard</a><a href="/consultant/workspace">Compass</a><a href="/consultant/reports">Report Studio</a></nav></>}
