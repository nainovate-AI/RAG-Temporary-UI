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
  Hash
} from 'lucide-react'

const navigation = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Pipelines', href: '/pipelines', icon: Link2 },
      { name: 'Documents', href: '/documents', icon: FileText },
      { name: 'Query Playground', href: '/playground', icon: Search },
    ],
  },
  {
    title: 'CONFIGURATION',
    items: [
      { name: 'Vector Stores', href: '/config/vector-stores', icon: Database },
      { name: 'LLM Providers', href: '/config/llm', icon: Brain },
      { name: 'Embeddings', href: '/config/embeddings', icon: Hash },
      { name: 'Prompts', href: '/config/prompts', icon: MessageSquare },
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
          {navigation.map((section, sectionIndex) => (
            <div key={section.title} className={cn(
              "space-y-1",
              sectionIndex > 0 && "mt-6"
            )}>
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h2>
              {section.items.map((item) => {
                const isActive = pathname === item.href
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