import { Module } from '@nestjs/common'
import { HealthController } from './health/health.controller'
import { SessionController } from './session.controller'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [TasksModule],
  controllers: [HealthController, SessionController],
})
export class AppModule {}