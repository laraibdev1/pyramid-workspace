import { Controller, Post, Delete, Res } from '@nestjs/common'
import { Response } from 'express'
import { randomUUID } from 'crypto'

@Controller('session')
export class SessionController {
  @Post()
  createSession(@Res({ passthrough: true }) response: Response) {
    const sessionId = randomUUID()

    // Set cookie AND return token so both local & deployed environments work
    response.cookie('pyramid_guest', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })

    return { authenticated: true, token: sessionId }
  }

  @Delete()
  clearSession(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('pyramid_guest')
    return { authenticated: false }
  }
}