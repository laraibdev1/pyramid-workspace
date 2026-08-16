import { CalendarDays, Grid2X2, Plus, Tag } from 'lucide-react'
import { statuses } from './data'
import { TaskActionsMenu } from './task-actions-menu'
import type { Priority, Task } from './types'
import { Avatar } from './ui/avatar'

export function TaskBoard({
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
  onAdd: () => void
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
      </div>
    )
  }

  return (
    <div className="content-scroll">
      <div className="page-heading">
        <h1>Tasks</h1>
        <span className="muted-count">Board view</span>
      </div>
      <div className="board-scroll">
        <div className="board">
        {statuses.map((status) => (
          <section className="board-column" key={status}>
            <div className="column-title">
              <span>
                <Grid2X2 size={13} /> {status}
              </span>
              <button className="icon-button" aria-label="Add task" onClick={onAdd}>
                <Plus size={15} />
              </button>
            </div>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div className="task-card" key={task.id} role="button" tabIndex={0} onClick={() => onSelect(task)}>
                  <div className="card-title">
                    {task.title}
                    <TaskActionsMenu task={task} onChangeStatus={onChangeStatus} onChangePriority={onChangePriority} onDelete={onDelete} />
                  </div>
                  <div className="card-meta">
                    <Avatar name={task.member} />
                    <span>{task.member}</span>
                    <span className="card-date">
                      <CalendarDays size={13} /> {task.date}
                    </span>
                  </div>
                  <div className="label-list">
                    {task.labels.map((label, index) => (
                      <span className="label" key={`${label}-${index}`}>
                        <Tag size={12} /> {label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            {tasks.filter((task) => task.status === status).length === 0 && <p className="column-empty">No tasks</p>}
            <button className="add-card" onClick={onAdd}>
              <Plus size={14} /> Add Task
            </button>
          </section>
        ))}
        </div>
      </div>
    </div>
  )
}
