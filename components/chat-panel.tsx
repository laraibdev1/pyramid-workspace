'use client'

import { Loader2, Send, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { apiUrl } from '@/lib/api-client'

type ChatEntry = { role: 'user' | 'assistant'; text: string; actions?: string[] }

export function ChatPanel({ onTasksChanged }: { onTasksChanged: () => void }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const message = input.trim()
    if (!message || loading) return
    setInput('')
    setEntries((current) => [...current, { role: 'user', text: message }])
    setLoading(true)
    try {
      const response = await fetch(apiUrl('/api/chat'), {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const payload = (await response.json().catch(() => ({}))) as { reply?: string; actions?: string[]; message?: string }
      if (!response.ok) throw new Error(payload.message ?? `Chat failed (${response.status})`)
      setEntries((current) => [...current, { role: 'assistant', text: payload.reply || '(no reply)', actions: payload.actions }])
      if (payload.actions && payload.actions.length > 0) onTasksChanged()
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Something went wrong'
      setEntries((current) => [...current, { role: 'assistant', text: `⚠️ ${text}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen((value) => !value)} aria-label="AI assistant">
        <Sparkles size={18} />
      </button>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <span>
              <Sparkles size={14} /> Assistant
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X size={15} />
            </button>
          </div>
          <div className="chat-body">
            {entries.length === 0 && (
              <p className="chat-empty">Try: &ldquo;Create a task called Review launch checklist, High priority&rdquo;</p>
            )}
            {entries.map((entry, index) => (
              <div className={`chat-bubble chat-${entry.role}`} key={index}>
                <p>{entry.text}</p>
                {entry.actions && entry.actions.length > 0 && (
                  <ul className="chat-actions">
                    {entry.actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-assistant chat-loading">
                <Loader2 size={14} className="spin" /> Thinking…
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && send()}
              placeholder="Ask the assistant…"
              disabled={loading}
            />
            <button onClick={send} disabled={loading || !input.trim()} aria-label="Send">
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
