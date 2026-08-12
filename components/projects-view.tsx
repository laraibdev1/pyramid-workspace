import { Plus } from 'lucide-react'
import type { Priority } from './types'
import { Avatar } from './ui/avatar'
import { PriorityBadge } from './ui/priority-badge'

export type Project = { title: string; priority: Priority; lead: string; date: string }

export function ProjectsView({
  projects,
  onSelect,
  onAdd,
}: {
  projects: Project[]
  onSelect: () => void
  onAdd: () => void
}) {
  return (
    <div className="content-scroll">
      <div className="page-heading">
        <h1>Projects</h1>
        <span className="muted-count">{projects.length} projects</span>
      </div>
      <div className="task-table project-table">
        <div className="table-head">
          <span>Projects</span>
          <span>Priority</span>
          <span>Lead</span>
          <span>Due Date</span>
          <span>Actions</span>
        </div>
        {projects.length === 0 ? (
          <div className="empty-row">No projects yet.</div>
        ) : (
          projects.map((project) => (
            <button className="table-row" key={project.title} onClick={onSelect}>
              <span className="task-name">{project.title}</span>
              <PriorityBadge priority={project.priority} />
              <span>
                <Avatar name={project.lead} />
              </span>
              <span className="date-text">{project.date}</span>
              <span />
            </button>
          ))
        )}
        <button className="add-row" onClick={onAdd}>
          <Plus size={14} /> Add Projects
        </button>
      </div>
    </div>
  )
}
