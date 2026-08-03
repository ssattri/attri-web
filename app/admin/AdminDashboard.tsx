"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import DataManagers from "./DataManagers";
import GrowthCenter from "./GrowthCenter";
import RolePermissions from "./RolePermissions";
import NotificationCenter from "./NotificationCenter";
import OrdersManager from "./OrdersManager";

export const adminModules = [
  ["overview","Overview","⌂"],["analytics","Analytics","⌁"],["notifications","Notifications","✦"],
  ["seo-manager","SEO Manager","↗"],["database","Database","◫"],["data-managers","Data Managers","⌗"],
  ["permissions","Team Access","♙"],["pages","Pages & CMS","▤"],["projects","Projects","◇"],
  ["leads","Leads & CRM","◎"],["appointments","Appointments","◷"],["products","Products","＋"],["commerce","Orders","□"],
  ["courses","Courses","△"],["learning","Students & LMS","♢"],["support","Support Tickets","◉"],["finance","Invoices","₹"],
  ["reports","Reports","▥"],["operations","Operations","⚙"],["automation","Workflows","↻"],
  ["vault","File Vault","⌘"]
] as const;

const moduleTitles:Record<string,{eyebrow:string;title:string}> = {
  overview:{eyebrow:"OPERATIONS / OVERVIEW",title:"Business command centre"},
  analytics:{eyebrow:"INSIGHTS / ANALYTICS",title:"Performance analytics"},
  notifications:{eyebrow:"COMMUNICATIONS",title:"Notification centre"},
  "seo-manager":{eyebrow:"MARKETING / SEARCH",title:"SEO manager"},
  database:{eyebrow:"INFRASTRUCTURE",title:"Database centre"},
  "data-managers":{eyebrow:"MASTER DATA",title:"Data managers"},
  permissions:{eyebrow:"SECURITY / TEAM",title:"Roles & permissions"},
  pages:{eyebrow:"CONTENT / CMS",title:"Website pages"},
  projects:{eyebrow:"DELIVERY / PORTFOLIO",title:"Project management"},
  leads:{eyebrow:"SALES / CRM",title:"Leads & enquiries"},
  appointments:{eyebrow:"CONSULTATION DESK",title:"Appointments"},
  products:{eyebrow:"STORE / CATALOGUE",title:"Product catalogue"},
  commerce:{eyebrow:"COMMERCE",title:"Customer orders"},
  courses:{eyebrow:"ATTRI ACADEMY / CATALOGUE",title:"Course catalogue"},
  learning:{eyebrow:"ATTRI ACADEMY",title:"Students & enrollments"},
  support:{eyebrow:"CLIENT SUCCESS",title:"Support tickets"},
  finance:{eyebrow:"FINANCE",title:"Invoices & receivables"},
  reports:{eyebrow:"CONSULTATION INTELLIGENCE",title:"Client reports"},
  operations:{eyebrow:"ENTERPRISE OPERATIONS",title:"Certificates & payments"},
  automation:{eyebrow:"AUTOMATION",title:"Workflows & follow-ups"},
  vault:{eyebrow:"SECURE STORAGE",title:"Client file vault"}
};

type PageRow={id:number;title:string;slug:string;status:string;excerpt:string;updatedAt:string};
type Lead={id:number;name:string;email:string;phone:string;service:string;status:string;createdAt:string};
type Project={id:number;title:string;category:string;location:string;status:string;description:string;createdAt:string};
type Appointment={id:number;reference:string;name:string;phone:string;service:string;consultationMode:string;preferredDate:string;preferredTime:string;status:string};
type Order={id:number;reference:string;customerName:string;email:string;phone:string;address:string;city:string;state:string;pincode:string;itemsJson:string;subtotal:number;shippingAmount:number;total:number;paymentMethod:string;status:string;paymentStatus:string;trackingNumber:string;adminNotes:string;createdAt:string};
type Product={id:number;name:string;slug:string;category:string;description:string;price:number;stock:number;status:string;imageUrl:string;itemType:string;deliveryMode:string;specialPrice:number;specialFrom:string;specialTo:string;duration:string;classes:number;sortOrder:number;metaTitle:string;metaKeywords:string;metaDescription:string;serviceType:string;fulfillmentMode:string;createdAt:string};
type Enrollment={id:number;reference:string;studentName:string;email:string;phone:string;courseTitle:string;status:string;paymentStatus:string;progress:number};
type Course={id:number;title:string;slug:string;category:string;level:string;mode:string;duration:string;description:string;price:number;lessons:number;status:string;imageUrl:string;instructor:string;certificate:number;showInShop:number;metaTitle:string;metaKeywords:string;metaDescription:string;createdAt:string};
type Ticket={id:number;reference:string;customerEmail:string;subject:string;category:string;status:string;priority:string;createdAt:string};
type Invoice={id:number;number:string;customerName:string;customerEmail:string;description:string;amount:number;taxRate:number;status:string;dueDate:string};
type ClientReport={id:number;reference:string;customerEmail:string;title:string;reportType:string;summary:string;status:string;createdAt:string};
type Certificate={id:number;reference:string;studentName:string;studentEmail:string;courseTitle:string;issuedDate:string;status:string};
type Payment={id:number;reference:string;customerName:string;customerEmail:string;purpose:string;gateway:string;transactionId:string;amount:number;status:string};
type WorkflowTask={id:number;reference:string;title:string;assignee:string;dueDate:string;priority:string;status:string};
type ClientFile={id:number;reference:string;customerEmail:string;fileName:string;size:number;category:string;createdAt:string};
type DatabaseOverview={engine:string;status:string;totalTables:number;totalRecords:number;tables:Array<{table:string;label:string;count:number}>;storage:{structured:string;files:string;migrations:string}};

export default function AdminDashboard({displayName,module:initialModule="overview"}:{displayName:string;module?:string}) {
  const [module,setModule]=useState(initialModule);
  const [pages,setPages]=useState<PageRow[]>([]);
  const [leads,setLeads]=useState<Lead[]>([]);
  const [projects,setProjects]=useState<Project[]>([]);
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [orders,setOrders]=useState<Order[]>([]);
  const [products,setProducts]=useState<Product[]>([]);
  const [enrollments,setEnrollments]=useState<Enrollment[]>([]);
  const [courses,setCourses]=useState<Course[]>([]);
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
    if(c.ok){setOrders(cd.orders);setProducts(cd.products)}
    if(e.ok){setEnrollments(ed.enrollments);setCourses(ed.courses)}
    if(t.ok)setTickets(td.tickets);
    if(f.ok){setInvoices(fd.invoices);setReports(fd.reports)}
    if(o.ok){setCertificates(od.certificates);setPayments(od.payments);setTasks(od.tasks);setFiles(od.files)}
    if(d.ok)setDatabase(dd);
    setBusy(false);
  }
  useEffect(()=>{void refresh()},[]);
  useEffect(()=>{
    const syncFromUrl=()=>{
      const requested=new URLSearchParams(window.location.search).get("module")||"overview";
      setModule(adminModules.some(([key])=>key===requested)?requested:"overview");
    };
    syncFromUrl();
    window.addEventListener("popstate",syncFromUrl);
    return()=>window.removeEventListener("popstate",syncFromUrl);
  },[]);

  function navigateModule(key:string,event:MouseEvent<HTMLAnchorElement>){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    const href=key==="overview"?"/admin":`/admin?module=${encodeURIComponent(key)}`;
    window.history.pushState({module:key},"",href);
    setModule(key);
    window.scrollTo({top:0,behavior:"smooth"});
  }

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
  async function removeProduct(id:number){
    if(!window.confirm("Delete this product permanently?"))return;
    const response=await fetch(`/api/admin/commerce?id=${id}`,{method:"DELETE"});
    const data=await response.json();setMessage(response.ok?"Product deleted.":data.error||"Unable to delete product.");if(response.ok)await refresh();
  }
  async function removeCourse(id:number){
    if(!window.confirm("Delete this course permanently?"))return;
    const response=await fetch(`/api/admin/learning?id=${id}`,{method:"DELETE"});const data=await response.json();
    setMessage(response.ok?"Course deleted.":data.error||"Unable to delete course.");if(response.ok)await refresh()
  }
  async function uploadFile(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;const response=await fetch("/api/admin/operations",{method:"POST",body:new FormData(form)});const data=await response.json();setMessage(response.ok?`File ${data.reference} shared securely.`:data.error);if(response.ok){form.reset();await refresh()}
  }

  const current=moduleTitles[module]||moduleTitles.overview;
  return <div className={`admin-shell admin-module-${module}`}>
    <aside className="admin-sidebar">
      <a className="admin-logo" href="/"><span>A</span><div><b>ATTRI</b><small>CONTROL CENTRE</small></div></a>
      <nav>{adminModules.map(([key,label,icon])=><a className={module===key?"selected":""} href={key==="overview"?"/admin":`/admin?module=${encodeURIComponent(key)}`} onClick={event=>navigateModule(key,event)} aria-current={module===key?"page":undefined} key={key}>{icon} <span>{label}</span></a>)}</nav>
      <div className="admin-profile"><span>{displayName.slice(0,1).toUpperCase()}</span><div><b>{displayName}</b><small>Super Administrator</small></div></div>
    </aside>
    <main className="admin-main">
      <header><div><p>{current.eyebrow}</p><h1>{module==="overview"?`Good morning, ${displayName.split(" ")[0]}.`:current.title}</h1></div><div><NotificationCenter compact/><a href="/" target="_blank">View website ↗</a>{module==="products"?<a className="admin-header-action" href="/admin/products/new">＋ Add product</a>:module==="courses"?<a className="admin-header-action" href="/admin/courses/new">＋ Add course</a>:<a className="admin-header-action" href="/admin?module=pages" onClick={event=>navigateModule("pages",event)}>＋ Quick create</a>}</div></header>
      {message&&<div className="admin-toast" onClick={()=>setMessage("")}>{message}<span>×</span></div>}
      <section className="admin-stats" id="overview">
        <article><span>New leads</span><strong>{leads.filter(x=>x.status==="new").length}</strong><small>{leads.length} total enquiries</small></article>
        <article><span>Published pages</span><strong>{pages.filter(x=>x.status==="published").length}</strong><small>{pages.length} CMS records</small></article>
        <article><span>Active projects</span><strong>{projects.filter(x=>["active","featured"].includes(x.status)).length}</strong><small>{projects.length} total projects</small></article>
        <article><span>Appointments</span><strong>{appointments.filter(x=>x.status==="pending").length}</strong><small>{appointments.length} total requests</small></article>
      </section>

      <GrowthCenter/>
      <RolePermissions/>

      <NotificationCenter/>

      <section className="admin-panel database-centre" id="database">
        <div className="panel-title"><div><p>DATA INFRASTRUCTURE</p><h2>Enterprise database centre</h2></div><span>{database?.status||"connecting"}</span></div>
        <div className="database-summary"><article><span>Database engine</span><strong>{database?.engine||"Cloud database"}</strong><small>Durable structured business data</small></article><article><span>Data tables</span><strong>{database?.totalTables??"—"}</strong><small>Integrated operational modules</small></article><article><span>Total records</span><strong>{database?.totalRecords??"—"}</strong><small>Across the complete platform</small></article><article><span>Document storage</span><strong>{database?.storage.files||"R2"}</strong><small>Protected client files and media</small></article></div>
        <div className="database-tables">{database?.tables.map(x=><article key={x.table}><div><span></span><b>{x.label}</b><small>{x.table}</small></div><strong>{x.count}</strong></article>)}</div>
      </section>

      <DataManagers/>

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
        <div className="panel-title"><div><p>COMMERCE</p><h2>Order fulfilment</h2></div><span>{orders.length} orders</span></div>
        <OrdersManager initialOrders={orders}/>
      </section>

      <section className="admin-panel split-module product-admin" id="products">
        <div className="panel-title"><div><p>STORE CATALOGUE</p><h2>Products</h2></div><a className="panel-add-action" href="/admin/products/new">＋ Add product</a></div>
          <div className="product-admin-list full-catalog-list">
            {products.length===0?<p className="empty-row">No products yet. Use Add Product to create your catalogue.</p>:products.map((x,i)=><article key={x.id}>
              <div className={`product-admin-thumb art-${i%6}`}>{x.imageUrl?<img src={x.imageUrl} alt=""/>:<b>◈</b>}</div>
              <div className="product-admin-copy"><b>{x.name}</b><small>{x.category} · {x.itemType}{x.serviceType?` / ${x.serviceType}`:""} · {x.fulfillmentMode||x.deliveryMode} · order {x.sortOrder}</small><span>{new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.price/100)}{x.specialPrice?` → ${new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.specialPrice/100)}`:""} · {x.stock} stock/seats{x.itemType==="course"?` · ${x.duration} · ${x.classes} classes`:""}</span></div>
              <select value={x.status} onChange={e=>update("/api/admin/commerce",x.id,e.target.value,"product")} aria-label={`Visibility for ${x.name}`}><option value="active">Published</option><option value="draft">Draft</option></select>
              <div className="course-row-actions"><a href={`/admin/products/${x.id}/edit`}>Edit</a><button className="danger-action product-delete" onClick={()=>removeProduct(x.id)}>Delete</button></div>
            </article>)}
          </div>
      </section>

      <section className="admin-panel split-module course-admin" id="courses">
        <div className="panel-title"><div><p>COURSE CATALOGUE</p><h2>Courses</h2></div><a className="panel-add-action" href="/admin/courses/new">＋ Add course</a></div>
          <div className="product-admin-list course-admin-list">
            {courses.length===0?<p className="empty-row">No courses yet. Create your first programme.</p>:courses.map((x,i)=><article key={x.id}>
              <div className={`product-admin-thumb course-${i%4}`}>{x.imageUrl?<img src={x.imageUrl} alt=""/>:<b>{String(i+1).padStart(2,"0")}</b>}</div>
              <div className="product-admin-copy"><b>{x.title}</b><small>{x.category} · {x.level} · {x.duration}</small><span>{x.price?new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(x.price/100):"Free"} · {x.lessons} lessons{x.showInShop?" · Shop":""}</span></div>
              <select value={x.status} onChange={e=>update("/api/admin/learning",x.id,e.target.value,"course")}><option value="published">Published</option><option value="draft">Draft</option></select>
              <div className="course-row-actions"><a href={`/admin/courses/${x.id}/edit`}>Edit</a><button className="danger-action" onClick={()=>removeCourse(x.id)}>Delete</button></div>
            </article>)}
          </div>
      </section>

      <section className="admin-panel split-module" id="learning">
        <div className="panel-title"><div><p>STUDENT MANAGEMENT</p><h2>Enrollments</h2></div><span>{enrollments.length} enrollments</span></div>
        <div className="record-list">{enrollments.length===0?<p className="empty-row">No enrollment requests yet.</p>:enrollments.map(x=><article key={x.id}><div><b>{x.studentName}</b><small>{x.courseTitle} · {x.reference} · {x.email}</small></div><select value={x.status} onChange={e=>update("/api/admin/learning",x.id,e.target.value)}><option>pending</option><option>confirmed</option><option>active</option><option>completed</option><option>cancelled</option></select></article>)}</div>
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

      <section className="module-roadmap" id="roadmap"><div><p>NEXT MODULES</p><h2>Enterprise roadmap</h2></div>{["Live Gateway","Campaigns","Report Exports","Customer Messaging"].map((x,i)=><article key={x}><span>0{i+1}</span><b>{x}</b><small>{i===0?"Next in build queue":"Planned module"}</small></article>)}</section>
    </main>
  </div>
}
