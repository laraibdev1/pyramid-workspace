import { bigint, date, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const tasks = pgTable('tasks', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  status: text('status').notNull().default('To Do'),
  priority: text('priority').notNull().default('Medium'),
  member: text('member').notNull().default('Admin'),
  dueDate: date('due_date'),
  labels: jsonb('labels').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
