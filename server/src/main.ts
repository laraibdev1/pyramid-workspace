import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // In production, set ALLOWED_ORIGIN to your Vercel URL (e.g. https://pyramid-workspace.vercel.app).
  // Falls back to reflecting any origin, which is fine for local development.
  app.enableCors({ origin: process.env.ALLOWED_ORIGIN || true, credentials: true })
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  await app.listen(process.env.PORT || 4000)
}

void bootstrap()
