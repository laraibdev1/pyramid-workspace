import { hasGuestSession } from '@/lib/session'
import { supabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

const databaseConfigured = supabaseConfigured

function toTask(row: Record<string, unknown>) {
  return { id: row.id, title: row.title, status: row.status, priority: row.priority, member: row.member, dueDate: row.due_date ?? null, labels: row.labels ?? [], createdAt: row.created_at, updatedAt: row.updated_at }
}

export async function GET() {
  if (!(await hasGuestSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!databaseConfigured()) return Response.json({ error: 'Database connection is not configured' }, { status: 503 })
  try {
    const result = await supabaseRequest<Array<Record<string, unknown>>>('tasks?select=*&order=created_at.desc')
    return Response.json({ tasks: result.map(toTask) })
  } catch (error) {
    console.error('[v0] GET /api/tasks failed', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to read tasks' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  if (!(await hasGuestSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title) return Response.json({ error: 'Title is required' }, { status: 400 })
  if (!databaseConfigured()) return Response.json({ error: 'Database connection is not configured' }, { status: 503 })

  try {
    const rows = await supabaseRequest<Array<Record<string, unknown>>>('tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        status: typeof body?.status === 'string' ? body.status : 'To Do',
        priority: typeof body?.priority === 'string' ? body.priority : 'Medium',
        member: typeof body?.member === 'string' ? body.member : 'Admin',
        due_date: typeof body?.dueDate === 'string' ? body.dueDate : null,
        labels: Array.isArray(body?.labels) ? body.labels.filter((label): label is string => typeof label === 'string') : ['New'],
      }),
    })
    return Response.json({ task: toTask(rows[0]) }, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/tasks failed', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to save task' }, { status: 503 })
  }
}
