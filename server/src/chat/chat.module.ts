import { Module } from '@nestjs/common'
import { TasksModule } from '../tasks/tasks.module'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'

@Module({
  imports: [TasksModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
