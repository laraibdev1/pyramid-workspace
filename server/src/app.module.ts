import { Module } from '@nestjs/common'
import { ChatModule } from './chat/chat.module'
import { HealthController } from './health/health.controller'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [TasksModule, ChatModule],
  controllers: [HealthController],
})
export class AppModule {}
