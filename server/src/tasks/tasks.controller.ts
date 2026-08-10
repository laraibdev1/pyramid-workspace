import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateTaskDto } from './create-task.dto'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list() { return this.tasksService.list() }

  @Post()
  create(@Body() input: CreateTaskDto) { return this.tasksService.create(input) }
}
