import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { tasks } from '../../../lib/db/schema'
import { CreateTaskDto } from './create-task.dto'
import { UpdateTaskDto } from './update-task.dto'

function assertDbConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new ServiceUnavailableException('DATABASE_URL is not configured')
  }
}

@Injectable()
export class TasksService {
  async list() {
    assertDbConfigured()
    return db.select().from(tasks).orderBy(desc(tasks.createdAt))
  }

  async findOne(id: number) {
    assertDbConfigured()
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
    if (!task) throw new NotFoundException(`Task ${id} not found`)
    return task
  }

  async create(input: CreateTaskDto) {
    assertDbConfigured()
    const [task] = await db
      .insert(tasks)
      .values({
        title: input.title,
        status: input.status ?? 'To Do',
        priority: input.priority ?? 'Medium',
        member: input.member ?? 'Admin',
        dueDate: input.dueDate ?? null,
        labels: input.labels ?? [],
      })
      .returning()
    return task
  }

  async update(id: number, input: UpdateTaskDto) {
    assertDbConfigured()
    await this.findOne(id)
    const [task] = await db
      .update(tasks)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning()
    return task
  }

  async remove(id: number) {
    assertDbConfigured()
    await this.findOne(id)
    await db.delete(tasks).where(eq(tasks.id, id))
    return { deleted: true }
  }
}
