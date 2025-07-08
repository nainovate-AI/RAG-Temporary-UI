'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  ScrollText,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Save,
  X,
  Eye,
  Code,
  MessageSquare,
  Sparkles,
  Clock,
  Users,
  BookOpen,
  FileText,
  Star,
  StarOff,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface PromptTemplate {
  id: string
  name: string
  description: string
  category: 'qa' | 'summarization' | 'extraction' | 'chat' | 'custom'
  systemPrompt: string
  userPromptTemplate: string
  variables: string[]
  examples?: Array<{
    input: Record<string, string>
    output: string
  }>
  tags: string[]
  isDefault: boolean
  usage: {
    pipelines: number
    executions: number
    avgScore: number
  }
  createdAt: string
  updatedAt: string
  author: string
}

const mockPrompts: PromptTemplate[] = [
  {
    id: '1',
    name: 'Customer Support Q&A',
    description: 'Professional customer support responses with context-aware answers',
    category: 'qa',
    systemPrompt: `You are a helpful customer support assistant with access to a knowledge base. Use the provided context to answer questions accurately. If the answer is not in the context, say so politely.

Guidelines:
- Be concise but thorough
- Use a friendly, professional tone
- Reference specific information from the context when available
- Suggest related topics if appropriate`,
    userPromptTemplate: `Context information:
{context}

Previous conversation:
{chat_history}

Customer question: {query}

Please provide a helpful and accurate response based on the context above.`,
    variables: ['context', 'chat_history', 'query'],
    examples: [
      {
        input: {
          context: 'Our refund policy allows returns within 30 days of purchase...',
          query: 'Can I return an item after 45 days?',
          chat_history: ''
        },
        output: 'I understand you\'d like to return an item after 45 days. According to our refund policy, we accept returns within 30 days of purchase. Since your item is beyond this timeframe, a standard return wouldn\'t be possible. However, I\'d be happy to explore other options for you, such as store credit or checking if your item qualifies for our extended warranty program.'
      }
    ],
    tags: ['customer-support', 'qa', 'production'],
    isDefault: true,
    usage: {
      pipelines: 3,
      executions: 12847,
      avgScore: 4.8
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    author: 'System'
  },
  {
    id: '2',
    name: 'Technical Documentation Search',
    description: 'Code-aware responses for technical documentation queries',
    category: 'qa',
    systemPrompt: `You are a technical documentation assistant specializing in software development. Provide accurate, detailed answers based on the documentation context. Include code examples when relevant.

Guidelines:
- Use technical terminology appropriately
- Include code snippets with proper formatting
- Mention version compatibility when relevant
- Link to related documentation sections`,
    userPromptTemplate: `Documentation context:
{context}

Query: {query}

Language/Framework: {language}

Please provide a detailed technical response with code examples if applicable.`,
    variables: ['context', 'query', 'language'],
    tags: ['technical', 'documentation', 'code'],
    isDefault: false,
    usage: {
      pipelines: 2,
      executions: 8934,
      avgScore: 4.6
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    author: 'DevTeam'
  },
  {
    id: '3',
    name: 'Legal Document Summarization',
    description: 'Extract key points and summarize legal documents',
    category: 'summarization',
    systemPrompt: `You are a legal document analyst. Summarize legal documents by extracting key points, obligations, and important dates. Maintain accuracy and use appropriate legal terminology.

Guidelines:
- Identify parties involved
- Extract key obligations and rights
- Highlight important dates and deadlines
- Note any unusual or concerning clauses
- Maintain neutral, professional tone`,
    userPromptTemplate: `Legal document:
{context}

Document type: {document_type}

Please provide a comprehensive summary including:
1. Parties involved
2. Key terms and obligations
3. Important dates
4. Notable clauses or concerns`,
    variables: ['context', 'document_type'],
    tags: ['legal', 'summarization', 'compliance'],
    isDefault: false,
    usage: {
      pipelines: 1,
      executions: 3421,
      avgScore: 4.9
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    author: 'LegalTeam'
  },
  {
    id: '4',
    name: 'Multi-turn Conversation',
    description: 'Context-aware chat with conversation memory',
    category: 'chat',
    systemPrompt: `You are an intelligent conversational assistant. Maintain context across multiple turns, remember previous exchanges, and provide coherent, contextual responses.

Guidelines:
- Reference previous conversation naturally
- Maintain consistent personality
- Ask clarifying questions when needed
- Provide helpful suggestions`,
    userPromptTemplate: `Conversation history:
{chat_history}

Current context:
{context}

User: {query}
Assistant: Provide a contextual response that continues the conversation naturally.`,
    variables: ['chat_history', 'context', 'query'],
    tags: ['chat', 'conversational', 'memory'],
    isDefault: false,
    usage: {
      pipelines: 2,
      executions: 5678,
      avgScore: 4.7
    },
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    author: 'AITeam'
  },
]

const categoryInfo = {
  qa: { icon: MessageSquare, label: 'Q&A', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  summarization: { icon: FileText, label: 'Summarization', color: 'text-green-500', bgColor: 'bg-green-500/10' },
  extraction: { icon: BookOpen, label: 'Extraction', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  chat: { icon: Users, label: 'Chat', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  custom: { icon: Sparkles, label: 'Custom', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
}

export default function PromptsPage() {
  const [prompts] = useState(mockPrompts)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState<Record<string, boolean>>({})
  const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({})

  const togglePreview = (promptId: string) => {
    setShowPreview(prev => ({ ...prev, [promptId]: !prev[promptId] }))
  }

  const toggleExamples = (promptId: string) => {
    setExpandedExamples(prev => ({ ...prev, [promptId]: !prev[promptId] }))
  }

  const handleEdit = (promptId: string) => {
    setEditingPrompt(promptId)
    setSelectedPrompt(promptId)
  }

  const handleSave = () => {
    // In a real app, this would save the prompt
    setEditingPrompt(null)
  }

  const handleCancel = () => {
    setEditingPrompt(null)
  }

  const renderPromptPreview = (template: string, variables: string[]) => {
    return template.split(/(\{[^}]+\})/).map((part, index) => {
      const variable = part.match(/^\{([^}]+)\}$/)
      if (variable && variables.includes(variable[1])) {
        return (
          <span key={index} className="text-purple-400 bg-purple-400/10 px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <MainLayout>
      <PageHeader
        title="Prompt Templates"
        description="Manage and optimize your prompt templates"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </PageHeader>

      <PageContent>
        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg mb-8">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary mb-1">Prompt Engineering Best Practices</p>
            <p className="text-muted-foreground">
              Well-crafted prompts are crucial for RAG performance. Use clear instructions, 
              provide examples, and leverage variables for dynamic content. Test prompts with 
              different contexts to ensure consistent quality.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 mb-6 pb-4 border-b border-border overflow-x-auto">
          <Button variant="outline" size="sm" className="shrink-0">
            All Templates
            <Badge variant="secondary" className="ml-2">{prompts.length}</Badge>
          </Button>
          {Object.entries(categoryInfo).map(([key, info]) => {
            const Icon = info.icon
            const count = prompts.filter(p => p.category === key).length
            if (count === 0) return null
            
            return (
              <Button key={key} variant="outline" size="sm" className="shrink-0">
                <Icon className="mr-2 h-4 w-4" />
                {info.label}
                <Badge variant="secondary" className="ml-2">{count}</Badge>
              </Button>
            )
          })}
        </div>

        {/* Prompts Grid */}
        <div className="grid gap-6">
          {prompts.map((prompt) => {
            const categoryMeta = categoryInfo[prompt.category]
            const Icon = categoryMeta.icon
            const isSelected = selectedPrompt === prompt.id
            const isEditing = editingPrompt === prompt.id
            const isPreviewing = showPreview[prompt.id]
            const isExamplesExpanded = expandedExamples[prompt.id]
            
            return (
              <Card 
                key={prompt.id} 
                className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${categoryMeta.bgColor}`}>
                        <Icon className={`h-5 w-5 ${categoryMeta.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          {prompt.name}
                          {prompt.isDefault && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(prompt.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSave}
                            className="text-green-500 hover:text-green-600"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancel}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Usage Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-semibold">{prompt.usage.pipelines}</p>
                      <p className="text-xs text-muted-foreground">Pipelines</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-semibold">{prompt.usage.executions.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Executions</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-semibold">⭐ {prompt.usage.avgScore}</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>

                  {/* Tags and Variables */}
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prompt.variables.map((variable) => (
                        <Badge key={variable} variant="outline" className="font-mono text-xs">
                          {`{${variable}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* System Prompt */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    {isEditing ? (
                      <Textarea
                        value={prompt.systemPrompt}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    ) : (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap font-mono">
                          {prompt.systemPrompt}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* User Prompt Template */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">User Prompt Template</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePreview(prompt.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {isPreviewing ? 'Hide' : 'Show'} Preview
                      </Button>
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={prompt.userPromptTemplate}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    ) : (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap font-mono">
                          {isPreviewing 
                            ? renderPromptPreview(prompt.userPromptTemplate, prompt.variables)
                            : prompt.userPromptTemplate
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Examples */}
                  {prompt.examples && prompt.examples.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleExamples(prompt.id)}
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                      >
                        {isExamplesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        Examples ({prompt.examples.length})
                      </button>
                      
                      {isExamplesExpanded && (
                        <div className="mt-3 space-y-3">
                          {prompt.examples.map((example, index) => (
                            <div key={index} className="p-3 bg-muted/20 rounded-lg space-y-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
                                {Object.entries(example.input).map(([key, value]) => (
                                  <div key={key} className="text-sm">
                                    <span className="font-mono text-purple-400">{`{${key}}`}:</span>{' '}
                                    <span className="text-muted-foreground">{value}</span>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Output:</p>
                                <p className="text-sm text-muted-foreground">{example.output}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {!isEditing && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated {formatDate(prompt.updatedAt)}
                        </span>
                        <span>by {prompt.author}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Code className="mr-2 h-4 w-4" />
                          Test
                        </Button>
                        {!prompt.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </PageContent>
    </MainLayout>
  )
}