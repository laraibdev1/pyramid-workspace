import { NextResponse, type NextRequest } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pyramid-workspace.onrender.com'

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? ''

  const res = await fetch(`${API_BASE_URL}/api/session`, {
    headers: { cookie: cookieHeader },
  })

  const data = await res.json().catch(() => ({}))
  return NextResponse.json(data, { status: res.status })
}

export async function POST() {
  const res = await fetch(`${API_BASE_URL}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json().catch(() => ({}))
  const response = NextResponse.json(data, { status: res.status })

  // Forward the cookie from NestJS (Render) to your browser
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) {
    response.headers.set('set-cookie', setCookie)
  }

  return response
}

export async function DELETE(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? ''

  const res = await fetch(`${API_BASE_URL}/api/session`, {
    method: 'DELETE',
    headers: { cookie: cookieHeader },
  })

  const data = await res.json().catch(() => ({}))
  const response = NextResponse.json(data, { status: res.status })

  const setCookie = res.headers.get('set-cookie')
  if (setCookie) {
    response.headers.set('set-cookie', setCookie)
  }

  return response
}