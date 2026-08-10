import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { desc } from 'drizzle-orm'
import { db } from '../../../lib/db'
import { tasks } from '../../../lib/db/schema'
import { CreateTaskDto } from './create-task.dto'

@Injectable()
export class TasksService {
  async list() {
    if (!process.env.DATABASE_URL) throw new ServiceUnavailableException('DATABASE_URL is not configured')
    return db.select().from(tasks).orderBy(desc(tasks.createdAt))
  }

  async create(input: CreateTaskDto) {
    if (!process.env.DATABASE_URL) throw new ServiceUnavailableException('DATABASE_URL is not configured')
    const [task] = await db.insert(tasks).values({
      title: input.title,
      status: input.status ?? 'To Do',
      priority: input.priority ?? 'Medium',
    }).returning()
    return task
  }
}
