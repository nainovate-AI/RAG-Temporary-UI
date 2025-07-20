'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play,
  Loader2,
  ChevronRight,
  ChevronDown,
  FileText,
  Clock,
  Coins,
  Brain,
  Copy,
  RotateCcw
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { RetrievedDocument } from '@/types'

// Mock data
const pipelines = [
  { id: '1', name: 'Customer Support RAG v2' },
  { id: '2', name: 'Technical Documentation' },
  { id: '3', name: 'Legal Contract Analysis' },
  { id: '4', name: 'Product Knowledge Base' },
]

const mockRetrievedDocs: RetrievedDocument[] = [
  {
    id: '1',
    content: 'To integrate the payment SDK with React, first install the package using npm: npm install @company/payment-sdk. Then import the PaymentProvider component and wrap your app. For one-time payments, use the createPayment method, and for subscriptions, use the createSubscription method with the appropriate parameters...',
    score: 0.94,
    metadata: {
      filename: 'integration-guide.md',
      collectionName: 'Demo Collection',
      updatedAt: '2 days ago',
      category: 'Technical Docs'
    }
  },
  {
    id: '2',
    content: "Here's a complete example of implementing payment SDK in a React application. This example shows both one-time payment flow and subscription management. First, set up your payment configuration...",
    score: 0.89,
    metadata: {
      filename: 'react-examples.tsx',
      collectionName: 'Demo Collection',
      updatedAt: '1 week ago',
      category: 'Code Examples'
    }
  },
  {
    id: '3',
    content: 'The subscription API allows you to create, update, and manage recurring payments. When integrating with React, you can use the useSubscription hook for reactive subscription state management...',
    score: 0.85,
    metadata: {
      filename: 'api-reference.md',
      collectionName: 'Demo Collection',
      updatedAt: '3 days ago',
      category: 'API Docs'
    }
  },
]

export default function PlaygroundPage() {
  const [selectedPipeline, setSelectedPipeline] = useState(pipelines[0].id)
  const [query, setQuery] = useState('How do I integrate the payment SDK with a React application? I need to handle both one-time payments and subscriptions.')
  const [isLoading, setIsLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [showTrace, setShowTrace] = useState(false)

  const handleRunQuery = async () => {
    setIsLoading(true)
    setShowResponse(false)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowResponse(true)
    }, 2000)
  }

  const handleClear = () => {
    setQuery('')
    setShowResponse(false)
    setShowTrace(false)
  }

  return (
    <MainLayout className="p-0">
      <div className="flex h-screen">
        {/* Left Panel - Query Input */}
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Query Playground</h1>
              <p className="text-muted-foreground">Test your RAG pipelines with real queries</p>
            </div>

            {/* Pipeline Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Pipeline</label>
              <select
                value={selectedPipeline}
                onChange={(e) => setSelectedPipeline(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {pipelines.map((pipeline) => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Query Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Your Query</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question..."
                className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button 
                onClick={handleRunQuery} 
                disabled={!query || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Query
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            {/* Retrieved Documents */}
            {showResponse && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  Retrieved Documents
                  <Badge variant="secondary">{mockRetrievedDocs.length}</Badge>
                </h2>
                
                <div className="space-y-4">
                  {mockRetrievedDocs.map((doc) => (
                    <Card key={doc.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium">
                            {doc.metadata.filename}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {(doc.score * 100).toFixed(0)}% match
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {doc.content.split(' ').map((word, i) => {
                            const highlight = ['React', 'payment', 'SDK', 'one-time', 'subscriptions'].includes(word.replace(/[.,]/g, ''))
                            return highlight ? (
                              <span key={i} className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-0.5 rounded">
                                {word}{' '}
                              </span>
                            ) : (
                              word + ' '
                            )
                          })}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {doc.metadata.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated {doc.metadata.updatedAt}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Response */}
        <div className="w-1/2 bg-muted/30 overflow-y-auto">
          <div className="p-8">
            {!showResponse ? (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Run a query to see the generated response</p>
                </div>
              </div>
            ) : (
              <>
                {/* Generated Response */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Generated Response</h2>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>To integrate the payment SDK with your React application for both one-time payments and subscriptions, follow these steps:</p>
                        
                        <p><strong>1. Installation</strong><sup className="text-primary cursor-pointer">[1]</sup><br />
                        First, install the payment SDK package:<br />
                        <code className="bg-muted px-2 py-1 rounded">npm install @company/payment-sdk</code></p>
                        
                        <p><strong>2. Setup PaymentProvider</strong><sup className="text-primary cursor-pointer">[1,2]</sup><br />
                        Wrap your React app with the PaymentProvider component to make payment functionality available throughout your application.</p>
                        
                        <p><strong>3. One-Time Payments</strong><sup className="text-primary cursor-pointer">[1]</sup><br />
                        Use the <code className="bg-muted px-2 py-1 rounded">createPayment</code> method to handle one-time payments. This method accepts amount, currency, and optional metadata.</p>
                        
                        <p><strong>4. Subscription Management</strong><sup className="text-primary cursor-pointer">[1,3]</sup><br />
                        For subscriptions, use the <code className="bg-muted px-2 py-1 rounded">createSubscription</code> method with plan ID and customer details. The SDK also provides a <code className="bg-muted px-2 py-1 rounded">useSubscription</code> hook for reactive state management in React components.</p>
                        
                        <p>Would you like me to show you specific code examples for either payment type?</p>
                      </div>
                      
                      <div className="flex gap-2 mt-6 pt-6 border-t">
                        <Button variant="outline" size="sm">
                          <Copy className="mr-2 h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">287ms</p>
                        <p className="text-sm text-muted-foreground">Total Latency</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">845</p>
                        <p className="text-sm text-muted-foreground">Tokens Used</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">$0.0084</p>
                        <p className="text-sm text-muted-foreground">Query Cost</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">GPT-4</p>
                        <p className="text-sm text-muted-foreground">Model Used</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Execution Trace */}
                <div>
                  <button
                    onClick={() => setShowTrace(!showTrace)}
                    className="flex items-center gap-2 text-sm font-medium mb-4 hover:text-primary transition-colors"
                  >
                    {showTrace ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    View Execution Trace
                  </button>
                  
                  {showTrace && (
                    <Card className="bg-black/50 border-muted">
                      <CardContent className="pt-6 font-mono text-xs">
                        <div className="space-y-3">
                          <div>
                            <div className="text-purple-400 mb-1">1. Query Embedding</div>
                            <div className="text-muted-foreground pl-4">
                              Model: text-embedding-ada-002 | Time: 45ms | Tokens: 28
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-400 mb-1">2. Vector Search</div>
                            <div className="text-muted-foreground pl-4">
                              Index: customer-support-v2 | Results: 10 | Time: 67ms
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-400 mb-1">3. Reranking</div>
                            <div className="text-muted-foreground pl-4">
                              Model: cohere-rerank-v2 | Input: 10 | Output: 5 | Time: 89ms
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-400 mb-1">4. Context Building</div>
                            <div className="text-muted-foreground pl-4">
                              Chunks: 5 | Total tokens: 1,847 | Time: 12ms
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-400 mb-1">5. LLM Generation</div>
                            <div className="text-muted-foreground pl-4">
                              Model: gpt-4-turbo | Input: 1,875 | Output: 287 | Time: 74ms
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}


