import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'pyramid_guest'

export async function hasGuestSession() {
  const store = await cookies()
  return Boolean(store.get(SESSION_COOKIE)?.value)
}
