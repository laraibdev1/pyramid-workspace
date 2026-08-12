export function toTask(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    member: row.member,
    dueDate: row.due_date ?? null,
    labels: row.labels ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
