import type { Priority } from '../types'

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`priority priority-${priority.toLowerCase()}`}>
      <span className="priority-mark">▥</span>
      {priority}
    </span>
  )
}
