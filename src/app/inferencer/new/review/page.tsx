// src/app/inferencer/new/review/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle,
  ChevronLeft,
  Folder,
  Search,
  Brain,
  FileText,
  Loader2,
  AlertCircle,
  Info,
  Rocket,
  Edit2,
  Clock,
  DollarSign,
  Zap,
  Hash,
  Settings,
  MessageSquare,
  Filter,
  Sparkles,
  Database,
  Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PipelineType } from '@/types/pipeline.types'

// This data would come from your context/session
const getReviewData = (pipelineType: PipelineType) => ({
  type: pipelineType,
  basic: {
    name: pipelineType === 'rag' ? 'Customer Support Assistant' : 'GPT-4 Content Writer',
    description: pipelineType === 'rag' 
      ? 'Multi-language support chatbot with product knowledge'
      : 'AI-powered content generation for blog posts and social media',
    useCase: pipelineType === 'rag' ? 'qa' : 'content',
    tags: pipelineType === 'rag' ? ['customer-support', 'production'] : ['content', 'blog', 'marketing'],
  },
  collections: pipelineType === 'rag' ? [
    { id: '1', name: 'Customer Support Knowledge Base', documents: 1543, chunks: 12847 },
    { id: '2', name: 'Product Documentation', documents: 892, chunks: 8234 },
  ] : null,
  retrieval: pipelineType === 'rag' ? {
    searchMethod: 'hybrid',
    hybridAlpha: 0.5,
    topK: 5,
    scoreThreshold: 0.7,
    reranker: {
      enabled: true,
      model: 'cohere-rerank-english-v2',
      topN: 3,
    },
  } : null,
  memory: {
    type: 'buffer',
    windowSize: 10,
    storageBackend: 'redis',
    ttl: 24,
  },
  mcp: {
    enabled: true,
    servers: [
      { name: 'Database Query Server', type: 'database' },
      { name: 'Web Browser Server', type: 'web' },
    ]
  },
  llm: {
    provider: 'openai',
    model: pipelineType === 'rag' ? 'gpt-4-turbo-preview' : 'gpt-4',
    temperature: 0.7,
    maxTokens: pipelineType === 'rag' ? 1000 : 2000,
    streaming: true,
    systemPrompt: pipelineType === 'rag' 
      ? 'You are a helpful customer support assistant...'
      : 'You are a creative content writer...',
    userPromptTemplate: pipelineType === 'rag' 
      ? 'Context: {context}\n\nQuestion: {query}'
      : '{input}',
  },
  estimates: {
    totalDocuments: pipelineType === 'rag' ? 2435 : 0,
    totalChunks: pipelineType === 'rag' ? 21081 : 0,
    queriesPerDay: 1000,
    avgLatency: pipelineType === 'rag' ? 120 : 50,
    costPerDay: pipelineType === 'rag' ? 12.50 : 8.00,
  },
})

const getStepsForEdit = (pipelineType: PipelineType) => {
  if (pipelineType === 'rag') {
    return [
      { id: 'basic', title: 'Basic Information', icon: Folder, path: '/inferencer/new/basic' },
      { id: 'collections', title: 'Collections', icon: Database, path: '/inferencer/new/collections' },
      { id: 'retrieval', title: 'Retrieval Config', icon: Search, path: '/inferencer/new/retrieval' },
      { id: 'memory', title: 'Memory', icon: Brain, path: '/inferencer/new/memory' },
      { id: 'mcp', title: 'MCP Tools', icon: Cpu, path: '/inferencer/new/mcp' },
      { id: 'llm', title: 'LLM & Prompts', icon: MessageSquare, path: '/inferencer/new/llm' },
    ]
  }
  
  return [
    { id: 'basic', title: 'Basic Information', icon: Folder, path: '/inferencer/new/basic' },
    { id: 'memory', title: 'Memory', icon: Brain, path: '/inferencer/new/memory' },
    { id: 'mcp', title: 'MCP Tools', icon: Cpu, path: '/inferencer/new/mcp' },
    { id: 'llm', title: 'LLM & Prompts', icon: MessageSquare, path: '/inferencer/new/llm' },
  ]
}

export default function ReviewDeployPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pipelineType = searchParams.get('type') as PipelineType
  
  const [isDeploying, setIsDeploying] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const reviewData = getReviewData(pipelineType)
  const steps = getStepsForEdit(pipelineType)

  const handleEdit = (path: string) => {
    router.push(`${path}?type=${pipelineType}`)
  }

  const handleDeploy = async () => {
    if (!agreedToTerms) return

    setIsDeploying(true)
    // Simulate API call to create pipeline
    setTimeout(() => {
      router.push('/inferencer')
    }, 2000)
  }

  const handleBack = () => {
    router.push(`/inferencer/new/llm?type=${pipelineType}`)
  }

  const handleTestQuery = () => {
    router.push('/playground?test=true')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Review & Deploy Pipeline</h2>
        <p className="text-muted-foreground">
          Review your configuration before deploying the pipeline
        </p>
      </div>

      {/* Pipeline Type Badge */}
      <div className="flex justify-center">
        <Badge variant="outline" className="text-sm px-3 py-1">
          {pipelineType === 'rag' ? '🔄 RAG Pipeline' : '🤖 LLM Inference Pipeline'}
        </Badge>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Basic Information</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[0].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
           <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
               <p className="text-muted-foreground">Pipeline Name</p>
               <p className="font-medium">{reviewData.basic.name}</p>
             </div>
             <div>
               <p className="text-muted-foreground">Use Case</p>
               <Badge variant="outline" className="mt-1">
                 {pipelineType === 'rag' ? 'Q&A / Support' : 'Content Generation'}
               </Badge>
             </div>
           </div>
           {reviewData.basic.description && (
             <div>
               <p className="text-muted-foreground text-sm">Description</p>
               <p className="text-sm">{reviewData.basic.description}</p>
             </div>
           )}
           <div className="flex gap-2 pt-2">
             {reviewData.basic.tags.map((tag) => (
               <Badge key={tag} variant="secondary" className="text-xs">
                 {tag}
               </Badge>
             ))}
           </div>
         </CardContent>
       </Card>

       {/* Collections (RAG only) */}
       {pipelineType === 'rag' && reviewData.collections && (
         <Card>
           <CardHeader className="pb-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Database className="h-5 w-5 text-muted-foreground" />
                 <CardTitle className="text-base">Document Collections</CardTitle>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => handleEdit('/inferencer/new/collections')}
               >
                 <Edit2 className="h-4 w-4" />
               </Button>
             </div>
           </CardHeader>
           <CardContent>
             <div className="space-y-2">
               {reviewData.collections.map((collection) => (
                 <div key={collection.id} className="flex items-center justify-between text-sm">
                   <span>{collection.name}</span>
                   <span className="text-muted-foreground">
                     {collection.documents.toLocaleString()} docs • {collection.chunks.toLocaleString()} chunks
                   </span>
                 </div>
               ))}
             </div>
             <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
               Total: {reviewData.estimates.totalDocuments.toLocaleString()} documents • 
               {reviewData.estimates.totalChunks.toLocaleString()} chunks
             </div>
           </CardContent>
         </Card>
       )}

       {/* Retrieval Configuration (RAG only) */}
       {pipelineType === 'rag' && reviewData.retrieval && (
         <Card>
           <CardHeader className="pb-4">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Search className="h-5 w-5 text-muted-foreground" />
                 <CardTitle className="text-base">Retrieval Configuration</CardTitle>
               </div>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => handleEdit('/inferencer/new/retrieval')}
               >
                 <Edit2 className="h-4 w-4" />
               </Button>
             </div>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-2 gap-4 text-sm">
               <div>
                 <p className="text-muted-foreground">Search Method</p>
                 <p className="font-medium capitalize">{reviewData.retrieval.searchMethod}</p>
               </div>
               <div>
                 <p className="text-muted-foreground">Top K</p>
                 <p className="font-medium">{reviewData.retrieval.topK} results</p>
               </div>
               <div>
                 <p className="text-muted-foreground">Score Threshold</p>
                 <p className="font-medium">{reviewData.retrieval.scoreThreshold}</p>
               </div>
               <div>
                 <p className="text-muted-foreground">Reranker</p>
                 <p className="font-medium">
                   {reviewData.retrieval.reranker.enabled 
                     ? reviewData.retrieval.reranker.model 
                     : 'Disabled'
                   }
                 </p>
               </div>
             </div>
           </CardContent>
         </Card>
       )}

       {/* Memory Configuration */}
       <Card>
         <CardHeader className="pb-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Brain className="h-5 w-5 text-muted-foreground" />
               <CardTitle className="text-base">Memory Configuration</CardTitle>
             </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={() => handleEdit('/inferencer/new/memory')}
             >
               <Edit2 className="h-4 w-4" />
             </Button>
           </div>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
               <p className="text-muted-foreground">Memory Type</p>
               <p className="font-medium capitalize">
                 {reviewData.memory.type === 'buffer' ? 'Buffer Memory' : reviewData.memory.type}
               </p>
             </div>
             <div>
               <p className="text-muted-foreground">Window Size</p>
               <p className="font-medium">{reviewData.memory.windowSize} messages</p>
             </div>
             <div>
               <p className="text-muted-foreground">Storage Backend</p>
               <p className="font-medium capitalize">{reviewData.memory.storageBackend}</p>
             </div>
             <div>
               <p className="text-muted-foreground">TTL</p>
               <p className="font-medium">{reviewData.memory.ttl} hours</p>
             </div>
           </div>
         </CardContent>
       </Card>

       {/* MCP Configuration */}
       <Card>
         <CardHeader className="pb-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Cpu className="h-5 w-5 text-muted-foreground" />
               <CardTitle className="text-base">MCP Tools</CardTitle>
             </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={() => handleEdit('/inferencer/new/mcp')}
             >
               <Edit2 className="h-4 w-4" />
             </Button>
           </div>
         </CardHeader>
         <CardContent>
           {reviewData.mcp.enabled && reviewData.mcp.servers.length > 0 ? (
             <div className="space-y-2">
               {reviewData.mcp.servers.map((server, idx) => (
                 <div key={idx} className="flex items-center gap-2 text-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <span>{server.name}</span>
                   <Badge variant="outline" className="text-xs">
                     {server.type}
                   </Badge>
                 </div>
               ))}
             </div>
           ) : (
             <p className="text-sm text-muted-foreground">No MCP servers configured</p>
           )}
         </CardContent>
       </Card>

       {/* LLM Configuration */}
       <Card>
         <CardHeader className="pb-4">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <MessageSquare className="h-5 w-5 text-muted-foreground" />
               <CardTitle className="text-base">LLM & Prompts</CardTitle>
             </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={() => handleEdit('/inferencer/new/llm')}
             >
               <Edit2 className="h-4 w-4" />
             </Button>
           </div>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
               <p className="text-muted-foreground">Provider</p>
               <p className="font-medium capitalize">{reviewData.llm.provider}</p>
             </div>
             <div>
               <p className="text-muted-foreground">Model</p>
               <p className="font-medium">{reviewData.llm.model}</p>
             </div>
             <div>
               <p className="text-muted-foreground">Temperature</p>
               <p className="font-medium">{reviewData.llm.temperature}</p>
             </div>
             <div>
               <p className="text-muted-foreground">Max Tokens</p>
               <p className="font-medium">{reviewData.llm.maxTokens}</p>
             </div>
           </div>
           <div className="space-y-2">
             <p className="text-sm text-muted-foreground">System Prompt</p>
             <p className="text-xs bg-muted p-2 rounded font-mono">
               {reviewData.llm.systemPrompt.substring(0, 100)}...
             </p>
           </div>
         </CardContent>
       </Card>

       {/* Cost Estimation */}
       <Card className="border-primary/50 bg-primary/5">
         <CardHeader className="pb-4">
           <div className="flex items-center gap-3">
             <DollarSign className="h-5 w-5 text-primary" />
             <CardTitle className="text-base">Cost Estimation</CardTitle>
           </div>
         </CardHeader>
         <CardContent>
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-sm text-muted-foreground">Estimated queries per day</span>
               <span className="font-medium">{reviewData.estimates.queriesPerDay.toLocaleString()}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-sm text-muted-foreground">Average response time</span>
               <span className="font-medium">{reviewData.estimates.avgLatency}ms</span>
             </div>
             <div className="flex items-center justify-between pt-2 border-t">
               <span className="font-medium">Estimated daily cost</span>
               <span className="font-bold text-lg">${reviewData.estimates.costPerDay.toFixed(2)}</span>
             </div>
           </div>
         </CardContent>
       </Card>
     </div>

     {/* Terms Agreement */}
     <Card>
       <CardContent className="pt-6">
         <div className="flex items-start gap-3">
           <Switch
             id="terms"
             checked={agreedToTerms}
             onCheckedChange={setAgreedToTerms}
           />
           <div className="space-y-1">
             <Label htmlFor="terms" className="cursor-pointer">
               I understand the costs and agree to deploy this pipeline
             </Label>
             <p className="text-xs text-muted-foreground">
               You can pause or delete the pipeline at any time from the dashboard
             </p>
           </div>
         </div>
       </CardContent>
     </Card>

     {/* Actions */}
     <div className="flex items-center justify-between">
       <Button variant="outline" onClick={handleBack}>
         <ChevronLeft className="mr-2 h-4 w-4" />
         Back
       </Button>
       <div className="flex gap-3">
         <Button variant="outline" onClick={handleTestQuery}>
           Test Query
         </Button>
         <Button
           onClick={handleDeploy}
           disabled={!agreedToTerms || isDeploying}
         >
           {isDeploying ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Deploying...
             </>
           ) : (
             <>
               <Rocket className="mr-2 h-4 w-4" />
               Deploy Pipeline
             </>
           )}
         </Button>
       </div>
     </div>
   </div>
 )
}