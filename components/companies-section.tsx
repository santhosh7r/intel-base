'use client'

import { useState, useMemo, useCallback, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import {
  ChevronUp, ChevronDown, ChevronsUpDown, ArrowLeft, ArrowRight,
  Eye, Copy, ExternalLink, Building2, Mail, Globe, MapPin,
  Calendar, Hash, Tag, X, Download, Filter, Search,
} from 'lucide-react'
import { Company } from '@/lib/data'
import { cn } from '@/lib/utils'

interface CompaniesSectionProps {
  companies: Company[]
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onSearchChange: (q: string) => void
  onFilterChange: (key: string, value: string) => void
  searchQuery: string
  filters: { status: string; state: string }
  filterOptions: { states: string[]; statuses: string[] }
}

const columnHelper = createColumnHelper<Company>()

function StatusBadge({ status }: { status: string }) {
  if (!status) return <span className="badge-default">—</span>
  if (status === 'Active') return (
    <span className="badge-active">
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      {status}
    </span>
  )
  return <span className="badge-inactive">{status}</span>
}

function SortIcon({ state }: { state: 'asc' | 'desc' | false }) {
  if (!state) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/40" />
  if (state === 'asc') return <ChevronUp className="w-3 h-3 text-foreground" />
  return <ChevronDown className="w-3 h-3 text-foreground" />
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

function CompanyDrawer({ company, onClose }: { company: Company; onClose: () => void }) {
  const fields = [
    { label: 'CIN', value: company.cin, copyable: true, icon: Hash },
    { label: 'Company Type', value: company.company_type, icon: Tag },
    { label: 'Category', value: company.company_category, icon: Layers },
    { label: 'Subcategory', value: company.company_subcategory, icon: Layers },
    { label: 'ROC', value: company.roc, icon: Building2 },
    { label: 'Incorporation Date', value: company.incorporation_date, icon: Calendar },
    { label: 'Status', value: company.status, icon: null },
    { label: 'Authorized Capital', value: company.authorized_capital, icon: null },
    { label: 'Paid-up Capital', value: company.paid_up_capital, icon: null },
    { label: 'Email', value: company.email, copyable: true, icon: Mail },
    { label: 'Website', value: company.website, isLink: true, icon: Globe },
    { label: 'Address', value: company.address, copyable: true, icon: MapPin },
    { label: 'City', value: company.city, icon: MapPin },
    { label: 'State', value: company.state, icon: MapPin },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="h-full w-full max-w-xl bg-background border-l border-border overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-start justify-between gap-4 z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={company.status} />
            </div>
            <h2 className="text-base font-semibold text-foreground leading-tight">
              {company.company_name || '—'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{company.cin}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {company.source_url && (
              <a
                href={company.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Source
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-1">
          {fields.map(({ label, value, copyable, isLink, icon: Icon }) => (
            <div
              key={label}
              className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0"
            >
              <div className="w-32 flex-shrink-0">
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </div>
              <div className="flex-1 min-w-0 flex items-start gap-1.5">
                {value ? (
                  isLink ? (
                    <a
                      href={value.startsWith('http') ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:underline truncate flex-1"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-foreground break-words flex-1">{value}</span>
                  )
                ) : (
                  <span className="text-sm text-muted-foreground/50">—</span>
                )}
                {copyable && value && (
                  <button
                    onClick={() => copyToClipboard(value)}
                    className="flex-shrink-0 p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Workaround for using Layers icon inside the same file
function Layers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
    </svg>
  )
}

export function CompaniesSection({
  companies,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onSearchChange,
  onFilterChange,
  searchQuery,
  filters,
  filterOptions,
}: CompaniesSectionProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize)

  const columns = useMemo(() => [
    columnHelper.accessor('company_name', {
      header: 'Company',
      size: 220,
      cell: (info) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm truncate">{info.getValue() || '—'}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {info.row.original.city
              ? `${info.row.original.city}, ${info.row.original.state || '—'}`
              : info.row.original.state || '—'}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('cin', {
      header: 'CIN',
      size: 160,
      cell: (info) => (
        <span className="font-mono text-xs text-muted-foreground">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      size: 90,
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor('company_type', {
      header: 'Type',
      size: 130,
      cell: (info) => (
        <span className="text-xs text-muted-foreground">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.accessor('state', {
      header: 'State',
      size: 120,
      cell: (info) => (
        <span className="text-sm text-foreground">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.accessor('incorporation_date', {
      header: 'Inc. Date',
      size: 100,
      cell: (info) => (
        <span className="text-xs text-muted-foreground tabular-nums">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.accessor('paid_up_capital', {
      header: 'Paid-up Capital',
      size: 130,
      cell: (info) => (
        <span className="text-xs text-foreground tabular-nums">{info.getValue() || '—'}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      size: 60,
      cell: (info) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedCompany(info.row.original)}
            className="p-1.5 text-muted-foreground/50 hover:text-foreground rounded hover:bg-muted transition-colors"
            title="View details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {info.row.original.website && (
            <a
              href={info.row.original.website.startsWith('http')
                ? info.row.original.website
                : `https://${info.row.original.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-muted-foreground/50 hover:text-foreground rounded hover:bg-muted transition-colors"
              title="Visit website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ),
    }),
  ], [])

  const table = useReactTable({
    data: companies,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  const hasActiveFilters = filters.status || filters.state

  return (
    <section className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, CIN or city…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md bg-muted/50 border border-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-background focus:border-border transition-colors"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors',
            hasActiveFilters
              ? 'bg-foreground text-background border-foreground'
              : 'bg-transparent text-muted-foreground border-border hover:bg-muted hover:text-foreground'
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
          {hasActiveFilters && (
            <span className="ml-0.5 w-4 h-4 rounded-full bg-background/20 text-[10px] flex items-center justify-center font-medium">
              {[filters.status, filters.state].filter(Boolean).length}
            </span>
          )}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {((page - 1) * pageSize + 1).toLocaleString()}–{Math.min(page * pageSize, totalCount).toLocaleString()} of {totalCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium w-12">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  className="text-sm rounded-md bg-background border border-border px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">All</option>
                  {filterOptions.statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground font-medium w-12">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => onFilterChange('state', e.target.value)}
                  className="text-sm rounded-md bg-background border border-border px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">All</option>
                  {filterOptions.states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    onFilterChange('status', '')
                    onFilterChange('state', '')
                  }}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        'select-none',
                        header.column.getCanSort() && 'cursor-pointer'
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <SortIcon state={header.column.getIsSorted()} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.015, duration: 0.2 }}
                      onClick={() => setSelectedCompany(row.original)}
                      className="cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} onClick={cell.column.id === 'actions' ? (e) => e.stopPropagation() : undefined}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12 text-muted-foreground text-sm">
                      No companies found
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            {/* Page number buttons */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
              const p = totalPages <= 5 ? i + 1 : pageNum
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={cn(
                    'w-7 h-7 text-xs rounded transition-colors',
                    p === page
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Company detail drawer */}
      <AnimatePresence>
        {selectedCompany && (
          <CompanyDrawer
            company={selectedCompany}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
