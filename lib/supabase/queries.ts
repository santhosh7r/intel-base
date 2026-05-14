import { createClient } from './server'
import { Company } from '@/lib/data'

export interface PaginatedCompanies {
  data: Company[]
  count: number
}

export async function getCompanies(
  page = 1,
  pageSize = 50,
  search = '',
  status = '',
  state = ''
): Promise<PaginatedCompanies> {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .order('company_name', { ascending: true })
    .range(from, to)

  if (search) {
    query = query.or(`company_name.ilike.%${search}%,cin.ilike.%${search}%,city.ilike.%${search}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (state) {
    query = query.eq('state', state)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching companies:', error)
    return { data: [], count: 0 }
  }

  return { data: data ?? [], count: count ?? 0 }
}

export async function getCompanyById(id: number): Promise<Company | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    return null
  }
  return data
}

export async function getAnalyticsStats() {
  const supabase = await createClient()

  const [total, active, stateRes, categoryRes, recentRes] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
    supabase.from('companies').select('state').not('state', 'is', null),
    supabase.from('companies').select('company_category').not('company_category', 'is', null),
    supabase
      .from('companies')
      .select('id, company_name, city, state, incorporation_date, status, company_type')
      .order('scraped_at', { ascending: false })
      .limit(10),
  ])

  // Build state distribution
  const stateCounts: Record<string, number> = {}
  ;(stateRes.data ?? []).forEach((r: { state: string }) => {
    const s = r.state || 'Unknown'
    stateCounts[s] = (stateCounts[s] || 0) + 1
  })
  const stateDistribution = Object.entries(stateCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  // Build category distribution
  const catCounts: Record<string, number> = {}
  ;(categoryRes.data ?? []).forEach((r: { company_category: string }) => {
    const c = r.company_category || 'Other'
    catCounts[c] = (catCounts[c] || 0) + 1
  })
  const categoryDistribution = Object.entries(catCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    stateCount: Object.keys(stateCounts).length,
    categoryCount: Object.keys(catCounts).length,
    stateDistribution,
    categoryDistribution,
    recentCompanies: recentRes.data ?? [],
  }
}

export async function getFilterOptions() {
  const supabase = await createClient()
  const [states, statuses] = await Promise.all([
    supabase.from('companies').select('state').not('state', 'is', null),
    supabase.from('companies').select('status').not('status', 'is', null),
  ])

  const uniqueStates = [...new Set((states.data ?? []).map((r: { state: string }) => r.state))].sort()
  const uniqueStatuses = [...new Set((statuses.data ?? []).map((r: { status: string }) => r.status))].sort()

  return { states: uniqueStates, statuses: uniqueStatuses }
}
