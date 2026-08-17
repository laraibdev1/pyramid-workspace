import { ChevronDown } from 'lucide-react'
import { statuses } from './data'
import { TaskTable } from './task-table'
import type { Priority, Task } from './types'

export function TaskList({
  tasks,
  onSelect,
  onAdd,
  onChangeStatus,
  onChangePriority,
  onDelete,
  isLoading,
}: {
  tasks: Task[]
  onSelect: (task: Task) => void
  onAdd: (status?: Task['status']) => void
  onChangeStatus: (id: number, status: Task['status']) => void
  onChangePriority: (id: number, priority: Priority) => void
  onDelete: (id: number) => void
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="content-scroll">
        <div className="page-heading">
          <h1>Tasks</h1>
        </div>
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="content-scroll">
        <div className="page-heading">
          <h1>Tasks</h1>
          <span className="muted-count">0 tasks</span>
        </div>
        <div className="empty-state">
          <p>No tasks match your search or filters.</p>
          <button className="dark-button" onClick={() => onAdd()}>
            Add your first task
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="content-scroll">
      <div className="page-heading">
        <h1>Tasks</h1>
        <span className="muted-count">{tasks.length} tasks</span>
      </div>
      {statuses.map((status) => {
        const filtered = tasks.filter((task) => task.status === status)
        return (
          <section className="task-group" key={status}>
            <button className="group-title">
              <ChevronDown size={14} /> {status} <span>{filtered.length}</span>
            </button>
            <TaskTable
              tasks={filtered}
              onSelect={onSelect}
              onAdd={() => onAdd(status)}
              onChangeStatus={onChangeStatus}
              onChangePriority={onChangePriority}
              onDelete={onDelete}
            />
          </section>
        )
      })}
    </div>
  )
}
