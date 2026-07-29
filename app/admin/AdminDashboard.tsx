"use client";

import { FormEvent, useEffect, useState } from "react";

type PageRow = { id: number; title: string; slug: string; status: string; excerpt: string; updatedAt: string };

export default function AdminDashboard({ displayName }: { displayName: string }) {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadPages() {
    const response = await fetch("/api/cms/pages");
    const data = await response.json();
    if (response.ok) setPages(data.pages);
    else setMessage(data.error ?? "Unable to load pages");
    setLoading(false);
  }

  useEffect(() => { void loadPages(); }, []);

  async function createPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/cms/pages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: form.get("title"), slug: form.get("slug"), excerpt: form.get("excerpt") }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Draft page created successfully." : data.error);
    if (response.ok) { event.currentTarget.reset(); await loadPages(); }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-logo" href="/"><span>A</span><div><b>ATTRI</b><small>CONTROL CENTRE</small></div></a>
        <nav>
          <a className="selected" href="#overview">⌂ <span>Overview</span></a>
          <a href="#pages">▤ <span>Pages & CMS</span></a>
          <a href="#projects">◇ <span>Projects</span></a>
          <a href="#leads">◎ <span>Leads & CRM</span></a>
          <a href="#appointments">◷ <span>Appointments</span></a>
          <a href="#commerce">□ <span>Orders & Store</span></a>
          <a href="#learning">△ <span>Courses & LMS</span></a>
          <a href="#reports">▥ <span>Reports</span></a>
        </nav>
        <div className="admin-profile"><span>{displayName.slice(0, 1).toUpperCase()}</span><div><b>{displayName}</b><small>Super Administrator</small></div></div>
      </aside>
      <main className="admin-main">
        <header><div><p>OPERATIONS / OVERVIEW</p><h1>Good morning, {displayName.split(" ")[0]}.</h1></div><div><a href="/" target="_blank">View website ↗</a><button>＋ Quick create</button></div></header>
        <section className="admin-stats" id="overview">
          <article><span>New leads</span><strong>—</strong><small>Awaiting live CRM data</small></article>
          <article><span>Appointments</span><strong>—</strong><small>Calendar integration pending</small></article>
          <article><span>Active projects</span><strong>—</strong><small>Project module ready next</small></article>
          <article><span>Revenue</span><strong>—</strong><small>Payment gateway pending</small></article>
        </section>
        <section className="admin-panel" id="pages">
          <div className="panel-title"><div><p>CONTENT MANAGEMENT</p><h2>Website pages</h2></div><span>{pages.length} records</span></div>
          <div className="cms-layout">
            <form onSubmit={createPage}>
              <h3>Create a draft page</h3>
              <label>Page title<input name="title" required placeholder="e.g. Interior Design" /></label>
              <label>URL slug<input name="slug" required placeholder="interior-design" /></label>
              <label>Short description<textarea name="excerpt" rows={4} placeholder="Brief summary for cards and search results" /></label>
              <button type="submit">Create draft page</button>
              {message && <p className="form-message">{message}</p>}
            </form>
            <div className="cms-table">
              <div className="table-head"><span>Page</span><span>Status</span><span>Updated</span></div>
              {loading ? <p className="empty-row">Loading content…</p> : pages.length === 0 ? <p className="empty-row">No CMS pages yet. Create your first draft.</p> : pages.map((page) => (
                <div className="table-row" key={page.id}><span><b>{page.title}</b><small>/{page.slug}</small></span><i>{page.status}</i><time>{page.updatedAt?.slice(0, 10)}</time></div>
              ))}
            </div>
          </div>
        </section>
        <section className="module-roadmap">
          <div><p>NEXT MODULES</p><h2>Enterprise operations roadmap</h2></div>
          {["CRM & Leads", "Project Workspace", "Appointments", "Commerce", "Academy", "Client Portal"].map((item, i) => <article key={item}><span>0{i + 1}</span><b>{item}</b><small>{i === 0 ? "Next in build queue" : "Planned module"}</small></article>)}
        </section>
      </main>
    </div>
  );
}
