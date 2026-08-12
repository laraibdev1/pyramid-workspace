import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'

export const SESSION_COOKIE = 'pyramid_guest'

function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

/**
 * Mirrors lib/session.ts on the Next.js side: both apps share the same
 * `pyramid_guest` cookie, so a guest session started on the Next.js app
 * is honoured here too (CORS is configured with credentials: true).
 */
@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const value = readCookie(request.headers.cookie, SESSION_COOKIE)
    if (!value) throw new UnauthorizedException('Guest session required')
    return true
  }
}
