'use client'

import { usePathname, useRouter } from 'next/navigation'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { FileText, Link2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGreeting } from '@/lib/utils'

function DashboardToggle() {
  const pathname = usePathname()
  const router = useRouter()
  const selected = pathname.includes('contexter') ? 'contexter' : 'inferencer'
  
  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      <button
        onClick={() => router.push('/dashboards/contexter')}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          selected === 'contexter' 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:text-foreground"
        )}
      >
        <FileText className="mr-2 h-3.5 w-3.5" />
        Contexter
      </button>
      <button
        onClick={() => router.push('/dashboards/inferencer')}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          selected === 'inferencer' 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:text-foreground"
        )}
      >
        <Link2 className="mr-2 h-3.5 w-3.5" />
        Inferencer
      </button>
    </div>
  )
}

export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const greeting = getGreeting()
  
  const isContexter = pathname.includes('contexter')
  
  const handleNewClick = () => {
    if (isContexter) {
      router.push('/contexter/ingest')
    } else {
      router.push('/inferencer/new')
    }
  }

  return (
    <MainLayout>
      <PageHeader title={greeting} description="Overview of your RAG system">
        <DashboardToggle />
        <Button onClick={handleNewClick}>
          <Plus className="mr-2 h-4 w-4" />
          New {isContexter ? 'Collection' : 'Pipeline'}
        </Button>
      </PageHeader>
      <PageContent>
        {children}
      </PageContent>
    </MainLayout>
  )
}