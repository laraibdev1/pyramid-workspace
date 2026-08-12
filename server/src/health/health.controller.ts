import { Controller, Get } from '@nestjs/common'
import { sql } from 'drizzle-orm'
import { db } from '../../../lib/db'

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    const databaseConfigured = Boolean(process.env.DATABASE_URL)
    if (!databaseConfigured) {
      return { status: 'ok', databaseConfigured: false, timestamp: new Date().toISOString() }
    }
    try {
      const result = await db.execute(sql`SELECT NOW() AS now, to_regclass('public.tasks') AS tasks_table`)
      return { status: 'ok', databaseConfigured: true, database: result.rows[0], timestamp: new Date().toISOString() }
    } catch (error) {
      return {
        status: 'degraded',
        databaseConfigured: true,
        error: error instanceof Error ? error.message : 'Database query failed',
        timestamp: new Date().toISOString(),
      }
    }
  }
}
