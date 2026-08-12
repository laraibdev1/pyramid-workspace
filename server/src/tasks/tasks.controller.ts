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
  list() {
    return this.tasksService.list()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id)
  }

  @Post()
  create(@Body() input: CreateTaskDto) {
    return this.tasksService.create(input)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() input: UpdateTaskDto) {
    return this.tasksService.update(id, input)
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id)
  }
}
