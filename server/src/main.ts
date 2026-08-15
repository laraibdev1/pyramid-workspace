import * as path from 'path'
import * as dotenv from 'dotenv'

// This MUST run before `import { AppModule }` below. AppModule transitively
// requires lib/supabase-admin.ts, which reads SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY
// at module-load time (not inside a function) — so if dotenv hasn't populated
// process.env yet by the time that require() happens, those reads see undefined
// permanently, even if dotenv.config() runs later in this file. TypeScript
// preserves the textual order of imports as require() calls in the compiled
// output, so keeping this block physically above the NestJS imports is what
// makes the ordering correct, not just "early in bootstrap()".
//
// Tries both .env.local (Next.js convention, and what .env.example documents)
// and .env, checked from both the working directory (npm run api:dev, invoked
// from the repo root) and relative to this file (the compiled dist/ output).
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

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Allow local dev (localhost:3000) AND the configured production origin at
  // the same time — previously this was origin: ALLOWED_ORIGIN || true, which
  // meant setting ALLOWED_ORIGIN for production silently blocked localhost too.
  const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
  if (process.env.ALLOWED_ORIGIN) allowedOrigins.push(process.env.ALLOWED_ORIGIN)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
  })

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  await app.listen(process.env.PORT || 4000)
}

void bootstrap()
