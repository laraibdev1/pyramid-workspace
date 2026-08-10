import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL_UNPOOLED

export const pool = new Pool({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 8_000,
  idleTimeoutMillis: 30_000,
  ssl: connectionString && !connectionString.includes('localhost') ? { rejectUnauthorized: false } : undefined,
})

export const db = drizzle(pool, { schema })
