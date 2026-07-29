"use client";

import { FormEvent, useEffect, useState } from "react";

type PageRow={id:number;title:string;slug:string;status:string;excerpt:string;updatedAt:string};
type Lead={id:number;name:string;email:string;phone:string;service:string;status:string;createdAt:string};
type Project={id:number;title:string;category:string;location:string;status:string;description:string;createdAt:string};
type Appointment={id:number;reference:string;name:string;phone:string;service:string;consultationMode:string;preferredDate:string;preferredTime:string;status:string};
type Order={id:number;reference:string;customerName:string;phone:string;itemsJson:string;subtotal:number;status:string;paymentStatus:string;createdAt:string};
type Enrollment={id:number;reference:string;studentName:string;email:string;phone:string;courseTitle:string;status:string;paymentStatus:string;progress:number};
type Ticket={id:number;reference:string;customerEmail:string;subject:string;category:string;status:string;priority:string;createdAt:string};
type Invoice={id:number;number:string;customerName:string;customerEmail:string;description:string;amount:number;taxRate:number;status:string;dueDate:string};
type ClientReport={id:number;reference:string;customerEmail:string;title:string;reportType:string;summary:string;status:string;createdAt:string};
type Certificate={id:number;reference:string;studentName:string;studentEmail:string;courseTitle:string;issuedDate:string;status:string};
type Payment={id:number;reference:string;customerName:string;customerEmail:string;purpose:string;gateway:string;transactionId:string;amount:number;status:string};
type WorkflowTask={id:number;reference:string;title:string;assignee:string;dueDate:string;priority:string;status:string};
type ClientFile={id:number;reference:string;customerEmail:string;fileName:string;size:number;category:string;createdAt:string};
type DatabaseOverview={engine:string;status:string;totalTables:number;totalRecords:number;tables:Array<{table:string;label:string;count:number}>;storage:{structured:string;files:string;migrations:string}};

export default function AdminDashboard({displayName}:{displayName:string}) {
  const [pages,setPages]=useState<PageRow[]>([]);
  const [leads,setLeads]=useState<Lead[]>([]);
  const [projects,setProjects]=useState<Project[]>([]);
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [orders,setOrders]=useState<Order[]>([]);
  const [enrollments,setEnrollments]=useState<Enrollment[]>([]);
  const [tickets,setTickets]=useState<Ticket[]>([]);
  const [invoices,setInvoices]=useState<Invoice[]>([]);
  const [reports,setReports]=useState<ClientReport[]>([]);
  const [certificates,setCertificates]=useState<Certificate[]>([]);
  const [payments,setPayments]=useState<Payment[]>([]);
  const [tasks,setTasks]=useState<WorkflowTask[]>([]);
  const [files,setFiles]=useState<ClientFile[]>([]);
  const [database,setDatabase]=useState<DatabaseOverview|null>(null);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(true);

  async function refresh() {
    setBusy(true);
    const [p,l,r,a,c,e,t,f,o,d]=await Promise.all([fetch("/api/cms/pages"),fetch("/api/admin/leads"),fetch("/api/admin/projects"),fetch("/api/appointments"),fetch("/api/admin/commerce"),fetch("/api/admin/learning"),fetch("/api/admin/support"),fetch("/api/admin/finance"),fetch("/api/admin/operations"),fetch("/api/admin/database")]);
    const [pd,ld,rd,ad,cd,ed,td,fd,od,dd]=await Promise.all([p.json(),l.json(),r.json(),a.json(),c.json(),e.json(),t.json(),f.json(),o.json(),d.json()]);
    if(p.ok)setPages(pd.pages); if(l.ok)setLeads(ld.leads); if(r.ok)setProjects(rd.projects);
    if(a.ok)setAppointments(ad.appointments);
    if(c.ok)setOrders(cd.orders);
    if(e.ok)setEnrollments(ed.enrollments);
    if(t.ok)setTickets(td.tickets);
    if(f.ok){setInvoices(fd.invoices);setReports(fd.reports)}
    if(o.ok){setCertificates(od.certificates);setPayments(od.payments);setTasks(od.tasks);setFiles(od.files)}
    if(d.ok)setDatabase(dd);
    setBusy(false);
  }
  useEffect(()=>{void refresh()},[]);

  async function submit(event:FormEvent<HTMLFormElement>,url:string,success:string){
    event.preventDefault();const form=event.currentTarget;const body=Object.fromEntries(new FormData(form));
    const response=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    const data=await response.json();setMessage(response.ok?success:data.error);if(response.ok){form.reset();await refresh()}
  }
  async function update(url:string,id:number,status:string,kind?:string){
    const response=await fetch(url,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,status,...(kind?{kind}:{})})});
    const data=await response.json();setMessage(response.ok?"Status updated.":data.error);if(response.ok)await refresh();
  }
  async function removePage(id:number){
    if(!window.confirm("Delete this CMS page permanently?"))return;
    const response=await fetch(`/api/cms/pages?id=${id}`,{method:"DELETE"});
    setMessage(response.ok?"Page deleted.":"Unable to delete page.");if(response.ok)await refresh();
  }
  async function uploadFile(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;const response=await fetch("/api/admin/operations",{method:"POST",body:new FormData(form)});const data=await response.json();setMessage(response.ok?`File ${data.reference} shared securely.`:data.error);if(response.ok){form.reset();await refresh()}
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-logo" href="/"><span>A</span><div><b>ATTRI</b><small>CONTROL CENTRE</small></div></a>
      <nav><a className="selected" href="#overview">⌂ <span>Overview</span></a><a href="#database">◫ <span>Database</span></a><a href="#pages">▤ <span>Pages & CMS</span></a><a href="#projects">◇ <span>Projects</span></a><a href="#leads">◎ <span>Leads & CRM</span></a><a href="#appointments">◷ <span>Appointments</span></a><a href="#commerce">□ <span>Orders & Store</span></a><a href="#learning">△ <span>Courses & LMS</span></a><a href="#finance">₹ <span>Invoices</span></a><a href="#reports">▥ <span>Reports</span></a><a href="#operations">⚙ <span>Operations</span></a><a href="#vault">⌘ <span>File vault</span></a></nav>
      <div className="admin-profile"><span>{displayName.slice(0,1).toUpperCase()}</span><div><b>{displayName}</b><small>Super Administrator</small></div></div>
    </aside>
    <main className="admin-main">
      <header><div><p>OPERATIONS / OVERVIEW</p><h1>Good morning, {displayName.split(" ")[0]}.</h1></div><div><a href="/" target="_blank">View website ↗</a><button onClick={()=>document.querySelector("#pages")?.scrollIntoView()}>＋ Quick create</button></div></header>
      {message&&<div className="admin-toast" onClick={()=>setMessage("")}>{message}<span>×</span></div>}
      <section className="admin-stats" id="overview">
        <article><span>New leads</span><strong>{leads.filter(x=>x.status==="new").length}</strong><small>{leads.length} total enquiries</small></article>
        <article><span>Published pages</span><strong>{pages.filter(x=>x.status==="published").length}</strong><small>{pages.length} CMS records</small></article>
        <article><span>Active projects</span><strong>{projects.filter(x=>["active","featured"].includes(x.status)).length}</strong><small>{projects.length} total projects</small></article>
        <article><span>Appointments</span><strong>{appointments.filter(x=>x.status==="pending").length}</strong><small>{appointments.length} total requests</small></article>
      </section>

      <section className="admin-panel database-centre" id="database">
        <div className="panel-title"><div><p>DATA INFRASTRUCTURE</p><h2>Enterprise database centre</h2></div><span>{database?.status||"connecting"}</span></div>
        <div className="database-summary"><article><span>Database engine</span><strong>{database?.engine||"Cloud database"}</strong><small>Durable structured business data</small></article><article><span>Data tables</span><strong>{database?.totalTables??"—"}</strong><small>Integrated operational modules</small></article><article><span>Total records</span><strong>{database?.totalRecords??"—"}</strong><small>Across the complete platform</small></article><article><span>Document storage</span><strong>{database?.storage.files||"R2"}</strong><small>Protected client files and media</small></article></div>
        <div className="database-tables">{database?.tables.map(x=><article key={x.table}><div><span></span><b>{x.label}</b><small>{x.table}</small></div><strong>{x.count}</strong></article>)}</div>
      </section>

      <section className="admin-panel" id="pages">
        <div className="panel-title"><div><p>CONTENT MANAGEMENT</p><h2>Website pages</h2></div><span>{pages.length} records</span></div>
        <div className="cms-layout">
          <form onSubmit={e=>submit(e,"/api/cms/pages","Draft page created.")}><h3>Create a draft page</h3><label>Page title<input name="title" required placeholder="e.g. Interior Design"/></label><label>URL slug<input name="slug" required placeholder="interior-design"/></label><label>Short description<textarea name="excerpt" rows={4} placeholder="Summary for cards and search results"/></label><button>Create draft page</button></form>
          <div className="cms-table"><div className="table-head extended"><span>Page</span><span>Status</span><span>Updated</span><span>Actions</span></div>
            {pages.length===0?<p className="empty-row">No CMS pages yet.</p>:pages.map(x=><div className="table-row extended" key={x.id}><span><b>{x.title}</b><small>/{x.slug}</small></span><select value={x.status} onChange={e=>update("/api/cms/pages",x.id,e.target.value)}><option>draft</option><option>published</option><option>archived</option></select><time>{x.updatedAt?.slice(0,10)}</time><button className="danger-action" onClick={()=>removePage(x.id)}>Delete</button></div>)}
          </div>
        </div>
      </section>

      <section className="admin-panel split-module" id="leads">
        <div className="panel-title"><div><p>CRM</p><h2>Leads & enquiries</h2></div><span>{leads.length} records</span></div>
        <div className="cms-layout"><form onSubmit={e=>submit(e,"/api/admin/leads","Lead added.")}><h3>Add lead</h3><label>Name<input name="name" required/></label><label>Phone<input name="phone"/></label><label>Email<input name="email" type="email"/></label><label>Service<select name="service"><option>Vastu Consultation</option><option>Architecture</option><option>Structural Design</option><option>Interior Design</option></select></label><button>Add to CRM</button></form>
          <div className="record-list">{leads.length===0?<p className="empty-row">No leads yet.</p>:leads.map(x=><article key={x.id}><div><b>{x.name}</b><small>{x.service||"General enquiry"} · {x.phone||x.email||"No contact"}</small></div><select value={x.status} onChange={e=>update("/api/admin/leads",x.id,e.target.value)}><option>new</option><option>contacted</option><option>qualified</option><option>won</option><option>lost</option></select></article>)}</div>
        </div>
      </section>

      <section className="admin-panel split-module" id="projects">
        <div className="panel-title"><div><p>PORTFOLIO</p><h2>Project management</h2></div><span>{projects.length} records</span></div>
        <div className="cms-layout"><form onSubmit={e=>submit(e,"/api/admin/projects","Project created.")}><h3>Add project</h3><label>Project title<input name="title" required/></label><label>Category<select name="category"><option>Residential</option><option>Commercial</option><option>Industrial</option><option>Hospitality</option><option>Healthcare</option><option>Educational</option></select></label><label>Location<input name="location"/></label><label>Description<textarea name="description" rows={4}/></label><button>Create project</button></form>
          <div className="record-list">{projects.length===0?<p className="empty-row">No projects yet.</p>:projects.map(x=><article key={x.id}><div><b>{x.title}</b><small>{x.category} · {x.location||"Location pending"}</small></div><select value={x.status} onChange={e=>update("/api/admin/projects",x.id,e.target.value)}><option>draft</option><option>active</option><option>completed</option><option>featured</option></select></article>)}</div>
        </div>
      </section>

      <section className="admin-panel appointment-admin" id="appointments">
        <div className="panel-title"><div><p>CONSULTATION DESK</p><h2>Appointments</h2></div><span>{appointments.length} requests</span></div>
        <div className="appointment-table">
          <div className="appointment-head"><span>Client</span><span>Consultation</span><span>Preferred schedule</span><span>Status</span></div>
          {appointments.length===0?<p className="empty-row">No consultation requests yet.</p>:appointments.map(x=><article key={x.id}><div><b>{x.name}</b><small>{x.reference} · {x.phone}</small></div><div><b>{x.service}</b><small>{x.consultationMode}</small></div><div><b>{x.preferredDate}</b><small>{x.preferredTime}</small></div><select value={x.status} onChange={e=>update("/api/appointments",x.id,e.target.value)}><option>pending</option><option>confirmed</option><option>completed</option><option>cancelled</option></select></article>)}
        </div>
      </section>

      <section className="admin-panel appointment-admin" id="commerce">
        <div className="panel-title"><div><p>COMMERCE</p><h2>Orders</h2></div><span>{orders.length} orders</span></div>
        <div className="appointment-table order-table"><div className="appointment-head"><span>Customer</span><span>Order</span><span>Value</span><span>Status</span></div>
          {orders.length===0?<p className="empty-row">No order requests yet.</p>:orders.map(x=><article key={x.id}><div><b>{x.customerName}</b><small>{x.phone}</small></div><div><b>{x.reference}</b><small>{JSON.parse(x.itemsJson).length} product line(s)</small></div><div><b>{new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.subtotal/100)}</b><small>{x.paymentStatus}</small></div><select value={x.status} onChange={e=>update("/api/admin/commerce",x.id,e.target.value)}><option>pending</option><option>confirmed</option><option>processing</option><option>shipped</option><option>completed</option><option>cancelled</option></select></article>)}
        </div>
      </section>

      <section className="admin-panel split-module" id="learning">
        <div className="panel-title"><div><p>ATTRI ACADEMY</p><h2>Courses & students</h2></div><span>{enrollments.length} enrollments</span></div>
        <div className="cms-layout"><form onSubmit={e=>submit(e,"/api/admin/learning","Draft course created.")}><h3>Create course</h3><label>Course title<input name="title" required/></label><label>Category<select name="category"><option>Vastu Shastra</option><option>Architecture</option><option>Professional</option></select></label><label>Level<select name="level"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label>Mode<select name="mode"><option>Recorded</option><option>Live</option><option>Live + Recorded</option></select></label><label>Duration<input name="duration" placeholder="8 weeks"/></label><label>Price (₹)<input name="price" type="number" min="0"/></label><label>Lessons<input name="lessons" type="number" min="0"/></label><label>Description<textarea name="description" rows={3}/></label><button>Create draft course</button></form>
          <div className="record-list">{enrollments.length===0?<p className="empty-row">No enrollment requests yet.</p>:enrollments.map(x=><article key={x.id}><div><b>{x.studentName}</b><small>{x.courseTitle} · {x.reference}</small></div><select value={x.status} onChange={e=>update("/api/admin/learning",x.id,e.target.value)}><option>pending</option><option>confirmed</option><option>active</option><option>completed</option><option>cancelled</option></select></article>)}</div>
        </div>
      </section>

      <section className="admin-panel appointment-admin" id="support">
        <div className="panel-title"><div><p>CLIENT SUPPORT</p><h2>Support tickets</h2></div><span>{tickets.length} tickets</span></div>
        <div className="appointment-table"><div className="appointment-head"><span>Customer</span><span>Issue</span><span>Priority</span><span>Status</span></div>
          {tickets.length===0?<p className="empty-row">No support tickets yet.</p>:tickets.map(x=><article key={x.id}><div><b>{x.customerEmail}</b><small>{x.reference}</small></div><div><b>{x.subject}</b><small>{x.category}</small></div><div><b>{x.priority}</b><small>{x.createdAt?.slice(0,10)}</small></div><select value={x.status} onChange={e=>update("/api/admin/support",x.id,e.target.value)}><option>open</option><option>in-progress</option><option>waiting</option><option>resolved</option><option>closed</option></select></article>)}
        </div>
      </section>

      <section className="admin-panel split-module" id="finance">
        <div className="panel-title"><div><p>FINANCE DESK</p><h2>Invoices & receivables</h2></div><span>{invoices.length} invoices</span></div>
        <div className="cms-layout"><form onSubmit={e=>submit(e,"/api/admin/finance","Invoice issued.")}><input type="hidden" name="kind" value="invoice"/><h3>Issue invoice</h3><label>Client name<input name="customerName" required/></label><label>Client email<input name="customerEmail" type="email" required/></label><label>Description<input name="description" required placeholder="Consultation or project milestone"/></label><label>Amount (₹)<input name="amount" type="number" min="1" required/></label><label>GST rate (%)<input name="taxRate" type="number" min="0" max="28" defaultValue="18"/></label><label>Due date<input name="dueDate" type="date" required/></label><button>Issue invoice</button></form>
          <div className="record-list">{invoices.length===0?<p className="empty-row">No invoices issued yet.</p>:invoices.map(x=><article key={x.id}><div><b>{x.number} · {new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.amount/100)}</b><small>{x.customerName} · due {x.dueDate}</small></div><select value={x.status} onChange={e=>update("/api/admin/finance",x.id,e.target.value,"invoice")}><option>issued</option><option>paid</option><option>overdue</option><option>cancelled</option></select></article>)}</div>
        </div>
      </section>

      <section className="admin-panel split-module" id="reports">
        <div className="panel-title"><div><p>CONSULTATION INTELLIGENCE</p><h2>Client reports</h2></div><span>{reports.length} reports</span></div>
        <div className="cms-layout"><form onSubmit={e=>submit(e,"/api/admin/finance","Client report created.")}><input type="hidden" name="kind" value="report"/><h3>Create report</h3><label>Client email<input name="customerEmail" type="email" required/></label><label>Report title<input name="title" required/></label><label>Report type<select name="reportType"><option>Vastu Audit</option><option>Architecture Review</option><option>Site Analysis</option><option>Remedy Plan</option><option>Project Report</option></select></label><label>Executive summary<textarea name="summary" required rows={3}/></label><label>Key findings<textarea name="findings" rows={3}/></label><label>Recommendations<textarea name="recommendations" rows={3}/></label><button>Create draft report</button></form>
          <div className="record-list">{reports.length===0?<p className="empty-row">No reports created yet.</p>:reports.map(x=><article key={x.id}><div><b>{x.title}</b><small>{x.reference} · {x.customerEmail}</small></div><select value={x.status} onChange={e=>update("/api/admin/finance",x.id,e.target.value,"report")}><option>draft</option><option>published</option><option>archived</option></select></article>)}</div>
        </div>
      </section>

      <section className="admin-panel split-module" id="operations">
        <div className="panel-title"><div><p>ENTERPRISE OPERATIONS</p><h2>Certificates & payments</h2></div><span>{certificates.length+payments.length} records</span></div>
        <div className="cms-layout operations-grid">
          <form onSubmit={e=>submit(e,"/api/admin/operations","Certificate issued.")}><input type="hidden" name="kind" value="certificate"/><h3>Issue certificate</h3><label>Student name<input name="studentName" required/></label><label>Student email<input name="studentEmail" type="email" required/></label><label>Course title<input name="courseTitle" required/></label><label>Issue date<input name="issuedDate" type="date" required/></label><button>Issue certificate</button></form>
          <form onSubmit={e=>submit(e,"/api/admin/operations","Payment recorded.")}><input type="hidden" name="kind" value="payment"/><h3>Record payment</h3><label>Customer name<input name="customerName" required/></label><label>Customer email<input name="customerEmail" type="email" required/></label><label>Purpose<input name="purpose" required/></label><label>Gateway<select name="gateway"><option>Razorpay</option><option>Stripe</option><option>PayPal</option><option>UPI</option><option>Bank Transfer</option><option>Cash</option></select></label><label>Transaction ID<input name="transactionId"/></label><label>Amount (₹)<input name="amount" type="number" min="1" required/></label><label>Status<select name="status"><option>pending</option><option>successful</option><option>failed</option><option>refunded</option></select></label><button>Save payment</button></form>
        </div>
        <div className="operations-lists"><div className="record-list"><h3>Certificates</h3>{certificates.length===0?<p className="empty-row">No certificates yet.</p>:certificates.map(x=><article key={x.id}><div><b>{x.studentName}</b><small>{x.courseTitle} · {x.reference}</small></div><select value={x.status} onChange={e=>update("/api/admin/operations",x.id,e.target.value,"certificate")}><option>issued</option><option>revoked</option></select></article>)}</div><div className="record-list"><h3>Payment records</h3>{payments.length===0?<p className="empty-row">No payments yet.</p>:payments.map(x=><article key={x.id}><div><b>{x.reference} · {new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.amount/100)}</b><small>{x.customerName} · {x.gateway}</small></div><select value={x.status} onChange={e=>update("/api/admin/operations",x.id,e.target.value,"payment")}><option>pending</option><option>successful</option><option>failed</option><option>refunded</option></select></article>)}</div></div>
      </section>

      <section className="admin-panel split-module" id="automation">
        <div className="panel-title"><div><p>WORKFLOW AUTOMATION</p><h2>Tasks & follow-ups</h2></div><span>{tasks.filter(x=>x.status!=="completed").length} open</span></div>
        <div className="cms-layout"><form onSubmit={e=>submit(e,"/api/admin/operations","Workflow task created.")}><input type="hidden" name="kind" value="task"/><h3>Create task</h3><label>Task title<input name="title" required placeholder="Call client or deliver report"/></label><label>Assign to<select name="assignee"><option>Vastu Expert</option><option>Architect</option><option>Engineer</option><option>Sales Team</option><option>Accounts</option></select></label><label>Due date<input name="dueDate" type="date" required/></label><label>Priority<select name="priority"><option>normal</option><option>high</option><option>urgent</option></select></label><button>Create workflow task</button></form>
          <div className="record-list">{tasks.length===0?<p className="empty-row">No workflow tasks yet.</p>:tasks.map(x=><article key={x.id}><div><b>{x.title}</b><small>{x.assignee} · due {x.dueDate} · {x.priority}</small></div><select value={x.status} onChange={e=>update("/api/admin/operations",x.id,e.target.value,"task")}><option>pending</option><option>in-progress</option><option>completed</option><option>cancelled</option></select></article>)}</div>
        </div>
      </section>

      <section className="admin-panel split-module" id="vault">
        <div className="panel-title"><div><p>SECURE DOCUMENT STORAGE</p><h2>Client file vault</h2></div><span>{files.length} files</span></div>
        <div className="cms-layout"><form onSubmit={uploadFile}><h3>Share a protected file</h3><label>Client email<input name="customerEmail" type="email" required/></label><label>Category<select name="category"><option>Project Drawing</option><option>Vastu Report</option><option>Invoice</option><option>Contract</option><option>Site Photograph</option><option>Other</option></select></label><label>File (maximum 20 MB)<input name="file" type="file" required/></label><button>Upload to client vault</button></form>
          <div className="record-list">{files.length===0?<p className="empty-row">No client files uploaded yet.</p>:files.map(x=><article key={x.id}><div><b>{x.fileName}</b><small>{x.customerEmail} · {x.category} · {(x.size/1024/1024).toFixed(2)} MB</small></div><span className="record-status">secured</span></article>)}</div>
        </div>
      </section>

      <section className="module-roadmap"><div><p>NEXT MODULES</p><h2>Enterprise roadmap</h2></div>{["Data Managers","Live Gateway","Notifications","Analytics"].map((x,i)=><article key={x}><span>0{i+1}</span><b>{x}</b><small>{i===0?"Next in build queue":"Planned module"}</small></article>)}</section>
    </main>
  </div>
}
