"use client";

import { FormEvent, useEffect, useState } from "react";

type PageRow={id:number;title:string;slug:string;status:string;excerpt:string;updatedAt:string};
type Lead={id:number;name:string;email:string;phone:string;service:string;status:string;createdAt:string};
type Project={id:number;title:string;category:string;location:string;status:string;description:string;createdAt:string};
type Appointment={id:number;reference:string;name:string;phone:string;service:string;consultationMode:string;preferredDate:string;preferredTime:string;status:string};
type Order={id:number;reference:string;customerName:string;phone:string;itemsJson:string;subtotal:number;status:string;paymentStatus:string;createdAt:string};
type Enrollment={id:number;reference:string;studentName:string;email:string;phone:string;courseTitle:string;status:string;paymentStatus:string;progress:number};

export default function AdminDashboard({displayName}:{displayName:string}) {
  const [pages,setPages]=useState<PageRow[]>([]);
  const [leads,setLeads]=useState<Lead[]>([]);
  const [projects,setProjects]=useState<Project[]>([]);
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [orders,setOrders]=useState<Order[]>([]);
  const [enrollments,setEnrollments]=useState<Enrollment[]>([]);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(true);

  async function refresh() {
    setBusy(true);
    const [p,l,r,a,c,e]=await Promise.all([fetch("/api/cms/pages"),fetch("/api/admin/leads"),fetch("/api/admin/projects"),fetch("/api/appointments"),fetch("/api/admin/commerce"),fetch("/api/admin/learning")]);
    const [pd,ld,rd,ad,cd,ed]=await Promise.all([p.json(),l.json(),r.json(),a.json(),c.json(),e.json()]);
    if(p.ok)setPages(pd.pages); if(l.ok)setLeads(ld.leads); if(r.ok)setProjects(rd.projects);
    if(a.ok)setAppointments(ad.appointments);
    if(c.ok)setOrders(cd.orders);
    if(e.ok)setEnrollments(ed.enrollments);
    setBusy(false);
  }
  useEffect(()=>{void refresh()},[]);

  async function submit(event:FormEvent<HTMLFormElement>,url:string,success:string){
    event.preventDefault();const form=event.currentTarget;const body=Object.fromEntries(new FormData(form));
    const response=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    const data=await response.json();setMessage(response.ok?success:data.error);if(response.ok){form.reset();await refresh()}
  }
  async function update(url:string,id:number,status:string){
    const response=await fetch(url,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,status})});
    const data=await response.json();setMessage(response.ok?"Status updated.":data.error);if(response.ok)await refresh();
  }
  async function removePage(id:number){
    if(!window.confirm("Delete this CMS page permanently?"))return;
    const response=await fetch(`/api/cms/pages?id=${id}`,{method:"DELETE"});
    setMessage(response.ok?"Page deleted.":"Unable to delete page.");if(response.ok)await refresh();
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a className="admin-logo" href="/"><span>A</span><div><b>ATTRI</b><small>CONTROL CENTRE</small></div></a>
      <nav><a className="selected" href="#overview">⌂ <span>Overview</span></a><a href="#pages">▤ <span>Pages & CMS</span></a><a href="#projects">◇ <span>Projects</span></a><a href="#leads">◎ <span>Leads & CRM</span></a><a href="#appointments">◷ <span>Appointments</span></a><a href="#commerce">□ <span>Orders & Store</span></a><a href="#learning">△ <span>Courses & LMS</span></a><a href="#reports">▥ <span>Reports</span></a></nav>
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

      <section className="module-roadmap"><div><p>NEXT MODULES</p><h2>Enterprise operations roadmap</h2></div>{["Client Portal","Invoices","Reports","Certificates","Automation","Payments"].map((x,i)=><article key={x}><span>0{i+1}</span><b>{x}</b><small>{i===0?"Next in build queue":"Planned module"}</small></article>)}</section>
    </main>
  </div>
}
