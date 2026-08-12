import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { supabaseConfigured, supabaseRequest } from '../../../lib/supabase-admin'
import { toTask } from '../../../lib/task-mapper'
import { CreateTaskDto } from './create-task.dto'
import { UpdateTaskDto } from './update-task.dto'

function assertConfigured() {
  if (!supabaseConfigured()) {
    throw new ServiceUnavailableException('Supabase environment variables are not configured')
  }
}

@Injectable()
export class TasksService {
  async list() {
    assertConfigured()
    const rows = await supabaseRequest<Array<Record<string, unknown>>>('tasks?select=*&order=created_at.desc')
    return rows.map(toTask)
  }

  async findOne(id: number) {
    assertConfigured()
    const rows = await supabaseRequest<Array<Record<string, unknown>>>(`tasks?id=eq.${id}&select=*`)
    if (!rows[0]) throw new NotFoundException(`Task ${id} not found`)
    return toTask(rows[0])
  }

  async create(input: CreateTaskDto) {
    assertConfigured()
    const rows = await supabaseRequest<Array<Record<string, unknown>>>('tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: input.title,
        status: input.status ?? 'To Do',
        priority: input.priority ?? 'Medium',
        member: input.member ?? 'Admin',
        due_date: input.dueDate ?? null,
        labels: input.labels ?? [],
      }),
    })
    return toTask(rows[0])
  }

  async update(id: number, input: UpdateTaskDto) {
    assertConfigured()
    const payload = Object.fromEntries(
      Object.entries({
        title: input.title,
        status: input.status,
        priority: input.priority,
        member: input.member,
        due_date: input.dueDate,
        labels: input.labels,
        updated_at: new Date().toISOString(),
      }).filter(([, value]) => value !== undefined),
    )
    const rows = await supabaseRequest<Array<Record<string, unknown>>>(`tasks?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
    if (!rows[0]) throw new NotFoundException(`Task ${id} not found`)
    return toTask(rows[0])
  }

  async remove(id: number) {
    assertConfigured()
    const rows = await supabaseRequest<Array<Record<string, unknown>>>(`tasks?id=eq.${id}`, { method: 'DELETE' })
    if (!rows[0]) throw new NotFoundException(`Task ${id} not found`)
    return { deleted: true }
  }
}
