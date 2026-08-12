import { Plus } from 'lucide-react'
import { TaskActionsMenu } from './task-actions-menu'
import type { Priority, Task } from './types'
import { Avatar } from './ui/avatar'
import { PriorityBadge } from './ui/priority-badge'

export function TaskTable({
  tasks,
  onSelect,
  onAdd,
  onChangeStatus,
  onChangePriority,
  onDelete,
}: {
  tasks: Task[]
  onSelect: (task: Task) => void
  onAdd: () => void
  onChangeStatus: (id: number, status: Task['status']) => void
  onChangePriority: (id: number, priority: Priority) => void
  onDelete: (id: number) => void
}) {
  if (tasks.length === 0) {
    return (
      <div className="task-table">
        <div className="empty-row">Nothing here yet.</div>
        <button className="add-row" onClick={onAdd}>
          <Plus size={14} /> Add Task
        </button>
      </div>
    )
  }

  return (
    <div className="task-table">
      <div className="table-head">
        <span>Task</span>
        <span>Priority</span>
        <span>Members</span>
        <span>Due Date</span>
        <span>Actions</span>
      </div>
      {tasks.map((task) => (
        <div className="table-row" key={task.id} role="button" tabIndex={0} onClick={() => onSelect(task)}>
          <span className="task-name">{task.title}</span>
          <PriorityBadge priority={task.priority} />
          <span>
            <Avatar name={task.member} />
          </span>
          <span className="date-text">{task.date}</span>
          <TaskActionsMenu task={task} onChangeStatus={onChangeStatus} onChangePriority={onChangePriority} onDelete={onDelete} />
        </div>
      ))}
      <button className="add-row" onClick={onAdd}>
        <Plus size={14} /> Add Task
      </button>
    </div>
  )
}
