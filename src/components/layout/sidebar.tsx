'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Search,
  Database,
  Brain,
  MessageSquare,
  Settings,
  BarChart3,
  DollarSign,
  Link2,
  Hash,
  type LucideIcon
} from 'lucide-react'

// Define types for navigation items
type BaseNavItem = {
  name: string
  href: string
  icon: LucideIcon
}

type ConfigNavItem = BaseNavItem & {
  contexter?: boolean
  inferencer?: boolean
}

type NavSection = {
  title: string
  items: (BaseNavItem | ConfigNavItem)[]
}

const navigation: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboards', href: '/dashboards', icon: LayoutDashboard },
      { name: 'Contexter', href: '/contexter', icon: FileText },
      { name: 'Inferencer', href: '/inferencer', icon: Link2 },
      { name: 'Query Playground', href: '/playground', icon: Search },
    ],
  },
  {
    title: 'CONFIGURATION',
    items: [
      { name: 'Vector Stores', href: '/config/vector-stores', icon: Database, contexter: true, inferencer: false },
      { name: 'LLM Providers', href: '/config/llm', icon: Brain, contexter: true, inferencer: true },
      { name: 'Embeddings', href: '/config/embeddings', icon: Hash, contexter: true, inferencer: false },
      { name: 'Prompts', href: '/config/prompts', icon: MessageSquare, contexter: true, inferencer: true },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { name: 'Performance', href: '/analytics/performance', icon: BarChart3 },
      { name: 'Cost Analysis', href: '/analytics/cost', icon: DollarSign },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  
  // Function to check if a menu item should be active
  const isActive = (href: string) => {
    // Special case for dashboards - exact match or starts with /dashboards/
    if (href === '/dashboards') {
      return pathname === '/dashboards' || pathname.startsWith('/dashboards/')
    }
    
    // For other items, check if pathname starts with href
    // This will make /contexter active for both /contexter and /contexter/ingest/new
    return pathname === href || pathname.startsWith(href + '/')
  }
  const getActiveSection = () => {
    if (pathname.startsWith('/contexter')) {
      return 'contexter'
    }
    if (pathname.startsWith('/inferencer')) {
      return 'inferencer'
    }
    // Default to showing all config items if not in a specific section
    return 'all'
  }
  
  const activeSection = getActiveSection()
  
  // Filter configuration items based on active section
  const getFilteredNavigation = () => {
    return navigation.map(section => {
      if (section.title === 'CONFIGURATION') {
        const filteredItems = section.items.filter(item => {
          // Type guard to check if item is a ConfigNavItem
          const configItem = item as ConfigNavItem
          
          // If no contexter/inferencer properties, always show
          if (!('contexter' in configItem) && !('inferencer' in configItem)) {
            return true
          }
          
          // Show based on active section
          if (activeSection === 'contexter') {
            return configItem.contexter === true
          }
          if (activeSection === 'inferencer') {
            return configItem.inferencer === true
          }
          
          // Show all if not in specific section
          return true
        })
        
        return { ...section, items: filteredItems }
      }
      return section
    })
  }
  
  const filteredNavigation = getFilteredNavigation()
  
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b border-border">
          {/* Dark theme logo */}
          <Image
            src="/logo-dark.png"
            alt="GENX"
            width={150}
            height={40}
            className="hidden dark:block"
            priority
          />
          {/* Light theme logo */}
          <Image
            src="/logo-light.png"
            alt="GENX"
            width={150}
            height={40}
            className="block dark:hidden"
            priority
          />
          
          {/* Fallback text if images don't load */}
          <h1 className="text-xl font-bold sr-only">GENX</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          {filteredNavigation.map((section, sectionIndex) => (
            <div key={section.title} className={cn(
              "space-y-1",
              sectionIndex > 0 && "mt-6"
            )}>
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h2>
              {section.items.map((item) => {
                // Updated logic to check if current path starts with the item's href
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboards' && pathname.startsWith(item.href + '/')) ||
                  (item.href === '/dashboards' && pathname.startsWith('/dashboards/'))
                  
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}