import { NextRequest, NextResponse } from 'next/server'
import { getCompanies } from '@/lib/supabase/queries'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') ?? '50', 10)
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const state = searchParams.get('state') ?? ''

  const result = await getCompanies(page, pageSize, search, status, state)

  return NextResponse.json(result)
}
