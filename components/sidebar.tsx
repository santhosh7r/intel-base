'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  FileText,
  Download,
  Settings,
  ChevronRight,
  Database,
  Layers,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: React.ElementType
  label: string
  id: string
  badge?: number
}

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Building2, label: 'Companies', id: 'companies' },
  { icon: TrendingUp, label: 'Analytics', id: 'analytics' },
]

const dataNav: NavItem[] = [
  { icon: Layers, label: 'Recent Registrations', id: 'recent' },
  { icon: FileText, label: 'Active Companies', id: 'active' },
  { icon: Download, label: 'Exports', id: 'exports' },
]

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden flex-shrink-0 h-screen"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-sidebar-border h-12">
        <div className="w-6 h-6 rounded-md bg-foreground/90 flex items-center justify-center flex-shrink-0">
          <Database className="w-3.5 h-3.5 text-background" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-semibold text-sidebar-foreground whitespace-nowrap overflow-hidden"
            >
              IntelBase
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Main nav */}
        <div className="mb-1">
          {!collapsed && (
            <p className="px-2 py-1 text-[10px] font-semibold text-sidebar-foreground/30 uppercase tracking-wider">
              Main
            </p>
          )}
          {mainNav.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              collapsed={collapsed}
              active={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
            />
          ))}
        </div>

        {/* Data nav */}
        <div className="mt-3">
          {!collapsed && (
            <p className="px-2 py-1 text-[10px] font-semibold text-sidebar-foreground/30 uppercase tracking-wider">
              Data
            </p>
          )}
          {dataNav.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              collapsed={collapsed}
              active={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-sidebar-border space-y-0.5">
        <NavButton
          item={{ icon: Settings, label: 'Settings', id: 'settings' }}
          collapsed={collapsed}
          active={activeSection === 'settings'}
          onClick={() => onSectionChange('settings')}
        />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center w-full gap-2.5 px-2 py-2 rounded-md text-sidebar-foreground/40',
            'hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-100 text-sm'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight
            className={cn(
              'w-4 h-4 flex-shrink-0 transition-transform duration-200',
              collapsed ? '' : 'rotate-180'
            )}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}

function NavButton({
  item,
  collapsed,
  active,
  onClick,
}: {
  item: NavItem
  collapsed: boolean
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-2.5 w-full px-2 py-2 rounded-md text-sm transition-colors duration-100',
        active
          ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
