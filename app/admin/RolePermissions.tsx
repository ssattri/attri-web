"use client";
import { FormEvent, useEffect, useState } from "react";
type Staff={id:number;fullName:string;role:string;department:string;permissionsJson:string;status:string};
const modules=["Dashboard","CRM & Leads","Projects","Appointments","Shop & Orders","Courses & LMS","Finance","Reports","CMS Content","File Vault","Analytics","Settings"];
export default function RolePermissions(){
 const [staff,setStaff]=useState<Staff[]>([]); const [msg,setMsg]=useState("");
 async function load(){const r=await fetch("/api/admin/permissions");if(r.ok)setStaff((await r.json()).staff)} useEffect(()=>{const timer=window.setTimeout(()=>void load(),0);return()=>window.clearTimeout(timer)},[]);
 async function toggle(s:Staff,key:string){const current:string[]=JSON.parse(s.permissionsJson||"[]");const permissions=current.includes(key)?current.filter(x=>x!==key):[...current,key];const r=await fetch("/api/admin/permissions",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id:s.id,permissions})});if(r.ok)await load()}
 async function changePassword(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=e.currentTarget;const r=await fetch("/api/admin/security",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(f)))});const d=await r.json();setMsg(r.ok?"Password updated securely.":d.error);if(r.ok)f.reset()}
 return <section className="admin-panel role-centre" id="permissions"><div className="panel-title"><div><p>ACCESS CONTROL</p><h2>Users, roles & permissions</h2></div><span>{staff.length} team members</span></div>
  <div className="cms-layout"><form onSubmit={changePassword}><h3>Admin security</h3><p>Change the control-centre password. Use 12 or more characters.</p><label>Current password<input name="currentPassword" type="password" autoComplete="current-password" required/></label><label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={12} required/></label><label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required/></label><button>Update password</button>{msg&&<small className="form-message">{msg}</small>}</form>
  <div className="permission-grid">{staff.length===0?<p className="empty-row">Add staff members in Data Managers to assign access.</p>:staff.map(s=>{const active:string[]=JSON.parse(s.permissionsJson||"[]");return <article key={s.id}><header><div><b>{s.fullName}</b><small>{s.role} · {s.department}</small></div><span>{s.status}</span></header><div>{modules.map(m=><label key={m}><input type="checkbox" checked={active.includes(m.toLowerCase())} onChange={()=>toggle(s,m.toLowerCase())}/><span>{m}</span></label>)}</div></article>})}</div></div>
 </section>
}
