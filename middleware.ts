import { type NextRequest, NextResponse } from 'next/server'

// Minimal middleware — just passes through.
// No auth/session enforcement since this is a public intelligence dashboard.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
