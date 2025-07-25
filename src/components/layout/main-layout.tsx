'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex h-screen  bg-background">
      <Sidebar />
      
      {/* Main content area */}
      <main className={cn(
        "flex-1 overflow-y",
        className
      )}>
        <div className="h-screen ml-64">
          {children}
        </div>
      </main>
    </div>
  )
}

// Page header component for consistent page layouts
interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

// Page content wrapper for consistent padding
interface PageContentProps {
  children: ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn("flex-1 p-8", className)}>
      {children}
    </div>
  )
}