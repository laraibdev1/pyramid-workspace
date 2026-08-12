import { Controller, Get } from '@nestjs/common'
import { supabaseConfigured, supabaseRequest } from '../../../lib/supabase-admin'

@Controller('health')
export class HealthController {
  @Get()
  async check() {
    const databaseConfigured = supabaseConfigured()
    if (!databaseConfigured) {
      return { status: 'ok', databaseConfigured: false, timestamp: new Date().toISOString() }
    }
    try {
      const rows = await supabaseRequest<Array<Record<string, unknown>>>('tasks?select=id&limit=1')
      return { status: 'ok', databaseConfigured: true, tasksReachable: Array.isArray(rows), timestamp: new Date().toISOString() }
    } catch (error) {
      return {
        status: 'degraded',
        databaseConfigured: true,
        error: error instanceof Error ? error.message : 'Supabase request failed',
        timestamp: new Date().toISOString(),
      }
    }
  }
}
