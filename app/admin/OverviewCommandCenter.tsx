"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BadgeIndianRupee, BookOpenCheck, CalendarClock, CheckCircle2, Headset, LayoutDashboard, LifeBuoy, RefreshCw, ShoppingCart, Users } from "lucide-react";

type Row={id:number;status?:string;createdAt?:string;paymentStatus?:string;total?:number;amount?:number;stock?:number;priority?:string;preferredDate?:string;preferredTime?:string;name?:string;service?:string;consultationMode?:string;dueDate?:string};
type Props={
  leads:Row[];projects:Row[];appointments:Row[];orders:Row[];products:Row[];enrollments:Row[];courses:Row[];tickets:Row[];invoices:Row[];payments:Row[];tasks:Row[];pages:Row[];
  database:{status?:string;totalRecords?:number;totalTables?:number}|null;
  busy:boolean;lastUpdated:Date;onRefresh:()=>void;
};

const money=(paise:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(paise/100);
const tabs=[
  ["overview","Overview",LayoutDashboard],["sales","Sales",Users],["consultations","Consultations",Headset],
  ["commerce","Commerce",ShoppingCart],["academy","Academy",BookOpenCheck],["support","Support",LifeBuoy],["system","System",CheckCircle2]
] as const;

export default function OverviewCommandCenter(props:Props){
  const [tab,setTab]=useState("overview");
  const now=new Date();
  const data=useMemo(()=>{
    const paidOrders=props.orders.filter(x=>String(x.paymentStatus).toLowerCase()==="paid");
    const orderRevenue=paidOrders.reduce((sum,x)=>sum+Number(x.total||0),0);
    const recordedRevenue=props.payments.filter(x=>String(x.status).toLowerCase()==="paid").reduce((sum,x)=>sum+Number(x.amount||0),0);
    const openTickets=props.tickets.filter(x=>!["resolved","closed"].includes(String(x.status).toLowerCase()));
    const dueInvoices=props.invoices.filter(x=>!["paid","cancelled"].includes(String(x.status).toLowerCase()));
    const lowStock=props.products.filter(x=>Number(x.stock||0)<=5&&String(x.status)==="active");
    const upcoming=props.appointments.filter(x=>{
      const stamp=new Date(`${String(x.preferredDate||"")}T${String(x.preferredTime||"00:00")}`);
      return !Number.isNaN(stamp.getTime())&&stamp>=now&&!['cancelled','completed'].includes(String(x.status));
    }).sort((a,b)=>String(a.preferredDate).localeCompare(String(b.preferredDate))).slice(0,5);
    const upcomingTasks=props.tasks.filter(x=>!["completed","cancelled"].includes(String(x.status))).sort((a,b)=>String(a.dueDate).localeCompare(String(b.dueDate))).slice(0,5);
    return {paidOrders,orderRevenue,recordedRevenue,openTickets,dueInvoices,lowStock,upcoming,upcomingTasks};
  },[props]);

  const cards:Record<string,Array<[string,string,string,string]>>={
    overview:[
      ["Revenue collected",money(data.orderRevenue+data.recordedRevenue),`${data.paidOrders.length} paid orders & payments`,`finance`],
      ["New leads",String(props.leads.filter(x=>x.status==="new").length),`${props.leads.length} total CRM records`,`leads`],
      ["Upcoming bookings",String(data.upcoming.length),`${props.appointments.length} total appointments`,`appointments`],
      ["Needs attention",String(data.openTickets.length+data.dueInvoices.length+data.lowStock.length),"Tickets, invoices and stock","support"]
    ],
    sales:[
      ["New leads",String(props.leads.filter(x=>x.status==="new").length),"Awaiting first response","leads"],
      ["Qualified",String(props.leads.filter(x=>x.status==="qualified").length),"Ready for proposal","leads"],
      ["Won",String(props.leads.filter(x=>x.status==="won").length),"Converted opportunities","leads"],
      ["Active projects",String(props.projects.filter(x=>["active","featured"].includes(String(x.status))).length),`${props.projects.length} projects total`,`projects`]
    ],
    consultations:[
      ["Upcoming",String(data.upcoming.length),"Scheduled from now","appointments"],
      ["Pending",String(props.appointments.filter(x=>x.status==="pending").length),"Awaiting confirmation","consultations"],
      ["Payment due",String(props.appointments.filter(x=>x.paymentStatus!=="paid").length),"Unpaid consultation requests","consultations"],
      ["Completed",String(props.appointments.filter(x=>x.status==="completed").length),"Delivered consultations","consultancy"]
    ],
    commerce:[
      ["Order revenue",money(data.orderRevenue),"Successfully paid orders","commerce"],
      ["Open orders",String(props.orders.filter(x=>!["completed","cancelled","delivered"].includes(String(x.status))).length),`${props.orders.length} orders total`,`commerce`],
      ["Live products",String(props.products.filter(x=>x.status==="active").length),`${props.products.length} catalogue items`,`products`],
      ["Low stock",String(data.lowStock.length),"Five units or fewer","products"]
    ],
    academy:[
      ["Published courses",String(props.courses.filter(x=>x.status==="published").length),`${props.courses.length} courses total`,`courses`],
      ["Enrollments",String(props.enrollments.length),"All academy learners","learning"],
      ["Active learners",String(props.enrollments.filter(x=>["active","enrolled"].includes(String(x.status))).length),"Currently studying","learning"],
      ["Payment pending",String(props.enrollments.filter(x=>x.paymentStatus!=="paid").length),"Enrollment payments due","learning"]
    ],
    support:[
      ["Open tickets",String(data.openTickets.length),"Requires client response","support"],
      ["High priority",String(data.openTickets.filter(x=>x.priority==="high").length),"Urgent support queue","support"],
      ["Due invoices",String(data.dueInvoices.length),"Outstanding receivables","finance"],
      ["Published pages",String(props.pages.filter(x=>x.status==="published").length),`${props.pages.length} CMS pages`,`pages`]
    ],
    system:[
      ["Database",props.database?.status||"Checking",`${props.database?.totalRecords||0} records`,`database`],
      ["Data tables",String(props.database?.totalTables||0),"Connected business modules","database"],
      ["Scheduled tasks",String(data.upcomingTasks.length),`${props.tasks.length} workflow tasks`,`automation`],
      ["Module health","Operational","Live admin services","module-control"]
    ]
  };
  const alerts=[
    data.openTickets.length&&[`${data.openTickets.length} support ticket${data.openTickets.length===1?"":"s"} need attention`,"support"],
    data.dueInvoices.length&&[`${data.dueInvoices.length} invoice${data.dueInvoices.length===1?"":"s"} remain unpaid`,"finance"],
    data.lowStock.length&&[`${data.lowStock.length} product${data.lowStock.length===1?"":"s"} have low stock`,"products"]
  ].filter(Boolean) as Array<[string,string]>;

  return <section className="overview-command" id="overview">
    <div className="overview-command-head">
      <div><span className="live-dot">LIVE</span><h2>Business command centre</h2><p>Live operational monitoring across every connected module.</p></div>
      <button type="button" onClick={props.onRefresh} disabled={props.busy}><RefreshCw className={props.busy?"spinning":""}/><span>{props.busy?"Updating…":"Refresh data"}</span></button>
    </div>
    <div className="overview-tabs" role="tablist" aria-label="Dashboard monitoring areas">
      {tabs.map(([key,label,Icon])=><button key={key} type="button" role="tab" aria-selected={tab===key} className={tab===key?"active":""} onClick={()=>setTab(key)}><Icon/><span>{label}</span></button>)}
    </div>
    <div className="overview-kpis">
      {cards[tab].map(([label,value,detail,module])=><a href={`/admin?module=${module}`} key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small><b>Open module →</b></a>)}
    </div>
    <div className="overview-monitor-grid">
      <article className="overview-monitor-panel"><header><div><CalendarClock/><h3>Upcoming monitoring</h3></div><span>Next scheduled</span></header>
        <div className="overview-timeline">{data.upcoming.length?data.upcoming.map(x=><a href="/admin?module=appointments" key={x.id}><time>{String(x.preferredDate).slice(5)}<small>{String(x.preferredTime||"Time pending")}</small></time><div><b>{String(x.name||"Client consultation")}</b><small>{String(x.service||"Consultation")} · {String(x.consultationMode||"Mode pending")}</small></div><span>{String(x.status||"pending")}</span></a>):<div className="overview-empty">No upcoming appointments. New bookings will appear here automatically.</div>}</div>
      </article>
      <article className="overview-monitor-panel"><header><div><AlertTriangle/><h3>Attention centre</h3></div><span>{alerts.length} alerts</span></header>
        <div className="overview-alerts">{alerts.length?alerts.map(([text,module])=><a href={`/admin?module=${module}`} key={text}><AlertTriangle/><span>{text}</span><b>Review →</b></a>):<div className="overview-empty success"><CheckCircle2/> All monitored modules are clear.</div>}</div>
      </article>
    </div>
    <footer className="overview-statusbar"><span><i/> Auto-refresh every 45 seconds</span><span>Last updated {props.lastUpdated.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span><span><BadgeIndianRupee/> Financial values include confirmed payments</span></footer>
  </section>;
}
