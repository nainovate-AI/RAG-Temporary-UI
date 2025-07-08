'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Link2,
  FileText,
  Search,
  Database,
  Brain,
  Target,
  ScrollText,
  BarChart3,
  DollarSign,
  Key,
  Settings,
  HelpCircle,
} from 'lucide-react'

const navigation = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Pipelines', href: '/pipelines', icon: Link2 },
      { name: 'Documents', href: '/documents', icon: FileText },
      { name: 'Query Playground', href: '/playground', icon: Search },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { name: 'Vector Stores', href: '/config/vector-stores', icon: Database },
      { name: 'LLM Providers', href: '/config/llm', icon: Brain },
      { name: 'Embeddings', href: '/config/embeddings', icon: Target },
      { name: 'Prompts', href: '/config/prompts', icon: ScrollText },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { name: 'Performance', href: '/analytics/performance', icon: BarChart3 },
      { name: 'Cost Analysis', href: '/analytics/cost', icon: DollarSign },
      { name: 'API Keys', href: '/settings/api-keys', icon: Key },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">RAGDP-UI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-8 p-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}


