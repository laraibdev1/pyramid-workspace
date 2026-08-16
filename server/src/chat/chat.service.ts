import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import { TasksService } from '../tasks/tasks.service'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MAX_TOOL_TURNS = 5

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'list_tasks',
      description: 'List all tasks in the workspace, with their id, title, status, and priority.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_task',
      description: 'Create a new task.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          status: { type: 'string', enum: ['To Do', 'Doing', 'Completed', 'On Hold'] },
          priority: { type: 'string', enum: ['Urgent', 'High', 'Medium', 'Low'] },
        },
        required: ['title'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_task',
      description: "Update a task's status or priority. Use list_tasks first if you don't already know the task id.",
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          status: { type: 'string', enum: ['To Do', 'Doing', 'Completed', 'On Hold'] },
          priority: { type: 'string', enum: ['Urgent', 'High', 'Medium', 'Low'] },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_task',
      description: "Permanently delete a task. Use list_tasks first if you don't already know the task id.",
      parameters: { type: 'object', properties: { id: { type: 'number' } }, required: ['id'], additionalProperties: false },
    },
  },
]

const SYSTEM_PROMPT =
  'You are the assistant inside a task management app called Pyramid Workspace. ' +
  'Help the user manage their tasks using the available tools. Be concise. ' +
  'When you take an action (create/update/delete), briefly confirm what you did.'

type ChatMessage = { role: string; content: string | null; tool_calls?: unknown[]; tool_call_id?: string; name?: string }

@Injectable()
export class ChatService {
  constructor(private readonly tasksService: TasksService) {}

  async send(message: string) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new ServiceUnavailableException('GROQ_API_KEY is not configured')
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ]
    const actions: string[] = []

    for (let turn = 0; turn < MAX_TOOL_TURNS; turn++) {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, tools: TOOLS, tool_choice: 'auto' }),
      })
      if (!response.ok) {
        const detail = await response.text().catch(() => response.statusText)
        throw new ServiceUnavailableException(`Groq request failed: ${detail}`)
      }
      const payload = await response.json()
      const choice = payload.choices?.[0]?.message
      if (!choice) throw new ServiceUnavailableException('Groq returned an unexpected response')

      const toolCalls = choice.tool_calls as Array<{ id: string; function: { name: string; arguments: string } }> | undefined
      if (!toolCalls || toolCalls.length === 0) {
        return { reply: choice.content ?? '', actions }
      }

      messages.push({ role: 'assistant', content: choice.content ?? null, tool_calls: toolCalls })
      for (const call of toolCalls) {
        const result = await this.runTool(call.function.name, safeParse(call.function.arguments), actions)
        messages.push({ role: 'tool', tool_call_id: call.id, name: call.function.name, content: JSON.stringify(result) })
      }
    }

    return { reply: "I took a few actions but I'm not fully done — try asking me to continue.", actions }
  }

  private async runTool(name: string, args: Record<string, unknown>, actions: string[]) {
    try {
      switch (name) {
        case 'list_tasks': {
          const tasks = await this.tasksService.list()
          return { tasks: tasks.map((t: any) => ({ id: t.id, title: t.title, status: t.status, priority: t.priority })) }
        }
        case 'create_task': {
          const task = await this.tasksService.create(args as any)
          actions.push(`Created "${(task as any).title}"`)
          return { task }
        }
        case 'update_task': {
          const { id, ...rest } = args as { id: number; [key: string]: unknown }
          const task = await this.tasksService.update(id, rest as any)
          actions.push(`Updated task #${id}`)
          return { task }
        }
        case 'delete_task': {
          const { id } = args as { id: number }
          await this.tasksService.remove(id)
          actions.push(`Deleted task #${id}`)
          return { deleted: true }
        }
        default:
          return { error: `Unknown tool: ${name}` }
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Tool call failed' }
    }
  }
}

function safeParse(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}
