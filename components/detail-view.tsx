import {
  Archive,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Ellipsis,
  Eye,
  Link2,
  MessageCircle,
  Paperclip,
  Plus,
  Settings,
  Share2,
  Tag,
} from 'lucide-react'
import { priorities } from './data'
import type { Task } from './types'
import { Avatar } from './ui/avatar'
import { IconButton } from './ui/icon-button'
import { PriorityBadge } from './ui/priority-badge'

const SUBTASK_ITEMS = ['Subtask 1', 'Subtask 2', 'Subtask 3']
const SUBTASK_DATES = ['12 Sep 2026', '15 Sep 2026', '18 Sep 2026']
const LABELS = ['Research', 'Design', 'Development', 'Testing', 'Deployment']
const DETAIL_ROWS: [string, string][] = [
  ['Status', '● Backlog'],
  ['Priority', '▥ High'],
  ['Members', 'Add members'],
  ['Dates', 'Jan 10 → End'],
  ['Labels', 'Add labels'],
  ['Teams', 'Add teams'],
  ['Reporter', 'Add reporter'],
]

export function DetailView({ task, onBack }: { task: Task; onBack: () => void }) {
  return (
    <div className="content-scroll detail-scroll">
      <div className="detail-header">
        <div>
          <button className="detail-back" onClick={onBack}>
            <ChevronLeft size={15} /> Tasks
          </button>
          <h1>{task.title}</h1>
          <p>Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.</p>
        </div>
        <div className="detail-actions">
          <IconButton label="Lock"><Archive size={16} /></IconButton>
          <IconButton label="Watch"><Eye size={16} /></IconButton>
          <IconButton label="Share"><Share2 size={16} /></IconButton>
          <IconButton label="More"><Ellipsis size={16} /></IconButton>
        </div>
      </div>
      <div className="detail-layout">
        <main>
          <div className="detail-properties">
            <strong>Properties</strong>
            <span className="member-pill">
              <Avatar name="Designer" /> Designer
            </span>
            <span className="date-pill">
              <CalendarDays size={13} /> 31 Jul
            </span>
          </div>
          <div className="detail-properties">
            <strong>Labels</strong>
            {LABELS.map((label) => (
              <span className="label" key={label}>
                <Tag size={12} /> {label}
              </span>
            ))}
          </div>
          <div className="detail-properties">
            <strong>Resources</strong>
            <span className="muted-inline">
              <Link2 size={14} /> Add document or link...
            </span>
          </div>
          <h2 className="section-title">
            <ChevronDown size={14} /> Subtasks
          </h2>
          <div className="subtask-table">
            <div className="subtask-head">
              <span>Task</span>
              <span>Priority</span>
              <span>Members</span>
              <span>Due Date</span>
              <span>Actions</span>
            </div>
            {SUBTASK_ITEMS.map((item, index) => (
              <div className="subtask-row" key={item}>
                <span>{item}</span>
                <PriorityBadge priority={priorities[index + 1]} />
                <Avatar name={index === 0 ? 'Admin' : index === 1 ? 'CN' : '+'} />
                <span>{SUBTASK_DATES[index]}</span>
                <Ellipsis size={15} />
              </div>
            ))}
            <button className="add-row">
              <Plus size={14} /> Add Subtasks
            </button>
          </div>
          <h2 className="section-title">Subtasks</h2>
          <div className="comment-box">
            <div className="comment-header">
              <Avatar name="Admin" />
              <strong>Ankit Dutta</strong>
              <span>just now</span>
              <Ellipsis size={15} />
            </div>
            <p>dsds</p>
            <div className="reply-row">
              <Avatar name="Admin" />
              <span>Leave a reply...</span>
              <Paperclip size={15} />
              <MessageCircle size={15} />
            </div>
          </div>
          <div className="comment-input">
            Add a comment... <Paperclip size={15} /> <MessageCircle size={15} />
          </div>
        </main>
        <aside className="details-panel">
          <div className="panel-card">
            <div className="panel-title">
              Details <Plus size={15} /> <Settings size={15} />
            </div>
            {DETAIL_ROWS.map(([label, value]) => (
              <div className="property-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="panel-card updates">
            <div className="panel-title">Updates</div>
            <div className="update">
              <Avatar name="Admin" />
              <span>
                <strong>You</strong> changed priority from No priority to Urgent
              </span>
            </div>
            <div className="update">
              <Avatar name="Admin" />
              <span>
                <strong>You</strong> posted an update · Aug 2026
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
