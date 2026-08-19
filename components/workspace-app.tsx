'use client'

import { apiUrl } from '@/lib/api-client'
import { useEffect, useMemo, useState } from 'react'
import { accents, projects as seedProjects, seedTasks } from './data'
import { DetailView } from './detail-view'
import { LoginView } from './login-view'
import { MenuPopover } from './menu-popover'
import type { Project } from './projects-view'
import { ProjectsView } from './projects-view'
import { SettingsView } from './settings-view'
import { Sidebar } from './sidebar'
import { TaskBoard } from './task-board'
import { TaskList } from './task-list'
import { Topbar } from './topbar'
import type { Accent, Priority, Profile, Screen, Task, TaskFromApi, View } from './types'

const DEFAULT_PROFILE: Profile = { fullName: 'Guest User', title: 'Team Member', username: 'guest', email: 'guest@pyramid.app' }

export default function WorkspaceApp({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [screen, setScreen] = useState<Screen>('login')
  const [view, setView] = useState<View>('list')
  const [menu, setMenu] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [accent, setAccent] = useState<Accent>('black')
  const [fields, setFields] = useState<Record<string, boolean>>({
    Priority: true,
    Members: true,
    'Due Date': true,
    Labels: false,
    Status: false,
    Reporter: false,
  })
  const [search, setSearch] = useState('')
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(new Set())
  const [activePriorities, setActivePriorities] = useState<Set<Priority>>(new Set())
  const [tasks, setTasks] = useState(seedTasks)
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [isLoading, setIsLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState(seedTasks[0])
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE)

  // Auto-authenticate on load if a guest token exists
  useEffect(() => {
    const isAuth = localStorage.getItem('pyramid_authenticated')
    if (isAuth === 'true' || initialAuthenticated) {
      setScreen('tasks')
    }
  }, [initialAuthenticated])

  // Fetch tasks with Bearer token header
  useEffect(() => {
    let active = true
    const token = typeof window !== 'undefined' ? localStorage.getItem('pyramid_token') : null

    fetch(apiUrl('/api/tasks'), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Failed to fetch tasks'))))
      .then((payload: { tasks: TaskFromApi[] }) => {
        if (!active || !payload?.tasks || payload.tasks.length === 0) return
        const loadedTasks = payload.tasks.map((task) => ({
          ...task,
          id: Number(task.id),
          date: task.dueDate ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Today',
        }))
        setTasks(Array.from(new Map(loadedTasks.map((task) => [task.id, task])).values()))
      })
      .catch(() => {
        // Fallback gracefully to local seed tasks on error—DO NOT kick back to login!
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [screen])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('pyramid-theme') as 'light' | 'dark' | null
    const savedAccent = window.localStorage.getItem('pyramid-accent') as Accent | null
    const savedProfile = window.localStorage.getItem('pyramid-profile')
    if (savedTheme) setTheme(savedTheme)
    if (savedAccent && accents.some((item) => item.id === savedAccent)) setAccent(savedAccent)
    if (savedProfile) {
      try { setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(savedProfile) }) } catch {}
    }
  }, [])

  useEffect(() => { window.localStorage.setItem('pyramid-theme', theme) }, [theme])
  useEffect(() => { window.localStorage.setItem('pyramid-accent', accent) }, [accent])
  useEffect(() => { window.localStorage.setItem('pyramid-profile', JSON.stringify(profile)) }, [profile])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
      if (activeStatuses.size > 0 && !activeStatuses.has(task.status)) return false
      if (activePriorities.size > 0 && !activePriorities.has(task.priority)) return false
      return true
    })
  }, [tasks, search, activeStatuses, activePriorities])

  const activeFilterCount = activeStatuses.size + activePriorities.size

  const toggleStatus = (status: string) => {
    setActiveStatuses((current) => {
      const next = new Set(current)
      next.has(status) ? next.delete(status) : next.add(status)
      return next
    })
  }

  const togglePriority = (priority: Priority) => {
    setActivePriorities((current) => {
      const next = new Set(current)
      next.has(priority) ? next.delete(priority) : next.add(priority)
      return next
    })
  }

  const clearFilters = () => { setActiveStatuses(new Set()); setActivePriorities(new Set()) }

  const addTask = async (status: Task['status'] = 'To Do') => {
    const title = window.prompt('Task name', 'New task')?.trim()
    if (!title) return
    const optimistic: Task = { id: Date.now(), title, status, priority: 'Medium', member: 'Admin', date: 'Today', labels: ['New'] }
    setTasks((current) => [...current, optimistic])
    try {
      const token = localStorage.getItem('pyramid_token')
      const response = await fetch(apiUrl('/api/tasks'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, status: optimistic.status, priority: optimistic.priority, member: optimistic.member, labels: optimistic.labels }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Save failed')
      if (payload.task) {
        setTasks((current) => {
          const saved = { ...optimistic, ...payload.task, id: Number(payload.task.id), date: payload.task.dueDate ?? 'Today' }
          return Array.from(new Map(current.filter((t) => t.id !== optimistic.id && t.id !== saved.id).concat(saved).map((t) => [t.id, t])).values())
        })
      }
    } catch {
      // Keep optimistic item in guest state on fail
    }
  }

  const addProject = () => {
    const title = window.prompt('Project name', 'New project')?.trim()
    if (!title) return
    setProjects((current) => [...current, { title, priority: 'Medium', lead: 'Admin', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }])
  }

  const patchTask = async (id: number, body: Record<string, unknown>) => {
    setTasks((current) => current.map((task) => (task.id === id ? ({ ...task, ...body } as Task) : task)))
    try {
      const token = localStorage.getItem('pyramid_token')
      await fetch(apiUrl(`/api/tasks/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      })
    } catch {}
  }

  const changeStatus = (id: number, status: Task['status']) => patchTask(id, { status })
  const changePriority = (id: number, priority: Priority) => patchTask(id, { priority })

  const deleteTask = async (id: number) => {
    if (!window.confirm('Delete this task?')) return
    setTasks((current) => current.filter((task) => task.id !== id))
    try {
      const token = localStorage.getItem('pyramid_token')
      await fetch(apiUrl(`/api/tasks/${id}`), {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch {}
  }

  const selectTask = (task: Task) => { setSelectedTask(task); setScreen('detail') }

  const continueAsGuest = async () => {
    setLoginLoading(true)
    try {
      const res = await fetch('/api/session', { method: 'POST' }).catch(() => null)
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data.token) localStorage.setItem('pyramid_token', data.token)
      }
    } finally {
      localStorage.setItem('pyramid_authenticated', 'true')
      setScreen('tasks')
      setLoginLoading(false)
    }
  }

  const leaveWorkspace = async () => {
    if (!window.confirm('Leave this workspace?')) return
    localStorage.removeItem('pyramid_authenticated')
    localStorage.removeItem('pyramid_token')
    setScreen('login')
    setProfileOpen(false)
  }

  if (screen === 'login') return <LoginView onContinue={continueAsGuest} isLoading={loginLoading} />
  if (screen === 'settings') return <SettingsView setScreen={setScreen} profile={profile} setProfile={setProfile} onLeaveWorkspace={leaveWorkspace} />

  return (
    <div className={`app-shell theme-${theme} accent-${accent}`}>
      <Sidebar
        screen={screen}
        setScreen={setScreen}
        onProfile={() => setProfileOpen((open) => !open)}
        profileOpen={profileOpen}
        onCloseProfile={() => setProfileOpen(false)}
        onSettings={() => { setProfileOpen(false); setScreen('settings') }}
        theme={theme}
        setTheme={setTheme}
        accent={accent}
        setAccent={setAccent}
        profile={profile}
      />
      <div className="app-main">
        <Topbar
          screen={screen}
          setScreen={setScreen}
          view={view}
          setView={setView}
          onMenu={setMenu}
          search={search}
          setSearch={setSearch}
          onAdd={screen === 'projects' ? addProject : addTask}
          activeFilterCount={activeFilterCount}
        />
        {screen === 'detail' ? (
          <DetailView task={selectedTask} onBack={() => setScreen('tasks')} />
        ) : screen === 'projects' ? (
          <ProjectsView projects={projects} onSelect={() => setScreen('tasks')} onAdd={addProject} />
        ) : view === 'board' ? (
          <TaskBoard
            tasks={filteredTasks}
            onSelect={selectTask}
            onAdd={addTask}
            onChangeStatus={changeStatus}
            onChangePriority={changePriority}
            onDelete={deleteTask}
            isLoading={isLoading}
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onSelect={selectTask}
            onAdd={addTask}
            onChangeStatus={changeStatus}
            onChangePriority={changePriority}
            onDelete={deleteTask}
            isLoading={isLoading}
          />
        )}
        {menu && (
          <div className="popover-layer" onClick={() => setMenu('')}>
            <div onClick={(e) => e.stopPropagation()}>
              <MenuPopover
                type={menu}
                onClose={() => setMenu('')}
                view={view}
                setView={setView}
                setTheme={setTheme}
                theme={theme}
                fields={fields}
                setFields={setFields}
                activeStatuses={activeStatuses}
                toggleStatus={toggleStatus}
                activePriorities={activePriorities}
                togglePriority={togglePriority}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}