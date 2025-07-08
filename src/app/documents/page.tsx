'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { 
  Upload, 
  Globe, 
  FileText,
  FileSpreadsheet,
  FileCode,
  File,
  MoreVertical,
  Search,
  Filter,
  Grid3x3,
  List,
  Clock,
  HardDrive
} from 'lucide-react'
import { formatBytes, getTimeAgo, formatNumber } from '@/lib/utils'
import { Document } from '@/types'

// Mock data
const documents: Document[] = [
  {
    id: '1',
    name: 'Product Documentation v2.4.pdf',
    type: 'pdf',
    size: 2515456,
    pages: 156,
    uploadedAt: '2024-01-15T10:30:00Z',
    pipelineId: '1',
    pipelineName: 'Technical Docs',
    status: 'indexed',
    tags: ['v2.4', 'documentation'],
  },
  {
    id: '2',
    name: 'Q4_Customer_Feedback.csv',
    type: 'csv',
    size: 1887436,
    rows: 5234,
    uploadedAt: '2024-01-15T08:15:00Z',
    pipelineId: '2',
    pipelineName: 'Customer Support',
    status: 'indexed',
    tags: ['feedback', 'q4'],
  },
  {
    id: '3',
    name: 'API_Reference_Guide.md',
    type: 'markdown',
    size: 467456,
    pages: 89,
    uploadedAt: '2024-01-14T14:20:00Z',
    pipelineId: '1',
    pipelineName: 'Technical Docs',
    status: 'indexed',
    tags: ['API', 'reference'],
  },
  {
    id: '4',
    name: 'Service_Agreement_2024.docx',
    type: 'docx',
    size: 350208,
    pages: 28,
    uploadedAt: '2024-01-13T09:45:00Z',
    pipelineId: '3',
    pipelineName: 'Legal Analysis',
    status: 'indexed',
    tags: ['contract', 'legal'],
  },
  {
    id: '5',
    name: 'knowledge-base.scraped.html',
    type: 'html',
    size: 1258291,
    pages: 145,
    uploadedAt: '2024-01-12T16:30:00Z',
    pipelineId: '2',
    pipelineName: 'Customer Support',
    status: 'indexed',
    tags: ['KB', 'scraped'],
  },
  {
    id: '6',
    name: 'training_data_export.json',
    type: 'json',
    size: 3878912,
    rows: 1250,
    uploadedAt: '2024-01-11T11:00:00Z',
    pipelineId: '1',
    pipelineName: 'Technical Docs',
    status: 'processing',
    tags: ['training', 'export'],
  },
]

const stats = [
  { label: 'Total Documents', value: 12847, icon: FileText },
  { label: 'Storage Used', value: '2.4 GB', icon: HardDrive, progress: 65 },
  { label: 'Active Pipelines', value: 8, icon: List },
  { label: 'Indexed', value: '95.2%', icon: Clock },
]

const fileTypeIcons: Record<string, any> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  markdown: FileCode,
  docx: FileText,
  html: Globe,
  json: FileCode,
  txt: File,
}

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <PageHeader
        title="Document Management"
        description="Upload, organize, and manage your knowledge base"
      >
        <Button variant="outline">
          <Globe className="mr-2 h-4 w-4" />
          Import from URL
        </Button>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  {stat.progress !== undefined && (
                    <div className="mt-4">
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Upload Section */}
        <Card className="mb-8 border-dashed">
          <CardContent className="p-12 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Support for multiple file formats and batch uploads
            </p>
            <Button>Select Files</Button>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {['PDF', 'DOCX', 'TXT', 'CSV', 'HTML', 'Markdown', 'JSON'].map((format) => (
                <Badge key={format} variant="secondary">{format}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex border border-input rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => {
              const Icon = fileTypeIcons[doc.type] || File
              return (
                <Card key={doc.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base line-clamp-1">
                            {doc.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">
                            {doc.type} Document
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {formatBytes(doc.size)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {doc.pages ? `${doc.pages} pages` : `${doc.rows} rows`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(doc.uploadedAt)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doc.pipelineName}
                      </Badge>
                      <StatusBadge status={doc.status} />
                      {doc.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Name</th>
                    <th className="px-6 py-3 text-left font-medium">Type</th>
                    <th className="px-6 py-3 text-left font-medium">Size</th>
                    <th className="px-6 py-3 text-left font-medium">Pipeline</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Modified</th>
                    <th className="px-6 py-3 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocuments.map((doc) => {
                    const Icon = fileTypeIcons[doc.type] || File
                    return (
                      <tr key={doc.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 uppercase text-muted-foreground">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {formatBytes(doc.size)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{doc.pipelineName}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {getTimeAgo(doc.uploadedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </PageContent>
    </MainLayout>
  )
}