'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Ellipsis,
  Eye,
  Filter,
  FolderKanban,
  Grid2X2,
  LayoutList,
  Link2,
  Menu,
  MessageCircle,
  Moon,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Tag,
  User,
  Users,
  X,
} from 'lucide-react'

type Screen = 'tasks' | 'projects' | 'detail' | 'settings' | 'login'
type View = 'list' | 'board'
type Priority = 'Urgent' | 'High' | 'Medium' | 'Low'

type Task = {
  id: number
  title: string
  status: 'To Do' | 'Doing' | 'Completed' | 'On Hold'
  priority: Priority
  member: string
  date: string
  labels: string[]
}

const avatarUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-07%20165504-hDrlKpbKgIbKIkKX9aNXZZ0dsx65AL.png'

const seedTasks: Task[] = [
  { id: 1, title: 'Write API Documentation', status: 'To Do', priority: 'High', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 2, title: 'Implement Search Function', status: 'To Do', priority: 'Medium', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 3, title: 'Deploy to Production', status: 'To Do', priority: 'Low', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 4, title: 'Code Review Completed', status: 'Doing', priority: 'High', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 5, title: 'Design Mockups Finalized', status: 'Doing', priority: 'Medium', member: 'Admin', date: '29 Jul', labels: ['Deployment', 'Deployment'] },
  { id: 6, title: 'Feature Testing Passed', status: 'Completed', priority: 'High', member: 'QA Team', date: '30 Jul', labels: ['Testing', 'Passed'] },
  { id: 7, title: 'UI Design Updated', status: 'Completed', priority: 'Medium', member: 'Designer', date: '31 Jul', labels: ['Design', 'Updated'] },
  { id: 8, title: 'Security Audit Scheduled', status: 'Completed', priority: 'Low', member: 'Security', date: '01 Aug', labels: ['Audit', 'Scheduled'] },
  { id: 9, title: 'UI Review', status: 'On Hold', priority: 'Medium', member: 'Designer', date: '02 Aug', labels: ['Review', 'Feedback'] },
  { id: 10, title: 'Backend Refactor', status: 'On Hold', priority: 'Low', member: 'Dev Team', date: '04 Aug', labels: ['Development', 'Code'] },
]

const projects = [
  { title: 'Design Homepage', priority: 'High' as Priority, lead: 'Admin', date: '12 Sep 2026' },
  { title: 'Develop Login Feature', priority: 'Low' as Priority, lead: 'CN', date: '15 Sep 2026' },
  { title: 'Test Payment Gateway', priority: 'Medium' as Priority, lead: '+', date: '18 Sep 2026' },
]

const statuses: Task['status'][] = ['To Do', 'Doing', 'Completed', 'On Hold']
const priorities: Priority[] = ['Urgent', 'High', 'Medium', 'Low']

function Avatar({ name = 'Admin', large = false }: { name?: string; large?: boolean }) {
  return name === 'Admin' ? (
    <img className={large ? 'avatar avatar-large' : 'avatar'} src={avatarUrl} alt="Admin avatar" />
  ) : <span className={large ? 'avatar avatar-large avatar-initials' : 'avatar avatar-initials'}>{name === '+' ? '+' : name.slice(0, 2)}</span>
}

function IconButton({ label, children, onClick, active }: { label: string; children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return <button className={`icon-button ${active ? 'is-active' : ''}`} aria-label={label} onClick={onClick}>{children}</button>
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`priority priority-${priority.toLowerCase()}`}><span className="priority-mark">▥</span>{priority}</span>
}

function Topbar({ screen, setScreen, view, setView, onMenu, search, setSearch }: { screen: Screen; setScreen: (screen: Screen) => void; view: View; setView: (view: View) => void; onMenu: (menu: string) => void; search: string; setSearch: (value: string) => void }) {
  return <header className="topbar">
    <button className="sidebar-toggle" aria-label="Toggle sidebar"><Menu size={16} /></button>
    {screen === 'detail' && <button className="breadcrumb-button" onClick={() => setScreen('tasks')}><ChevronLeft size={15} /> Tasks</button>}
    <div className="topbar-spacer" />
    {screen !== 'settings' && screen !== 'login' && <>
      <div className={`search-control ${search ? 'search-open' : ''}`}><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={14} /></button>}</div>
      <IconButton label="Fields" active={view === 'board'} onClick={() => onMenu('fields')}><SlidersHorizontal size={15} /></IconButton>
      <IconButton label="Filter" onClick={() => onMenu('filter')}><Filter size={15} /></IconButton>
      <button className="dark-button" onClick={() => onMenu('add')}><Plus size={14} /> {screen === 'projects' ? 'Add Project' : 'Add Task'}</button>
    </>}
  </header>
}

type Accent = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black'

const accents: { id: Accent; label: string; swatch: string }[] = [
  { id: 'amber', label: 'Amber', swatch: '#d97706' },
  { id: 'blue', label: 'Blue', swatch: '#2563eb' },
  { id: 'pink', label: 'Pink', swatch: '#db2777' },
  { id: 'rose', label: 'Rose', swatch: '#e11d48' },
  { id: 'emerald', label: 'Emerald', swatch: '#059669' },
  { id: 'black', label: 'Black', swatch: '#161616' },
]

function ProfilePopover({ onClose, onSettings, theme, setTheme, accent, setAccent }: { onClose: () => void; onSettings: () => void; theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; accent: Accent; setAccent: (accent: Accent) => void }) {
  const [submenu, setSubmenu] = useState<'theme' | 'color' | null>(null)
  return <div className="profile-popover" onClick={(event) => event.stopPropagation()}>
    <div className="profile-card"><Avatar large /><strong>Dexter</strong><small>dexter@gmail.com</small></div>
    <button className="profile-menu-row" onClick={() => setSubmenu(submenu === 'theme' ? null : 'theme')}><span><Sun size={15} /> Change Theme</span><ChevronRight size={14} /></button>
    {submenu === 'theme' && <div className="profile-submenu"><button className="profile-menu-row" onClick={() => { setTheme('light'); onClose() }}><span><Sun size={14} /> Light</span>{theme === 'light' && <Check size={14} />}</button><button className="profile-menu-row" onClick={() => { setTheme('dark'); onClose() }}><span><Moon size={14} /> Dark</span>{theme === 'dark' && <Check size={14} />}</button></div>}
    <button className="profile-menu-row" onClick={() => setSubmenu(submenu === 'color' ? null : 'color')}><span><Sparkles size={15} /> Color Mode</span><ChevronRight size={14} /></button>
    {submenu === 'color' && <div className="profile-submenu">{accents.map((item) => <button className="accent-button" key={item.id} onClick={() => { setAccent(item.id); onClose() }}><span className="accent-swatch" style={{ '--swatch': item.swatch } as React.CSSProperties} />{item.label}{accent === item.id && <Check size={14} className="ml-auto" />}</button>)}</div>}
    <button className="profile-menu-row" onClick={onSettings}><span><Settings size={15} /> Settings</span></button>
  </div>
}

function Sidebar({ screen, setScreen, onProfile, profileOpen, onCloseProfile, onSettings, theme, setTheme, accent, setAccent }: { screen: Screen; setScreen: (screen: Screen) => void; onProfile: () => void; profileOpen: boolean; onCloseProfile: () => void; onSettings: () => void; theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; accent: Accent; setAccent: (accent: Accent) => void }) {
  return <aside className="sidebar" onClick={onCloseProfile}>
    <button className="workspace-profile" onClick={(event) => { event.stopPropagation(); onProfile() }}><Avatar /><strong>Dexter</strong><ChevronDown size={14} /></button>
    {profileOpen && <ProfilePopover onClose={onCloseProfile} onSettings={onSettings} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />}
    <div className="workspace-label">Workspace <ChevronDown size={14} /></div>
    <button className={`nav-item ${screen === 'tasks' || screen === 'detail' ? 'selected' : ''}`} onClick={() => setScreen('tasks')}><LayoutList size={16} /> Tasks</button>
    <button className={`nav-item ${screen === 'projects' ? 'selected' : ''}`} onClick={() => setScreen('projects')}><FolderKanban size={16} /> Projects</button>
    <div className="sidebar-bottom"><button className="nav-item" onClick={onSettings}><Settings size={16} /> Settings</button></div>
  </aside>
}

function MenuPopover({ type, onClose, view, setView, setTheme, theme, fields, setFields }: { type: string; onClose: () => void; view: View; setView: (view: View) => void; setTheme: (theme: 'light' | 'dark') => void; theme: 'light' | 'dark'; fields: Record<string, boolean>; setFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>> }) {
  if (!type) return null
  if (type === 'fields') return <div className="popover fields-popover"><div className="segmented"><button className={view === 'list' ? 'active' : ''} onClick={() => { setView('list'); onClose() }}><LayoutList size={14} /> List</button><button className={view === 'board' ? 'active' : ''} onClick={() => { setView('board'); onClose() }}><Grid2X2 size={14} /> Board</button></div>{['Status', 'Priority', 'Members', 'Due Date', 'Teams', 'Labels', 'Reporter'].map((field) => <button className="check-row" key={field} onClick={() => setFields((current) => ({ ...current, [field]: !current[field] }))}><span>{field}</span><span className={`check-box ${fields[field] ? 'checked' : ''}`}>{fields[field] && <Check size={12} />}</span></button>)}</div>
  if (type === 'filter') return <div className="popover filter-popover"><p className="popover-kicker">Filter by</p>{['Status', 'Priority', 'Members', 'Due Date', 'Teams', 'Labels', 'Reporter'].map((item) => <button className="menu-row" key={item}><span>{item}</span><ChevronRight size={14} /></button>)}</div>
  if (type === 'theme') return <div className="popover theme-popover"><p className="popover-kicker">Theme</p><button className="menu-row" onClick={() => { setTheme('light'); onClose() }}><Sun size={15} /> Light {theme === 'light' && <Check size={14} />}</button><button className="menu-row" onClick={() => { setTheme('dark'); onClose() }}><Moon size={15} /> Dark {theme === 'dark' && <Check size={14} />}</button></div>
  return null
}

function TaskTable({ tasks, onSelect, onAdd }: { tasks: Task[]; onSelect: (task: Task) => void; onAdd: () => void }) {
  return <div className="task-table"><div className="table-head"><span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span><span>Actions</span></div>{tasks.map((task) => <button className="table-row" key={task.id} onClick={() => onSelect(task)}><span className="task-name">{task.title}</span><PriorityBadge priority={task.priority} /><span><Avatar name={task.member} /></span><span className="date-text">{task.date === '29 Jul' ? '12 Sep 2026' : task.date}</span><Ellipsis size={15} /></button>)}<button className="add-row" onClick={onAdd}><Plus size={14} /> Add Task</button></div>
}

function TaskList({ tasks, onSelect, onAdd }: { tasks: Task[]; onSelect: (task: Task) => void; onAdd: () => void }) {
  return <div className="content-scroll"><div className="page-heading"><h1>Tasks</h1><span className="muted-count">{tasks.length} tasks</span></div>{statuses.map((status) => { const filtered = tasks.filter((task) => task.status === status); return <section className="task-group" key={status}><button className="group-title"><ChevronDown size={14} /> {status} <span>{filtered.length}</span></button><TaskTable tasks={filtered} onSelect={onSelect} onAdd={onAdd} /></section> })}</div>
}

function TaskBoard({ tasks, onSelect, onAdd }: { tasks: Task[]; onSelect: (task: Task) => void; onAdd: () => void }) {
  return <div className="content-scroll"><div className="page-heading"><h1>Tasks</h1><span className="muted-count">Board view</span></div><div className="board">{statuses.map((status) => <section className="board-column" key={status}><div className="column-title"><span><Grid2X2 size={13} /> {status}</span><span><Plus size={15} /> <Ellipsis size={15} /></span></div>{tasks.filter((task) => task.status === status).map((task) => <button className="task-card" key={task.id} onClick={() => onSelect(task)}><div className="card-title">{task.title}<Ellipsis size={14} /></div><div className="card-meta"><Avatar name={task.member} /><span>{task.member}</span><span className="card-date"><CalendarDays size={13} /> {task.date}</span></div><div className="label-list">{task.labels.map((label, index) => <span className="label" key={`${label}-${index}`}><Tag size={12} /> {label}</span>)}</div></button>)}<button className="add-card" onClick={onAdd}><Plus size={14} /> Add Task</button></section>)}</div></div>
}

function ProjectsView({ onSelect }: { onSelect: () => void }) {
  return <div className="content-scroll"><div className="page-heading"><h1>Projects</h1><span className="muted-count">3 projects</span></div><div className="task-table project-table"><div className="table-head"><span>Projects</span><span>Priority</span><span>Lead</span><span>Due Date</span><span>Actions</span></div>{projects.map((project) => <button className="table-row" key={project.title} onClick={onSelect}><span className="task-name">{project.title}</span><PriorityBadge priority={project.priority} /><span><Avatar name={project.lead} /></span><span className="date-text">{project.date}</span><Ellipsis size={15} /></button>)}<button className="add-row"><Plus size={14} /> Add Projects</button></div></div>
}

function DetailView({ task, onBack }: { task: Task; onBack: () => void }) {
  return <div className="content-scroll detail-scroll"><div className="detail-header"><div><button className="detail-back" onClick={onBack}><ChevronLeft size={15} /> Tasks</button><h1>{task.title}</h1><p>Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.</p></div><div className="detail-actions"><IconButton label="Lock"><Archive size={16} /></IconButton><IconButton label="Watch"><Eye size={16} /></IconButton><IconButton label="Share"><Share2 size={16} /></IconButton><IconButton label="More"><Ellipsis size={16} /></IconButton></div></div><div className="detail-layout"><main><div className="detail-properties"><strong>Properties</strong><span className="member-pill"><Avatar name="Designer" /> Designer</span><span className="date-pill"><CalendarDays size={13} /> 31 Jul</span></div><div className="detail-properties"><strong>Labels</strong>{['Research', 'Design', 'Development', 'Testing', 'Deployment'].map((label) => <span className="label" key={label}><Tag size={12} /> {label}</span>)}</div><div className="detail-properties"><strong>Resources</strong><span className="muted-inline"><Link2 size={14} /> Add document or link...</span></div><h2 className="section-title"><ChevronDown size={14} /> Subtasks</h2><div className="subtask-table"><div className="subtask-head"><span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span><span>Actions</span></div>{['Subtask 1', 'Subtask 2', 'Subtask 3'].map((item, index) => <div className="subtask-row" key={item}><span>{item}</span><PriorityBadge priority={priorities[index + 1]} /><Avatar name={index === 0 ? 'Admin' : index === 1 ? 'CN' : '+'} /><span>{['12 Sep 2026', '15 Sep 2026', '18 Sep 2026'][index]}</span><Ellipsis size={15} /></div>)}<button className="add-row"><Plus size={14} /> Add Subtasks</button></div><h2 className="section-title">Subtasks</h2><div className="comment-box"><div className="comment-header"><Avatar name="Admin" /><strong>Ankit Dutta</strong><span>just now</span><Ellipsis size={15} /></div><p>dsds</p><div className="reply-row"><Avatar name="Admin" /><span>Leave a reply...</span><Paperclip size={15} /><MessageCircle size={15} /></div></div><div className="comment-input">Add a comment... <Paperclip size={15} /><MessageCircle size={15} /></div></main><aside className="details-panel"><div className="panel-card"><div className="panel-title">Details <Plus size={15} /><Settings size={15} /></div>{[['Status', '● Backlog'], ['Priority', '▥ High'], ['Members', 'Add members'], ['Dates', 'Jan 10 → End'], ['Labels', 'Add labels'], ['Teams', 'Add teams'], ['Reporter', 'Add reporter']].map(([label, value]) => <div className="property-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="panel-card updates"><div className="panel-title">Updates</div><div className="update"><Avatar name="Admin" /><span><strong>You</strong> changed priority from No priority to Urgent</span></div><div className="update"><Avatar name="Admin" /><span><strong>You</strong> posted an update · Aug 2026</span></div></div></aside></div></div>
}

function SettingsView({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return <div className="settings-wrap"><aside className="settings-rail"><button className="back-app" onClick={() => setScreen('tasks')}><ArrowLeft size={15} /> Back to app</button><div className="settings-search"><Search size={15} /> Search</div><button className="settings-item active"><User size={15} /> Profile</button><button className="settings-item"><Sun size={15} /> Theme</button><button className="settings-item"><span className="color-square" /> Color</button></aside><main className="settings-main"><h1>Profile</h1><div className="settings-card"><div className="settings-row"><span>Profile picture</span><Avatar large /></div><div className="settings-row"><span>Email</span><strong>dexter@gmail.com <Pencil size={14} /></strong></div>{[['Full name', 'Dexter'], ['Title', 'Designer'], ['Username', 'Dexuser']].map(([label, value]) => <div className="settings-row" key={label}><span><strong>{label}</strong>{label !== 'Full name' && <small>{label === 'Title' ? 'Your job title or role' : 'One word, like a nickname or first name'}</small>}</span><input defaultValue={value} /></div>)}</div><h2>Workspace access</h2><div className="settings-card access-card"><span>Remove yourself from the workspace</span><button>Leave Workspace</button></div></main></div>
}

function LoginView({ onContinue, isLoading }: { onContinue: () => void; isLoading: boolean }) {
  return <main className="login-page"><div className="brand-mark"><Sparkles size={15} /> Pyramid</div><div className="login-card"><h1>Let&apos;s get back on track</h1><p>Enter your email below to login to your account.</p><button className="dark-button full" onClick={onContinue} disabled={isLoading}>{isLoading ? 'Starting session…' : 'Continue as Guest'}</button><button className="google-button" disabled><strong>G</strong> Login with Google</button></div><small>By clicking continue, you agree to<br />our <u>Terms of Service</u> and <u>Privacy<br />Policy</u></small></main>
}

export default function WorkspaceApp({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [screen, setScreen] = useState<Screen>(initialAuthenticated ? 'tasks' : 'login')
  const [view, setView] = useState<View>('list')
  const [menu, setMenu] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [accent, setAccent] = useState<Accent>('black')
  const [fields, setFields] = useState<Record<string, boolean>>({ Status: true, Priority: true, Members: true, 'Due Date': true, Teams: false, Labels: false, Reporter: false })
  const [search, setSearch] = useState('')
  const [tasks, setTasks] = useState(seedTasks)
  const [isLoading, setIsLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/tasks', { credentials: 'include' }).then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load tasks'))).then((payload: { tasks: Array<{ id: number; title: string; status: Task['status']; priority: Priority; member: string; dueDate: string | null; labels: string[] }> }) => {
      if (!active || payload.tasks.length === 0) return
      const loadedTasks = payload.tasks.map((task) => ({ ...task, id: Number(task.id), date: task.dueDate ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today' }))
      setTasks(Array.from(new Map(loadedTasks.map((task) => [task.id, task])).values()))
    }).catch(() => undefined).finally(() => { if (active) setIsLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('pyramid-theme') as 'light' | 'dark' | null
    const savedAccent = window.localStorage.getItem('pyramid-accent') as Accent | null
    if (savedTheme) setTheme(savedTheme)
    if (savedAccent && accents.some((item) => item.id === savedAccent)) setAccent(savedAccent)
  }, [])

  useEffect(() => { window.localStorage.setItem('pyramid-theme', theme) }, [theme])
  useEffect(() => { window.localStorage.setItem('pyramid-accent', accent) }, [accent])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        const input = document.querySelector<HTMLInputElement>('.search-control input')
        input?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  const [selectedTask, setSelectedTask] = useState(seedTasks[0])
  const filteredTasks = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase())), [tasks, search])
  const addTask = async () => {
    const title = window.prompt('Task name', 'New task')?.trim()
    if (!title) return
    const optimistic: Task = { id: Date.now(), title, status: 'To Do', priority: 'Medium', member: 'Admin', date: 'Today', labels: ['New'] }
    setTasks((current) => [...current, optimistic])
    try {
      let response: Response
      try {
        response = await fetch('/api/tasks', { credentials: 'include', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, status: optimistic.status, priority: optimistic.priority, member: optimistic.member, labels: optimistic.labels }) })
      } catch {
        throw new Error('Cannot reach the Next.js server. Start it with npm run dev and open the same localhost URL.')
      }
      const payload = await response.json().catch(() => ({})) as { task?: { id: number; title: string; status: Task['status']; priority: Priority; member: string; dueDate: string | null; labels: string[] }; error?: string }
      if (!response.ok) throw new Error(payload.error ?? `Save failed (${response.status})`)
      if (!payload.task) throw new Error('The server did not return the saved task')
      setTasks((current) => {
        const saved = { ...optimistic, ...payload.task, id: Number(payload.task.id), date: payload.task.dueDate ?? 'Today' }
        return Array.from(new Map(current.filter((task) => task.id !== optimistic.id && task.id !== saved.id).concat(saved).map((task) => [task.id, task])).values())
      })
    } catch (error) {
      setTasks((current) => current.filter((task) => task.id !== optimistic.id))
      const message = error instanceof Error ? error.message : 'Unable to save task'
      window.alert(`Could not save this task. ${message}`)
    }
  }
  const selectTask = (task: Task) => { setSelectedTask(task); setScreen('detail') }
  const continueAsGuest = async () => {
    setLoginLoading(true)
    try {
      const response = await fetch('/api/session', { method: 'POST' })
      if (!response.ok) throw new Error('Unable to create session')
      setScreen('tasks')
    } finally {
      setLoginLoading(false)
    }
  }
  if (screen === 'login') return <LoginView onContinue={continueAsGuest} isLoading={loginLoading} />
  if (screen === 'settings') return <SettingsView setScreen={setScreen} />
  return <div className={`app-shell theme-${theme} accent-${accent}`}><Sidebar screen={screen} setScreen={setScreen} onProfile={() => setProfileOpen((open) => !open)} profileOpen={profileOpen} onCloseProfile={() => setProfileOpen(false)} onSettings={() => { setProfileOpen(false); setScreen('settings') }} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} /><div className="app-main"><Topbar screen={screen} setScreen={setScreen} view={view} setView={setView} onMenu={(next) => { if (next === 'add') { void addTask(); return } setMenu(next) }} search={search} setSearch={setSearch} />{screen === 'detail' ? <DetailView task={selectedTask} onBack={() => setScreen('tasks')} /> : screen === 'projects' ? <ProjectsView onSelect={() => setScreen('tasks')} /> : view === 'board' ? <TaskBoard tasks={filteredTasks} onSelect={selectTask} onAdd={addTask} /> : <TaskList tasks={filteredTasks} onSelect={selectTask} onAdd={addTask} />}{menu && <div className="popover-layer" onClick={() => setMenu('')}><div onClick={(event) => event.stopPropagation()}><MenuPopover type={menu} onClose={() => setMenu('')} view={view} setView={setView} setTheme={setTheme} theme={theme} fields={fields} setFields={setFields} /></div></div>}</div></div>
}
