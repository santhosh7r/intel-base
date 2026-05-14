'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sun, Moon, Monitor, Command, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface TopbarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  section: string
}

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Company intelligence overview' },
  companies: { title: 'Companies', subtitle: 'Search and filter registered companies' },
  analytics: { title: 'Analytics', subtitle: 'Data distribution and trends' },
  recent: { title: 'Recent Registrations', subtitle: 'Newly registered companies' },
  active: { title: 'Active Companies', subtitle: 'Currently active entities' },
  exports: { title: 'Exports', subtitle: 'Download company data' },
  settings: { title: 'Settings', subtitle: 'Preferences and configuration' },
}

export function Topbar({ searchQuery, setSearchQuery, section }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const info = sectionTitles[section] ?? sectionTitles.dashboard

  useEffect(() => setMounted(true), [])

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setSearchQuery])

  const ThemeIcon = !mounted ? Monitor : theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'

  return (
    <header className="h-12 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-5 gap-4 sticky top-0 z-20">
      {/* Page info */}
      <div className="min-w-0 flex-shrink-0">
        <h1 className="text-sm font-semibold text-foreground leading-none">{info.title}</h1>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border" />

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search companies…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className={cn(
            'w-full pl-8 pr-8 py-1.5 text-sm rounded-md bg-muted/50 border',
            'border-transparent text-foreground placeholder:text-muted-foreground/60',
            'focus:outline-none focus:bg-background focus:border-border',
            'transition-colors duration-150'
          )}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-muted-foreground/50 font-mono">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={() => setTheme(nextTheme)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-100"
          title="Toggle theme"
        >
          {mounted && (
            theme === 'dark' ? <Moon className="w-4 h-4" /> :
            theme === 'light' ? <Sun className="w-4 h-4" /> :
            <Monitor className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  )
}
