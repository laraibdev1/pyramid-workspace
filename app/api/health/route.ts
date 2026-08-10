import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  const configured = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL_UNPOOLED)
  if (!configured) return Response.json({ ok: false, configured: false, error: 'No database connection string configured' }, { status: 503 })
  try {
    const result = await db.execute(sql`SELECT NOW() AS now, to_regclass('public.tasks') AS tasks_table`)
    return Response.json({ ok: true, configured: true, database: result.rows[0] })
  } catch (error) {
    return Response.json({ ok: false, configured: true, error: error instanceof Error ? error.message : 'Database query failed' }, { status: 503 })
  }
}
