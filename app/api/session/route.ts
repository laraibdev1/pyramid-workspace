import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pyramid-workspace.onrender.com'

export async function POST() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json({ error: 'Unable to connect to backend' }, { status: 502 })
  }
}