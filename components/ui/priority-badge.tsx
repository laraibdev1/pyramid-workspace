import type { Priority } from '../types'

function Bars({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="9" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="6.5" y="5" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="12" y="1" width="3" height="14" rx="1" fill="currentColor" />
    </svg>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`priority priority-${priority.toLowerCase()}`}>
      <Bars />
      {priority}
    </span>
  )
}
