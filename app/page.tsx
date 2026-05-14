import { getCompanies, getAnalyticsStats, getFilterOptions } from '@/lib/supabase/queries'
import { DashboardClient } from '@/components/dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [companiesResult, stats, filterOptions] = await Promise.all([
    getCompanies(1, 50),
    getAnalyticsStats(),
    getFilterOptions(),
  ])

  return (
    <DashboardClient
      initialCompanies={companiesResult.data}
      totalCount={companiesResult.count}
      stats={stats}
      filterOptions={filterOptions}
    />
  )
}
