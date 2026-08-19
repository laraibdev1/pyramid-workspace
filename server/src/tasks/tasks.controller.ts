import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { SessionGuard } from '../common/session.guard'
import { CreateTaskDto } from './create-task.dto'
import { TasksService } from './tasks.service'
import { UpdateTaskDto } from './update-task.dto'

@Controller('tasks')
@UseGuards(SessionGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async list() {
    const tasks = await this.tasksService.list()
    return { tasks }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findOne(id)
    return { task }
  }

  @Post()
  async create(@Body() input: CreateTaskDto) {
    const task = await this.tasksService.create(input)
    return { task }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() input: UpdateTaskDto) {
    const task = await this.tasksService.update(id, input)
    return { task }
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id)
  }
}