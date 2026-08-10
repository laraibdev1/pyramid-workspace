"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.bigint)('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    title: (0, pg_core_1.text)('title').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('To Do'),
    priority: (0, pg_core_1.text)('priority').notNull().default('Medium'),
    member: (0, pg_core_1.text)('member').notNull().default('Admin'),
    dueDate: (0, pg_core_1.date)('due_date'),
    labels: (0, pg_core_1.jsonb)('labels').$type().notNull().default([]),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
//# sourceMappingURL=schema.js.map