import { hasGuestSession } from '@/lib/session'
import { supabaseConfigured, supabaseRequest } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

type Context = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Context) {
  if (!(await hasGuestSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const taskId = Number(id)
  if (!Number.isInteger(taskId)) return Response.json({ error: 'Invalid task id' }, { status: 400 })
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!supabaseConfigured()) return Response.json({ error: 'Supabase environment variables are not configured' }, { status: 503 })
  const values = Object.fromEntries(Object.entries({
    title: typeof body?.title === 'string' ? body.title.trim() : undefined,
    status: typeof body?.status === 'string' ? body.status : undefined,
    priority: typeof body?.priority === 'string' ? body.priority : undefined,
    member: typeof body?.member === 'string' ? body.member : undefined,
    dueDate: typeof body?.dueDate === 'string' ? body.dueDate : undefined,
    labels: Array.isArray(body?.labels) ? body.labels.filter((label): label is string => typeof label === 'string') : undefined,
    updatedAt: new Date(),
  }).filter(([, value]) => value !== undefined))
  if (!Object.keys(values).length) return Response.json({ error: 'No changes supplied' }, { status: 400 })
  try {
    const payload = Object.fromEntries(Object.entries(values).map(([key, value]) => [key === 'dueDate' ? 'due_date' : key === 'updatedAt' ? 'updated_at' : key, value]))
    const rows = await supabaseRequest<Array<Record<string, unknown>>>(`tasks?id=eq.${taskId}`, { method: 'PATCH', body: JSON.stringify(payload) })
    if (!rows[0]) return Response.json({ error: 'Task not found' }, { status: 404 })
    return Response.json({ task: rows[0] })
  } catch (error) {
    console.error('[v0] PATCH /api/tasks/:id failed', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to update task' }, { status: 503 })
  }
}

export async function DELETE(_: Request, { params }: Context) {
  if (!(await hasGuestSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const taskId = Number(id)
  if (!Number.isInteger(taskId)) return Response.json({ error: 'Invalid task id' }, { status: 400 })
  if (!supabaseConfigured()) return Response.json({ error: 'Supabase environment variables are not configured' }, { status: 503 })
  try {
    const rows = await supabaseRequest<Array<Record<string, unknown>>>(`tasks?id=eq.${taskId}`, { method: 'DELETE' })
    if (!rows[0]) return Response.json({ error: 'Task not found' }, { status: 404 })
    return Response.json({ deleted: true })
  } catch (error) {
    console.error('[v0] DELETE /api/tasks/:id failed', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Unable to delete task' }, { status: 503 })
  }
}
