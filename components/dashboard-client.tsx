'use client'

import { useState, useCallback, useTransition, useOptimistic } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/header'
import { AnalyticsSection } from '@/components/analytics-section'
import { CompaniesSection } from '@/components/companies-section'
import { Company } from '@/lib/data'
import { Settings2, Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

interface DashboardClientProps {
  initialCompanies: Company[]
  totalCount: number
  stats: {
    total: number
    active: number
    stateCount: number
    categoryCount: number
    stateDistribution: { name: string; value: number }[]
    categoryDistribution: { name: string; value: number }[]
    recentCompanies: Partial<Company>[]
  }
  filterOptions: { states: string[]; statuses: string[] }
}

const PAGE_SIZE = 50

export function DashboardClient({
  initialCompanies,
  totalCount,
  stats,
  filterOptions,
}: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ status: '', state: '' })
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [count, setCount] = useState(totalCount)
  const [isPending, startTransition] = useTransition()

  const fetchCompanies = useCallback(
    async (newPage: number, search: string, newFilters: { status: string; state: string }) => {
      startTransition(async () => {
        const params = new URLSearchParams({
          page: String(newPage),
          pageSize: String(PAGE_SIZE),
          search,
          status: newFilters.status,
          state: newFilters.state,
        })
        try {
          const res = await fetch(`/api/companies?${params}`)
          if (res.ok) {
            const json = await res.json()
            setCompanies(json.data)
            setCount(json.count)
          }
        } catch (e) {
          console.error('Failed to fetch companies', e)
        }
      })
    },
    []
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchCompanies(newPage, searchQuery, filters)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    setPage(1)
    fetchCompanies(1, q, filters)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPage(1)
    fetchCompanies(1, searchQuery, newFilters)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          section={activeSection}
        />

        <main className="flex-1 overflow-y-auto">
          <div className={`transition-opacity duration-150 ${isPending ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            <AnimatePresence mode="wait">
              {activeSection === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 max-w-6xl mx-auto"
                >
                  <AnalyticsSection companies={companies} stats={stats} />
                </motion.div>
              )}

              {(activeSection === 'companies' || activeSection === 'recent' || activeSection === 'active') && (
                <motion.div
                  key="companies"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 max-w-7xl mx-auto"
                >
                  <CompaniesSection
                    companies={companies}
                    totalCount={count}
                    page={page}
                    pageSize={PAGE_SIZE}
                    onPageChange={handlePageChange}
                    onSearchChange={handleSearchChange}
                    onFilterChange={handleFilterChange}
                    searchQuery={searchQuery}
                    filters={
                      activeSection === 'active'
                        ? { ...filters, status: 'Active' }
                        : filters
                    }
                    filterOptions={filterOptions}
                  />
                </motion.div>
              )}

              {activeSection === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 max-w-6xl mx-auto"
                >
                  <AnalyticsSection companies={companies} stats={stats} />
                </motion.div>
              )}

              {activeSection === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 max-w-2xl mx-auto"
                >
                  <SettingsSection />
                </motion.div>
              )}

              {activeSection === 'exports' && (
                <motion.div
                  key="exports"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 max-w-2xl mx-auto"
                >
                  <ExportsSection companies={companies} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

function SettingsSection() {
  const { theme, setTheme } = useTheme()
  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences</p>
      </div>
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        <div className="p-4">
          <p className="text-sm font-medium text-foreground mb-3">Theme</p>
          <div className="flex gap-2">
            {themes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${
                  theme === id
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-foreground">Platform</p>
          <p className="text-xs text-muted-foreground mt-1">IntelBase Company Intelligence Platform v1.0</p>
        </div>
      </div>
    </div>
  )
}

function ExportsSection({ companies }: { companies: Company[] }) {
  const handleExportCSV = () => {
    const headers = ['company_name', 'cin', 'status', 'company_type', 'state', 'city', 'incorporation_date', 'email', 'website', 'paid_up_capital']
    const rows = companies.map(c =>
      headers.map(h => {
        const val = ((c as unknown) as Record<string, string>)[h] || ''
        return `"${val.replace(/"/g, '""')}"`
      }).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `companies-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Exports</h2>
        <p className="text-sm text-muted-foreground mt-1">Download company data</p>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">CSV Export</p>
            <p className="text-xs text-muted-foreground mt-0.5">Download current view as CSV ({companies.length} records)</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-sm bg-foreground text-background rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}
