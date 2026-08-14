import { Check, Grid2X2, LayoutList, Moon, Sun } from 'lucide-react'
import { priorities, statuses } from './data'
import type { Priority, View } from './types'

const FIELD_NAMES = ['Priority', 'Members', 'Due Date', 'Labels', 'Status', 'Reporter']

export function MenuPopover({
  type,
  onClose,
  view,
  setView,
  setTheme,
  theme,
  fields,
  setFields,
  activeStatuses,
  toggleStatus,
  activePriorities,
  togglePriority,
  clearFilters,
}: {
  type: string
  onClose: () => void
  view: View
  setView: (view: View) => void
  setTheme: (theme: 'light' | 'dark') => void
  theme: 'light' | 'dark'
  fields: Record<string, boolean>
  setFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  activeStatuses: Set<string>
  toggleStatus: (status: string) => void
  activePriorities: Set<Priority>
  togglePriority: (priority: Priority) => void
  clearFilters: () => void
}) {
  if (!type) return null

  if (type === 'fields') {
    return (
      <div className="popover fields-popover">
        <div className="segmented">
          <button className={view === 'list' ? 'active' : ''} onClick={() => { setView('list'); onClose() }}>
            <LayoutList size={14} /> List
          </button>
          <button className={view === 'board' ? 'active' : ''} onClick={() => { setView('board'); onClose() }}>
            <Grid2X2 size={14} /> Board
          </button>
        </div>
        {FIELD_NAMES.map((field) => (
          <button className="check-row" key={field} onClick={() => setFields((current) => ({ ...current, [field]: !current[field] }))}>
            <span>{field}</span>
            <span className={`check-box ${fields[field] ? 'checked' : ''}`}>{fields[field] && <Check size={12} />}</span>
          </button>
        ))}
      </div>
    )
  }

  if (type === 'filter') {
    const activeCount = activeStatuses.size + activePriorities.size
    return (
      <div className="popover filter-popover">
        <p className="popover-kicker">Status</p>
        {statuses.map((status) => (
          <button className="check-row" key={status} onClick={() => toggleStatus(status)}>
            <span>{status}</span>
            <span className={`check-box ${activeStatuses.has(status) ? 'checked' : ''}`}>{activeStatuses.has(status) && <Check size={12} />}</span>
          </button>
        ))}
        <p className="popover-kicker">Priority</p>
        {priorities.map((priority) => (
          <button className="check-row" key={priority} onClick={() => togglePriority(priority)}>
            <span>{priority}</span>
            <span className={`check-box ${activePriorities.has(priority) ? 'checked' : ''}`}>{activePriorities.has(priority) && <Check size={12} />}</span>
          </button>
        ))}
        {activeCount > 0 && (
          <button className="menu-row clear-filters" onClick={clearFilters}>
            Clear filters ({activeCount})
          </button>
        )}
      </div>
    )
  }

  if (type === 'theme') {
    return (
      <div className="popover theme-popover">
        <p className="popover-kicker">Theme</p>
        <button className="menu-row" onClick={() => { setTheme('light'); onClose() }}>
          <Sun size={15} /> Light {theme === 'light' && <Check size={14} />}
        </button>
        <button className="menu-row" onClick={() => { setTheme('dark'); onClose() }}>
          <Moon size={15} /> Dark {theme === 'dark' && <Check size={14} />}
        </button>
      </div>
    )
  }

  return null
}
