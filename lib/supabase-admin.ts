function resolveEnv(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]
    if (value && !value.startsWith('process.env.')) return value
  }
  return undefined
}

const supabaseUrl = resolveEnv('SUPABASE_URL', 'SUPABASE_URL_3', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL_3')
const supabaseKey = resolveEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY_3', 'SUPABASE_SECRET_KEY')

const missingSupabaseConfig = () => {
  const missing = [
    !supabaseUrl && 'SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)',
    !supabaseKey && 'SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)',
  ].filter(Boolean)
  return missing.join(', ')
}

export function supabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey)
}

function hasNonAsciiChar(value: string) {
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) return true
  }
  return false
}

const invalidCharsMessage = () => {
  const bad = [
    supabaseUrl && hasNonAsciiChar(supabaseUrl) && 'SUPABASE_URL',
    supabaseKey && hasNonAsciiChar(supabaseKey) && 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean)
  if (bad.length === 0) return null
  return `${bad.join(' and ')} contain invalid non-ASCII characters (e.g. a "•" bullet) — this usually means you copied a masked/hidden value instead of the actual revealed key. Go back to Supabase, click "reveal", copy the real text, and re-set the env var.`
}

export async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const missing = missingSupabaseConfig()
  if (missing) throw new Error(`Supabase configuration is missing: ${missing}. Use literal values in .env.local, not process.env expressions, then restart.`)
  const invalidChars = invalidCharsMessage()
  if (invalidChars) throw new Error(invalidChars)
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseKey as string,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...init.headers,
    },
    cache: 'no-store',
  })
  const text = await response.text()
  let payload: unknown = null
  try { payload = text ? JSON.parse(text) : null } catch { payload = text }
  if (!response.ok) {
    const detail = typeof payload === 'object' && payload !== null && 'message' in payload ? String((payload as { message: unknown }).message) : String(payload || response.statusText)
    throw new Error(`Supabase ${response.status}: ${detail}`)
  }
  return payload as T
}
