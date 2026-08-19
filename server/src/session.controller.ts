import { Controller, Post, Get, Headers, UnauthorizedException } from '@nestjs/common'
import { randomUUID } from 'crypto'

const activeSessions = new Set<string>()

@Controller('session')
export class SessionController {
  @Post()
  createSession() {
    const token = randomUUID()
    activeSessions.add(token)
    return { authenticated: true, token }
  }

  @Get('verify')
  verifySession(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !activeSessions.has(token)) {
      throw new UnauthorizedException('Invalid session token')
    }
    return { valid: true }
  }
}