'use client'

import { Check, Ellipsis, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { priorities, statuses } from './data'
import type { Priority, Task } from './types'

export function TaskActionsMenu({
  task,
  onChangeStatus,
  onChangePriority,
  onDelete,
}: {
  task: Task
  onChangeStatus: (id: number, status: Task['status']) => void
  onChangePriority: (id: number, priority: Priority) => void
  onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState<'menu' | 'status' | 'priority' | null>(null)

  return (
    <span className="row-actions" onClick={(event) => event.stopPropagation()}>
      <button
        className="icon-button"
        aria-label="Task actions"
        onClick={() => setOpen(open ? null : 'menu')}
      >
        <Ellipsis size={15} />
      </button>
      {open === 'menu' && (
        <div className="row-actions-popover popover">
          <button className="menu-row" onClick={() => setOpen('status')}>
            Change status
          </button>
          <button className="menu-row" onClick={() => setOpen('priority')}>
            Change priority
          </button>
          <button className="menu-row danger" onClick={() => { setOpen(null); onDelete(task.id) }}>
            <Trash2 size={14} /> Delete task
          </button>
        </div>
      )}
      {open === 'status' && (
        <div className="row-actions-popover popover">
          {statuses.map((status) => (
            <button className="menu-row" key={status} onClick={() => { setOpen(null); onChangeStatus(task.id, status) }}>
              {status} {task.status === status && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
      {open === 'priority' && (
        <div className="row-actions-popover popover">
          {priorities.map((priority) => (
            <button className="menu-row" key={priority} onClick={() => { setOpen(null); onChangePriority(task.id, priority) }}>
              {priority} {task.priority === priority && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </span>
  )
}
