'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { 
  FileText,
  Plus,
  Search,
  Clock,
  TrendingUp,
  Edit2,
  Copy,
  Trash2,
  PlayCircle,
  History,
  Star,
  StarOff,
  X,
  Save,
  MessageSquare,
  FileQuestion,
  Sparkles,
  ListChecks,
  Hash,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Info,
  Check,
  RefreshCw
} from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

// Categories with icons and colors
const categories = {
  qa: { 
    name: 'Q&A', 
    icon: MessageSquare, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-500/10',
    description: 'Question answering prompts' 
  },
  summarization: { 
    name: 'Summarization', 
    icon: FileText, 
    color: 'text-green-500', 
    bgColor: 'bg-green-500/10',
    description: 'Text summarization templates' 
  },
  extraction: { 
    name: 'Extraction', 
    icon: FileQuestion, 
    color: 'text-purple-500', 
    bgColor: 'bg-purple-500/10',
    description: 'Information extraction prompts' 
  },
  analysis: { 
    name: 'Analysis', 
    icon: Sparkles, 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-500/10',
    description: 'Data analysis templates' 
  },
  classification: { 
    name: 'Classification', 
    icon: ListChecks, 
    color: 'text-pink-500', 
    bgColor: 'bg-pink-500/10',
    description: 'Text classification prompts' 
  },
  custom: { 
    name: 'Custom', 
    icon: Hash, 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-500/10',
    description: 'User-defined templates' 
  }
}

// Mock data for prompts
const mockPrompts = [
  {
    id: '1',
    name: 'Customer Support Assistant',
    category: 'qa',
    description: 'Professional customer support responses with empathy and solution focus',
    systemPrompt: 'You are a helpful customer support assistant. Always be polite, empathetic, and solution-oriented. Use the provided context to answer customer questions accurately.',
    userPromptTemplate: 'Context: {context}\n\nCustomer Question: {query}\n\nProvide a helpful and professional response.',
    variables: ['context', 'query'],
    tags: ['support', 'customer-service', 'professional'],
    usage: {
      count: 15234,
      lastUsed: '2024-01-15T10:30:00Z',
      avgTokens: 450,
      avgLatency: 1.2,
      successRate: 94.5
    },
    versions: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    isFavorite: true
  },
  {
    id: '2',
    name: 'Technical Documentation Summary',
    category: 'summarization',
    description: 'Concise technical documentation summaries with key points highlighted',
    systemPrompt: 'You are a technical writer specializing in creating clear, concise summaries of complex documentation. Focus on key concepts, implementation details, and important warnings.',
    userPromptTemplate: 'Documentation:\n{content}\n\nCreate a concise summary highlighting:\n1. Main purpose\n2. Key features\n3. Implementation steps\n4. Important considerations',
    variables: ['content'],
    tags: ['technical', 'documentation', 'summary'],
    usage: {
      count: 8921,
      lastUsed: '2024-01-15T09:15:00Z',
      avgTokens: 320,
      avgLatency: 0.9,
      successRate: 96.2
    },
    versions: 2,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    isFavorite: true
  },
  {
    id: '3',
    name: 'Contract Key Terms Extractor',
    category: 'extraction',
    description: 'Extract important terms, dates, and obligations from legal contracts',
    systemPrompt: 'You are a legal analyst expert at identifying and extracting key information from contracts. Focus on parties involved, important dates, financial terms, obligations, and termination clauses.',
    userPromptTemplate: 'Contract Text:\n{document}\n\nExtract and list:\n- Parties involved\n- Key dates and deadlines\n- Financial terms\n- Main obligations\n- Termination conditions',
    variables: ['document'],
    tags: ['legal', 'contract', 'extraction'],
    usage: {
      count: 3456,
      lastUsed: '2024-01-14T16:45:00Z',
      avgTokens: 680,
      avgLatency: 1.8,
      successRate: 91.3
    },
    versions: 4,
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-08T09:00:00Z',
    isFavorite: false
  }
]

export default function PromptsLibraryPage() {
  const [prompts, setPrompts] = useState(mockPrompts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set())
  const [testVariables, setTestVariables] = useState<Record<string, string>>({})
  const [testResult, setTestResult] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // New prompt form state
  const [newPrompt, setNewPrompt] = useState({
    name: '',
    category: 'qa',
    description: '',
    systemPrompt: '',
    userPromptTemplate: '',
    tags: [] as string[],
    currentTag: ''
  })

  // Calculate stats
  const totalPrompts = prompts.length
  const totalUsage = prompts.reduce((acc, p) => acc + p.usage.count, 0)
  const avgSuccessRate = prompts.reduce((acc, p) => acc + p.usage.successRate, 0) / prompts.length
  const favoriteCount = prompts.filter(p => p.isFavorite).length

  // Filter prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory
    const matchesSearch = prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (promptId: string) => {
    const newExpanded = new Set(expandedPrompts)
    if (newExpanded.has(promptId)) {
      newExpanded.delete(promptId)
    } else {
      newExpanded.add(promptId)
    }
    setExpandedPrompts(newExpanded)
  }

  const toggleFavorite = (promptId: string) => {
    setPrompts(prompts.map(p => 
      p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
    ))
  }

  const duplicatePrompt = (prompt: any) => {
    const newPromptData = {
      ...prompt,
      id: Date.now().toString(),
      name: `${prompt.name} (Copy)`,
      usage: {
        count: 0,
        lastUsed: new Date().toISOString(),
        avgTokens: 0,
        avgLatency: 0,
        successRate: 0
      },
      versions: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false
    }
    setPrompts([newPromptData, ...prompts])
  }

  const openTestModal = (prompt: any) => {
    setSelectedPrompt(prompt)
    setTestVariables(
      prompt.variables.reduce((acc: any, v: string) => ({ ...acc, [v]: '' }), {})
    )
    setTestResult('')
    setShowTestModal(true)
  }

  const runTest = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setTestResult(`This is a simulated response based on your prompt template.\n\nSystem: ${selectedPrompt.systemPrompt}\n\nUser prompt with variables replaced:\n${selectedPrompt.userPromptTemplate.replace(/{(\w+)}/g, (match: string, variable: string) => testVariables[variable] || match)}`)
      setIsGenerating(false)
    }, 2000)
  }

  const extractVariables = (template: string): string[] => {
    const matches = template.match(/{(\w+)}/g)
    return matches ? matches.map(m => m.slice(1, -1)) : []
  }

  const handleCreatePrompt = () => {
    const variables = extractVariables(newPrompt.userPromptTemplate)
    const prompt = {
      id: Date.now().toString(),
      ...newPrompt,
      variables,
      tags: newPrompt.tags,
      usage: {
        count: 0,
        lastUsed: new Date().toISOString(),
        avgTokens: 0,
        avgLatency: 0,
        successRate: 0
      },
      versions: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false
    }
    setPrompts([prompt, ...prompts])
    setShowCreateModal(false)
    setNewPrompt({
      name: '',
      category: 'qa',
      description: '',
      systemPrompt: '',
      userPromptTemplate: '',
      tags: [],
      currentTag: ''
    })
  }

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPrompt.currentTag.trim()) {
      e.preventDefault()
      setNewPrompt({
        ...newPrompt,
        tags: [...newPrompt.tags, newPrompt.currentTag.trim()],
        currentTag: ''
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setNewPrompt({
      ...newPrompt,
      tags: newPrompt.tags.filter(tag => tag !== tagToRemove)
    })
  }

  return (
    <MainLayout>
      <PageHeader
        title="Prompts Library"
        description="Manage and optimize your prompt templates"
      >
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPrompts}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalUsage)}</div>
              <p className="text-xs text-muted-foreground">Times used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Average across templates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoriteCount}</div>
              <p className="text-xs text-muted-foreground">Starred templates</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {Object.entries(categories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="gap-2"
              >
                <category.icon className="h-3 w-3" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompts List */}
        <div className="space-y-4">
          {filteredPrompts.map((prompt) => {
            const category = categories[prompt.category as keyof typeof categories]
            const isExpanded = expandedPrompts.has(prompt.id)

            return (
              <Card key={prompt.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        category.bgColor
                      )}>
                        <category.icon className={cn("h-5 w-5", category.color)} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{prompt.name}</CardTitle>
                          {prompt.isFavorite && (
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          )}
                        </div>
                        <CardDescription>{prompt.description}</CardDescription>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last used {new Date(prompt.usage.lastUsed).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {formatNumber(prompt.usage.count)} uses
                          </span>
                          <span className="flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            {prompt.usage.successRate}% success
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {prompt.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(prompt.id)}
                      >
                        {isExpanded ? (
                          <>
                            <EyeOff className="mr-2 h-3 w-3" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(prompt.id)}
                      >
                        {prompt.isFavorite ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openTestModal(prompt)}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => duplicatePrompt(prompt)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* System Prompt */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">System Prompt</Label>
                        <div className="p-3 bg-secondary/50 rounded-lg font-mono text-sm">
                          {prompt.systemPrompt}
                        </div>
                      </div>

                      {/* User Prompt Template */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">User Prompt Template</Label>
                        <div className="p-3 bg-secondary/50 rounded-lg font-mono text-sm whitespace-pre-wrap">
                          {prompt.userPromptTemplate.split(/(\{[^}]+\})/).map((part, index) => {
                            if (part.match(/^\{[^}]+\}$/)) {
                              return (
                                <span key={index} className="text-primary font-bold">
                                  {part}
                                </span>
                              )
                            }
                            return part
                          })}
                        </div>
                      </div>

                      {/* Variables */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Variables</Label>
                        <div className="flex gap-2">
                          {prompt.variables.map((variable) => (
                            <Badge key={variable} variant="outline">
                              {`{${variable}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Version History */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <History className="h-4 w-4" />
                          <span>{prompt.versions} versions</span>
                          <span>•</span>
                          <span>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <History className="mr-2 h-3 w-3" />
                          View History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Create Prompt Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create Prompt Template</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCreateModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prompt-name">Template Name</Label>
                      <Input
                        id="prompt-name"
                        placeholder="e.g., Customer Support Assistant"
                        value={newPrompt.name}
                        onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prompt-category">Category</Label>
                      <select
                        id="prompt-category"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={newPrompt.category}
                        onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
                      >
                        {Object.entries(categories).map(([key, category]) => (
                          <option key={key} value={key}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt-description">Description</Label>
                    <Input
                      id="prompt-description"
                      placeholder="Brief description of what this prompt does"
                      value={newPrompt.description}
                      onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                      id="system-prompt"
                      placeholder="Define the AI's role and behavior..."
                      rows={4}
                      value={newPrompt.systemPrompt}
                      onChange={(e) => setNewPrompt({ ...newPrompt, systemPrompt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-template">User Prompt Template</Label>
                    <Textarea
                      id="user-template"
                      placeholder="Use {variable} syntax for dynamic content..."
                      rows={6}
                      value={newPrompt.userPromptTemplate}
                      onChange={(e) => setNewPrompt({ ...newPrompt, userPromptTemplate: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Variables detected: {extractVariables(newPrompt.userPromptTemplate).map(v => `{${v}}`).join(', ') || 'None'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="space-y-2">
                      <Input
                        id="tags"
                        placeholder="Press Enter to add tags"
                        value={newPrompt.currentTag}
                        onChange={(e) => setNewPrompt({ ...newPrompt, currentTag: e.target.value })}
                        onKeyDown={addTag}
                      />
                      <div className="flex flex-wrap gap-2">
                        {newPrompt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePrompt}
                      disabled={!newPrompt.name || !newPrompt.systemPrompt || !newPrompt.userPromptTemplate}
                    >
                      Create Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Test Prompt Modal */}
        {showTestModal && selectedPrompt && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Test Prompt: {selectedPrompt.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowTestModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Variable Inputs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Fill in Variables</h4>
                    {selectedPrompt.variables.map((variable: string) => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={`var-${variable}`}>{variable}</Label>
                        <Textarea
                          id={`var-${variable}`}
                          placeholder={`Enter value for {${variable}}`}
                          rows={3}
                          value={testVariables[variable] || ''}
                          onChange={(e) => setTestVariables({
                            ...testVariables,
                            [variable]: e.target.value
                          })}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Run Test Button */}
                  <div className="flex justify-center pt-4 border-t">
                    <Button
                      onClick={runTest}
                      disabled={isGenerating || !selectedPrompt.variables.every((v: string) => testVariables[v])}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Test Result */}
                  {testResult && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <Label>Generated Output</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(testResult)}
                        >
                          <Copy className="h-3 w-3 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-lg whitespace-pre-wrap font-mono text-sm">
                        {testResult}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </PageContent>
    </MainLayout>
  )
}