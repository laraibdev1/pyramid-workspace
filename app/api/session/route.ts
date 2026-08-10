import { cookies } from 'next/headers'
import { randomUUID } from 'node:crypto'

const SESSION_COOKIE = 'pyramid_guest'

export async function GET() {
  const store = await cookies()
  return Response.json({ authenticated: Boolean(store.get(SESSION_COOKIE)?.value) })
}

export async function POST() {
  const store = await cookies()
  store.set(SESSION_COOKIE, randomUUID(), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return Response.json({ authenticated: true })
}

export async function DELETE() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  return Response.json({ authenticated: false })
}
