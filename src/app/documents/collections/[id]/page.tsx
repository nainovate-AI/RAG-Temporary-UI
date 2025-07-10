'use client'

import { useParams, useRouter } from 'next/navigation'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

export default function CollectionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.id as string

  // In real app, fetch collection details and ingestion status
  
  return (
    <MainLayout>
      <PageHeader
        title="Collection Details"
        description="Monitor ingestion progress and manage collection"
      >
        <Button
          variant="outline"
          onClick={() => router.push('/documents')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
      </PageHeader>

      <PageContent>
        {/* Ingestion Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Ingestion Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Processing documents...</p>
                  <p className="text-sm text-muted-foreground">
                    Stage: Embedding generation
                  </p>
                </div>
                <Badge variant="secondary">
                  Processing
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Documents Processed</p>
                  <p className="font-medium">7 / 10</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chunks Created</p>
                  <p className="font-medium">654</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Elapsed</p>
                  <p className="font-medium">3m 24s</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add more cards for collection details, documents list, etc. */}
      </PageContent>
    </MainLayout>
  )
}