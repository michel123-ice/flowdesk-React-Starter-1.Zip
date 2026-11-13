import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, FolderKanban,
  LayoutDashboard, ListTodo, MoreHorizontal, Plus, Search, Settings2,
  SlidersHorizontal, Sparkles, Users, X, Zap
} from "lucide-react";
import "./App.css";

type ProjectStatus = "In progress" | "Review" | "Completed";
type Project = {
  id: number; name: string; client: string; description: string;
  progress: number; status: ProjectStatus; due: string; color: string;
};
type Task = { id: number; title: string; project: string; due: string; done: boolean; priority: "High" | "Medium" | "Low" };

const starterProjects: Project[] = [
  { id: 1, name: "Northstar website", client: "Northstar Studio", description: "Website redesign and launch", progress: 78, status: "In progress", due: "Nov 18, 2026", color: "blue" },
  { id: 2, name: "Bloom brand refresh", client: "Bloom & Co.", description: "Brand identity and digital assets", progress: 54, status: "In progress", due: "Nov 22, 2026", color: "violet" },
  { id: 3, name: "Meridian dashboard", client: "Meridian Labs", description: "Analytics product interface", progress: 92, status: "Review", due: "Nov 14, 2026", color: "cyan" },
  { id: 4, name: "Aurelia storefront", client: "Aurelia House", description: "E-commerce experience", progress: 100, status: "Completed", due: "Nov 08, 2026", color: "orange" }
];
const starterTasks: Task[] = [
  { id: 1, title: "Finalize homepage layout", project: "Northstar website", due: "Today", done: false, priority: "High" },
  { id: 2, title: "Review mobile navigation", project: "Meridian dashboard", due: "Today", done: false, priority: "Medium" },
  { id: 3, title: "Export brand assets", project: "Bloom brand refresh", due: "Tomorrow", done: false, priority: "Low" },
  { id: 4, title: "Send final handover", project: "Aurelia storefront", due: "Nov 08", done: true, priority: "Medium" }
];
const starterClients = [
  { name: "Northstar Studio", contact: "hello@northstar.demo", projects: 1, color: "blue" },
  { name: "Bloom & Co.", contact: "team@bloom.demo", projects: 1, color: "pink" },
  { name: "Meridian Labs", contact: "ops@meridian.demo", projects: 1, color: "cyan" },
  { name: "Aurelia House", contact: "studio@aurelia.demo", projects: 1, color: "orange" }
];

function readStore<T,>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch { return fallback; }
}
function initials(value: string) {
  return value.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}
function App() {
  const [page, setPage] = useState("Overview");
  const [projects, setProjects] = useState<Project[]>(() => readStore("flowdesk-projects", starterProjects));
  const [tasks, setTasks] = useState<Task[]>(() => readStore("flowdesk-tasks", starterTasks));
  const [clients] = useState(starterClients);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { localStorage.setItem("flowdesk-projects", JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem("flowdesk-tasks", JSON.stringify(tasks)); }, [tasks]);

  const completedTasks = tasks.filter(task => task.done).length;
  const activeProjects = projects.filter(project => project.status !== "Completed").length;
  const filteredProjects = useMemo(() => projects.filter(project => {
    const matchesQuery = `${project.name} ${project.client}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || project.status === filter;
    return matchesQuery && matchesFilter;
  }), [projects, query, filter]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }
  function toggleTask(id: number) {
    setTasks(current => current.map(task => task.id === id ? { ...task, done: !task.done } : task));
  }
  function createProject(name: string, client: string, due: string) {
    const next: Project = {
      id: Date.now(), name, client, description: "New project workspace",
      progress: 0, status: "In progress", due: due || "Not set",
      color: ["blue", "violet", "cyan", "orange"][projects.length % 4]
    };
    setProjects(current => [next, ...current]);
    setShowModal(false);
    setPage("Projects");
    notify("Project created");
  }

  const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Projects", icon: FolderKanban, count: projects.length },
    { label: "Tasks", icon: ListTodo, count: tasks.filter(task => !task.done).length },
    { label: "Clients", icon: Users }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Zap size={18} fill="currentColor" /></div><span>flowdesk</span><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">M</div><div className="workspace-copy"><strong>Michel's workspace</strong><span>Free workspace</span></div><ChevronDown size={15}/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.label} className={`nav-item ${page === item.label ? "active" : ""}`} onClick={() => { setPage(item.label); setMobileNav(false); }}>
              <Icon size={18}/><span>{item.label}</span>{item.count !== undefined && <small>{item.count}</small>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={16}/></div><strong>Make room for more</strong><p>Upgrade your workspace as your team grows.</p><button onClick={() => notify("Plans will be available in a future release")}>Explore plans <ArrowUpRight size={14}/></button></div>
          <button className="nav-item muted" onClick={() => notify("Help centre coming soon")}><CircleHelp size={18}/>Help & support</button>
          <button className="nav-item muted" onClick={() => notify("Settings coming soon")}><Settings2 size={18}/>Settings</button>
          <div className="profile-row"><div className="profile-avatar">MC</div><div className="profile-copy"><strong>Michel</strong><span>Workspace owner</span></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Command size={19}/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></div>
            <button className="icon-button notification" onClick={() => notify("You're all caught up")} aria-label="Notifications"><Bell size={18}/><i/></button>
            <div className="top-avatar">MC</div>
          </div>
        </header>

        <div className="content">
          {page === "Overview" && <Overview projects={projects} tasks={tasks} activeProjects={activeProjects} completedTasks={completedTasks} onCreate={() => setShowModal(true)} onNavigate={setPage} onToggle={toggleTask}/>}
          {page === "Projects" && <ProjectsPage projects={filteredProjects} query={query} filter={filter} setFilter={setFilter} onCreate={() => setShowModal(true)} />}
          {page === "Tasks" && <TasksPage tasks={tasks} onToggle={toggleTask}/>}
          {page === "Clients" && <ClientsPage clients={clients}/>}
        </div>
      </main>

      {showModal && <ProjectModal onClose={() => setShowModal(false)} onCreate={createProject}/>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}
function Overview({ projects, tasks, activeProjects, completedTasks, onCreate, onNavigate, onToggle }: {
  projects: Project[]; tasks: Task[]; activeProjects: number; completedTasks: number;
  onCreate: () => void; onNavigate: (page: string) => void; onToggle: (id: number) => void;
}) {
  const shownProjects = projects.slice(0, 3);
  const shownTasks = tasks.filter(task => !task.done).slice(0, 4);
  return <>
    <PageHeading eyebrow="THURSDAY, NOVEMBER 12, 2026" title="Good morning, Michel" subtitle="Here's what's happening across your workspace today." action={<button className="primary-button" onClick={onCreate}><Plus size={17}/> New project</button>}/>
    <div className="demo-note"><span className="demo-dot"/> Sample workspace data <span>— replace it with your own projects as you go.</span></div>
    <div className="stats-grid">
      <StatCard label="Active projects" value={String(activeProjects).padStart(2, "0")} note="Currently in progress" icon={<FolderKanban size={18}/>} trend="+2 this month" trendUp/>
      <StatCard label="Tasks completed" value={`${completedTasks}/${tasks.length}`} note="Across all projects" icon={<CheckCircle2 size={18}/>} trend={`${tasks.length ? Math.round(completedTasks / tasks.length * 100) : 0}% completion`} trendUp/>
      <StatCard label="Pending tasks" value={String(tasks.length - completedTasks).padStart(2, "0")} note="Still need your attention" icon={<ListTodo size={18}/>} trend="Keep it moving" />
      <StatCard label="Due this week" value={String(projects.filter(project => project.status !== "Completed").length).padStart(2, "0")} note="Project milestones" icon={<CalendarDays size={18}/>} trend="View schedule" />
    </div>
    <div className="dashboard-grid">
      <section className="panel projects-panel">
        <div className="panel-heading"><div><h2>Projects overview</h2><p>Keep an eye on your active work.</p></div><button className="text-button" onClick={() => onNavigate("Projects")}>View all <ArrowUpRight size={14}/></button></div>
        <div className="project-list">
          {shownProjects.map(project => <ProjectRow key={project.id} project={project}/>)}
          {shownProjects.length === 0 && <EmptyState text="No projects yet. Create your first project to get started."/>}
        </div>
      </section>
      <section className="panel tasks-panel">
        <div className="panel-heading"><div><h2>My tasks</h2><p>Your next things to get done.</p></div><button className="round-action" onClick={() => onNavigate("Tasks")}><ArrowUpRight size={16}/></button></div>
        <div className="task-list">
          {shownTasks.map(task => <TaskRow key={task.id} task={task} onToggle={onToggle}/>)}
          {shownTasks.length === 0 && <EmptyState text="You're all caught up. Nice work."/>}
        </div>
        <button className="view-tasks" onClick={() => onNavigate("Tasks")}>View all tasks <ArrowUpRight size={14}/></button>
      </section>
    </div>
    <div className="bottom-grid">
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Workspace pulse</h2><p>A quick look at your project health.</p></div><span className="live-label"><i/> LIVE OVERVIEW</span></div>
        <div className="pulse-content"><div className="pulse-chart"><div className="chart-bars">{[34,52,42,68,55,82,62,92,72,100,78,88].map((height, i) => <div key={i} style={{height: `${height}%`}} className={i === 9 ? "highlight" : ""}/>)}</div><div className="chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div></div><div className="pulse-side"><div><span>On track</span><strong>{projects.filter(p => p.status === "In progress" || p.status === "Completed").length}</strong></div><div><span>Needs review</span><strong>{projects.filter(p => p.status === "Review").length}</strong></div></div></div>
      </section>
      <section className="panel deadline-panel"><div className="panel-heading"><div><h2>Upcoming deadlines</h2><p>What's coming up next.</p></div><Clock3 size={17} className="subtle-icon"/></div>
        {projects.filter(p => p.status !== "Completed").slice(0, 3).map(project => <div className="deadline-row" key={project.id}><div className={`deadline-marker ${project.color}`}/><div className="deadline-copy"><strong>{project.name}</strong><span>{project.client}</span></div><time>{project.due}</time></div>)}
      </section>
    </div>
    <div className="footer-note"><Activity size={14}/> Your workspace updates are saved in this browser.</div>
  </>;
}
function StatCard({ label, value, note, icon, trend, trendUp }: { label: string; value: string; note: string; icon: ReactNode; trend: string; trendUp?: boolean }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon">{icon}</div></div><div className="stat-value">{value}</div><div className="stat-bottom"><span>{note}</span><small className={trendUp ? "positive" : ""}>{trendUp && <ArrowUpRight size={12}/>} {trend}</small></div></div>;
}
function ProjectRow({ project }: { project: Project }) {
  return <div className="project-row"><div className={`project-symbol ${project.color}`}><FolderKanban size={17}/></div><div className="project-main"><div className="project-title-line"><strong>{project.name}</strong><StatusPill status={project.status}/></div><span>{project.client}</span><div className="progress-track"><div className={`progress-fill ${project.color}`} style={{width: `${project.progress}%`}}/></div></div><div className="project-progress"><strong>{project.progress}%</strong><span>Complete</span></div></div>;
}
function StatusPill({ status }: { status: ProjectStatus }) {
  return <span className={`status-pill ${status.toLowerCase().replace(" ", "-")}`}><i/>{status}</span>;
}
function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return <div className={`task-row ${task.done ? "task-done" : ""}`}><button className={`task-check ${task.done ? "checked" : ""}`} onClick={() => onToggle(task.id)} aria-label={task.done ? "Mark task incomplete" : "Complete task"}>{task.done && <Check size={13}/>}</button><div className="task-copy"><strong>{task.title}</strong><span>{task.project}</span></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></div>;
}
function ProjectsPage({ projects, query, filter, setFilter, onCreate }: { projects: Project[]; query: string; filter: string; setFilter: (value: string) => void; onCreate: () => void }) {
  return <><PageHeading eyebrow="YOUR WORK" title="Projects" subtitle="Manage every project from kickoff to delivery." action={<button className="primary-button" onClick={onCreate}><Plus size={17}/> New project</button>}/>
    <div className="list-toolbar"><div className="toolbar-search"><Search size={16}/><span>{query ? `Searching for “${query}”` : "Search projects from the top bar"}</span></div><div className="filter-wrap"><SlidersHorizontal size={15}/><select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>In progress</option><option>Review</option><option>Completed</option></select><ChevronDown size={13}/></div></div>
    <section className="panel full-panel"><div className="table-head"><span>PROJECT</span><span>STATUS</span><span>PROGRESS</span><span>DUE DATE</span></div>{projects.map(project => <div className="project-table-row" key={project.id}><div className="table-project"><div className={`project-symbol ${project.color}`}><FolderKanban size={17}/></div><div><strong>{project.name}</strong><span>{project.client}</span></div></div><div><StatusPill status={project.status}/></div><div className="table-progress"><div className="progress-track"><div className={`progress-fill ${project.color}`} style={{width: `${project.progress}%`}}/></div><span>{project.progress}%</span></div><time>{project.due}</time></div>)}{projects.length === 0 && <EmptyState text="No matching projects. Try another search or create a new project."/>}</section>
    <div className="footer-note"><Activity size={14}/> Project changes are saved locally in this browser.</div>
  </>;
}
function TasksPage({ tasks, onToggle }: { tasks: Task[]; onToggle: (id: number) => void }) {
  const [view, setView] = useState("All tasks");
  const visible = tasks.filter(task => view === "All tasks" || (view === "To do" ? !task.done : task.done));
  return <><PageHeading eyebrow="YOUR WORK" title="Tasks" subtitle="A focused list of the work that moves projects forward."/>
    <div className="tabs">{["All tasks", "To do", "Completed"].map(item => <button key={item} className={view === item ? "selected" : ""} onClick={() => setView(item)}>{item}<span>{item === "All tasks" ? tasks.length : item === "To do" ? tasks.filter(t => !t.done).length : tasks.filter(t => t.done).length}</span></button>)}</div>
    <section className="panel full-panel task-page-list">{visible.map(task => <TaskRow key={task.id} task={task} onToggle={onToggle}/>)}{visible.length === 0 && <EmptyState text="Nothing here right now."/>}</section>
  </>;
}
function ClientsPage({ clients }: { clients: typeof starterClients }) {
  return <><PageHeading eyebrow="RELATIONSHIPS" title="Clients" subtitle="Keep client details and project relationships in one place."/>
    <div className="client-grid">{clients.map(client => <div className="panel client-card" key={client.name}><div className={`client-avatar ${client.color}`}>{initials(client.name)}</div><div className="client-info"><strong>{client.name}</strong><span>{client.contact}</span></div><div className="client-card-bottom"><span><FolderKanban size={14}/>{client.projects} project</span><button onClick={() => navigator.clipboard?.writeText(client.contact)} title="Copy email"><ArrowUpRight size={15}/></button></div></div>)}</div>
    <div className="footer-note"><Activity size={14}/> Demo client records are provided as sample data.</div>
  </>;
}
function EmptyState({ text }: { text: string }) { return <div className="empty-state">{text}</div>; }
function ProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, client: string, due: string) => void }) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !client.trim()) { setError("Add a project name and client to continue."); return; }
    onCreate(name.trim(), client.trim(), due);
  }
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><form className="modal" onSubmit={submit}><div className="modal-heading"><div><span className="eyebrow">NEW WORKSPACE ITEM</span><h2>Create a project</h2><p>Set up a space for your next piece of work.</p></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={18}/></button></div>
    <label>Project name<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website redesign"/></label>
    <label>Client or company<input value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Acme Studio"/></label>
    <label>Due date<input type="date" value={due} onChange={e => setDue(e.target.value)}/></label>
    {error && <div className="form-error">{error}</div>}
    <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Plus size={16}/> Create project</button></div>
  </form></div>;
}

export default App;
