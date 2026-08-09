"use client";

import { useState } from "react";

type Lead = { name: string; email: string; status: string; service: string };
type Order = { reference: string; customerName: string; total: number; status: string; paymentStatus: string };
type Ticket = { reference: string; subject: string; priority: string; status: string };
type Appointment = { reference: string; name: string; service: string; status: string };

type Props = {
  leads: Lead[];
  orders: Order[];
  tickets: Ticket[];
  appointments: Appointment[];
  database: { status: string; totalRecords: number; totalTables: number } | null;
  busy: boolean;
};

const tabs = [
  ["operations", "Operations", "◈"],
  ["sales", "Sales & CRM", "◎"],
  ["commerce", "Commerce", "□"],
  ["support", "Support", "◉"],
  ["infrastructure", "Infrastructure", "◫"],
] as const;

export default function MonitoringCenter({ leads, orders, tickets, appointments, database, busy }: Props) {
  const [active, setActive] = useState<(typeof tabs)[number][0]>("operations");
  const newLeads = leads.filter(x => x.status === "new").length;
  const openTickets = tickets.filter(x => !["resolved", "closed"].includes(x.status)).length;
  const pendingOrders = orders.filter(x => !["completed", "cancelled"].includes(x.status)).length;
  const pendingAppointments = appointments.filter(x => x.status === "pending").length;
  const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format((value || 0) / 100);
  const cards = active === "operations" ? [
    ["Pending appointments", pendingAppointments, "Awaiting confirmation", "warning"],
    ["New enquiries", newLeads, "Require first response", "accent"],
    ["Open support tickets", openTickets, "Across all priorities", "danger"],
    ["Live system status", database?.status || "checking", `${database?.totalTables || 0} tables · ${database?.totalRecords || 0} records`, "success"],
  ] : active === "sales" ? [
    ["Total leads", leads.length, "All captured enquiries", "accent"],
    ["New leads", newLeads, "Uncontacted prospects", "warning"],
    ["Services requested", new Set(leads.map(x => x.service).filter(Boolean)).size, "Distinct service lines", "success"],
    ["Response queue", leads.filter(x => ["new", "contacted"].includes(x.status)).length, "Active CRM pipeline", "danger"],
  ] : active === "commerce" ? [
    ["Total orders", orders.length, "All order records", "accent"],
    ["In progress", pendingOrders, "Need fulfilment updates", "warning"],
    ["Paid orders", orders.filter(x => x.paymentStatus === "paid").length, "Payment confirmed", "success"],
    ["Gross order value", money(orders.reduce((sum, x) => sum + (x.total || 0), 0)), "Across all orders", "accent"],
  ] : active === "support" ? [
    ["Total tickets", tickets.length, "All support requests", "accent"],
    ["Open tickets", openTickets, "Need agent attention", "danger"],
    ["Urgent", tickets.filter(x => x.priority === "urgent").length, "Highest priority", "warning"],
    ["Resolved", tickets.filter(x => ["resolved", "closed"].includes(x.status)).length, "Completed requests", "success"],
  ] : [
    ["Database", database?.status || "checking", "Connection health", "success"],
    ["Tables", database?.totalTables || 0, "Structured data sources", "accent"],
    ["Records", database?.totalRecords || 0, "Total stored records", "accent"],
    ["Last refresh", busy ? "Syncing" : "Live", "Automatic 30-second polling", "success"],
  ];

  return <section className="monitoring-center" id="monitoring">
    <div className="monitoring-heading"><div><p>LIVE OPERATIONS</p><h2>Real-time monitoring</h2><span>Track the business pulse by category. Data refreshes automatically every 30 seconds.</span></div><div className="monitoring-live"><i></i>{busy ? "Syncing" : "Live now"}</div></div>
    <div className="monitoring-tabs" role="tablist">{tabs.map(([key, label, icon]) => <button key={key} role="tab" aria-selected={active === key} className={active === key ? "active" : ""} onClick={() => setActive(key)}><b>{icon}</b>{label}</button>)}</div>
    <div className="monitoring-cards">{cards.map(([label, value, detail, tone]) => <article className={`monitor-card ${tone}`} key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</div>
    <div className="monitoring-details"><div><p>RECENT ACTIVITY</p><h3>{active === "sales" ? "Lead pipeline" : active === "commerce" ? "Order queue" : active === "support" ? "Support queue" : "Today's attention"}</h3>{active === "sales" ? leads.slice(0, 5).map(x => <div className="monitor-row" key={`${x.email}-${x.name}`}><b>{x.name}</b><span>{x.service || "General enquiry"}</span><em className={x.status}>{x.status}</em></div>) : active === "commerce" ? orders.slice(0, 5).map(x => <div className="monitor-row" key={x.reference}><b>{x.reference}</b><span>{x.customerName} · {money(x.total)}</span><em className={x.status}>{x.status}</em></div>) : active === "support" ? tickets.slice(0, 5).map(x => <div className="monitor-row" key={x.reference}><b>{x.subject}</b><span>{x.reference}</span><em className={x.priority}>{x.status}</em></div>) : <><div className="monitor-row"><b>{pendingAppointments} appointments</b><span>Waiting for confirmation</span><em className="pending">Review</em></div><div className="monitor-row"><b>{newLeads} new leads</b><span>Awaiting first contact</span><em className="new">Respond</em></div><div className="monitor-row"><b>{openTickets} support tickets</b><span>Open client conversations</span><em className="urgent">Monitor</em></div></>}</div><div className="monitoring-side"><p>MONITORING NOTES</p><h3>Keep the centre moving.</h3><span>Use the category tabs to focus your team. Status changes made elsewhere appear here on the next refresh.</span><div className="monitor-legend"><i className="success"></i>Healthy <i className="warning"></i>Needs attention <i className="danger"></i>Action required</div></div></div>
  </section>;
}
