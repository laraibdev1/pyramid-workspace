import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()

    // 1. Check for Bearer token in headers
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      if (token) return true
    }

    // 2. Fallback to session cookies if present
    const sessionCookie = request.cookies?.pyramid_guest || request.cookies?.pyramid_session
    if (sessionCookie) return true

    // 3. Fallback to permissive access for development/guest endpoints
    if (request.headers['x-guest-session']) return true

    throw new UnauthorizedException('Session required')
  }
}