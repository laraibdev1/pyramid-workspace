import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()

    // 1. Check for Bearer token in headers
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
        return true
      }
    }

    // 2. Safely check cookies (handles cases where cookie-parser might be missing)
    const cookies = request.cookies || {}
    const sessionCookie = cookies.pyramid_guest || cookies.pyramid_session
    if (sessionCookie) {
      return true
    }

    // 3. Check for custom guest headers
    if (request.headers['x-guest-session']) {
      return true
    }

    // 4. Fallback for guest mode (allows guest users without kicking back to login)
    return true
  }
}