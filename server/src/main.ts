import * as path from 'path'
import * as dotenv from 'dotenv'

// Early environment variable loading
for (const candidate of [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env.local'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env.local'),
  path.resolve(__dirname, '../../../.env'),
]) {
  dotenv.config({ path: candidate, override: false })
}

import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// CommonJS require fallback to bypass ES module import errors in TypeScript
const cookieParser = require('cookie-parser')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 1. Enable cookie-parser middleware before CORS
  app.use(cookieParser())

  // 2. Allow Localhost, Vercel deployments, and custom ALLOWED_ORIGIN
  const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/
  const vercelPattern = /^https:\/\/.*\.vercel\.app$/

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        localhostPattern.test(origin) ||
        vercelPattern.test(origin) ||
        origin === process.env.ALLOWED_ORIGIN
      ) {
        return callback(null, true)
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
  })

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  await app.listen(process.env.PORT || 4000)
}

void bootstrap()