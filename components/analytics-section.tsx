'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Building2, TrendingUp, Globe, Layers } from 'lucide-react'
import { Company } from '@/lib/data'

interface AnalyticsSectionProps {
  companies: Company[]
  stats: {
    total: number
    active: number
    stateCount: number
    categoryCount: number
    stateDistribution: { name: string; value: number }[]
    categoryDistribution: { name: string; value: number }[]
    recentCompanies: Partial<Company>[]
  }
}

const CHART_COLORS = [
  'oklch(0.62 0.07 250)',
  'oklch(0.58 0.07 145)',
  'oklch(0.60 0.08 30)',
  'oklch(0.56 0.06 300)',
  'oklch(0.58 0.06 200)',
  'oklch(0.60 0.07 80)',
  'oklch(0.55 0.06 170)',
  'oklch(0.62 0.07 320)',
]

const tooltipStyle = {
  contentStyle: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'var(--foreground)',
    padding: '8px 12px',
  },
  cursor: { fill: 'var(--muted)', opacity: 0.4 },
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="metric-card"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-semibold text-foreground mt-1 tabular-nums">{value}</p>
          {sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>}
        </div>
        <div className="p-2 rounded-md bg-muted/60 flex-shrink-0">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  )
}

export function AnalyticsSection({ companies, stats }: AnalyticsSectionProps) {
  return (
    <section className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Building2}
          label="Total Registered"
          value={stats.total.toLocaleString()}
          sub="All-time"
          delay={0.05}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Entities"
          value={stats.active.toLocaleString()}
          sub={stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(1)}% of total` : '—'}
          delay={0.1}
        />
        <StatCard
          icon={Globe}
          label="States Covered"
          value={stats.stateCount.toLocaleString()}
          sub="Geographic spread"
          delay={0.15}
        />
        <StatCard
          icon={Layers}
          label="Categories"
          value={stats.categoryCount.toLocaleString()}
          sub="Industry segments"
          delay={0.2}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar chart - State distribution (larger) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-foreground">Geographic Distribution</p>
              <p className="text-xs text-muted-foreground mt-0.5">Companies by top states</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.stateDistribution} barSize={16}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip {...tooltipStyle} />
                <Bar
                  dataKey="value"
                  fill="oklch(0.62 0.07 250)"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie chart - Category distribution */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-lg p-4"
        >
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">Industry Categories</p>
            <p className="text-xs text-muted-foreground mt-0.5">Company type breakdown</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-40 flex-shrink-0" style={{ width: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryDistribution.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={62}
                    paddingAngle={2}
                    dataKey="value"
                    isAnimationActive
                  >
                    {stats.categoryDistribution.slice(0, 6).map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle.contentStyle}
                    formatter={(v: number) => [v.toLocaleString(), 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5 min-w-0">
              {stats.categoryDistribution.slice(0, 5).map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground truncate flex-1">{cat.name}</span>
                  <span className="text-xs font-medium text-foreground tabular-nums">
                    {cat.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent companies */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Recent Registrations</p>
            <p className="text-xs text-muted-foreground mt-0.5">Latest scraped companies</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {stats.recentCompanies.slice(0, 6).map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.04 }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors duration-100"
            >
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {company.company_name || '—'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {company.city ? `${company.city}, ` : ''}{company.state || '—'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span
                  className={
                    company.status === 'Active'
                      ? 'badge-active'
                      : company.status
                      ? 'badge-inactive'
                      : 'badge-default'
                  }
                >
                  {company.status || 'Unknown'}
                </span>
                {company.incorporation_date && (
                  <p className="text-xs text-muted-foreground mt-0.5">{company.incorporation_date}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
