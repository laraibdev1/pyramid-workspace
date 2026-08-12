// The frontend talks to the NestJS backend for all task data — this is the
// only backend per the assessment brief. Guest login stays on the Next.js
// side (app/api/session) since it's just a same-origin cookie, not domain data.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export function apiUrl(path: string) {
  return `${API_BASE}${path}`
}
