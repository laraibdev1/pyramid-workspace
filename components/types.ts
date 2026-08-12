export type Screen = 'tasks' | 'projects' | 'detail' | 'settings' | 'login'
export type View = 'list' | 'board'
export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low'
export type Accent = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black'

export type Profile = {
  fullName: string
  title: string
  username: string
  email: string
}

export type Task = {
  id: number
  title: string
  status: 'To Do' | 'Doing' | 'Completed' | 'On Hold'
  priority: Priority
  member: string
  date: string
  labels: string[]
}

export type TaskFromApi = {
  id: number
  title: string
  status: Task['status']
  priority: Priority
  member: string
  dueDate: string | null
  labels: string[]
}
