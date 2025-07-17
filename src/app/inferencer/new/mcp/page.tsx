// src/app/inferencer/new/mcp/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Settings,
  Plus,
  Database,
  Globe,
  Mail,
  FolderOpen,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MCPServer } from '@/types/pipeline.types'

const availableMCPServers: MCPServer[] = [
  {
    id: 'database',
    name: 'Database Query Server',
    description: 'Execute SQL queries on connected databases',
    type: 'database',
    icon: '📊',
    status: 'disconnected',
    config: {
      url: 'localhost:8765',
      permissions: ['read'],
      settings: {
        databases: ['analytics_db', 'customer_db'],
        timeout: 30,
        maxResults: 1000,
      }
    }
  },
  {
    id: 'web',
    name: 'Web Browser Server',
    description: 'Browse web pages and extract content',
    type: 'web',
    icon: '🌐',
    status: 'disconnected',
    config: {
      url: 'localhost:8766',
      permissions: ['browse', 'extract'],
    }
  },
  {
    id: 'email',
    name: 'Email Server',
    description: 'Read and compose emails',
    type: 'email',
    icon: '📧',
    status: 'disconnected',
    config: {
      url: 'localhost:8767',
      permissions: ['read'],
    }
  },
  {
    id: 'filesystem',
    name: 'File System Server',
    description: 'Access and manage local files',
    type: 'filesystem',
    icon: '📁',
    status: 'disconnected',
    config: {
      url: 'localhost:8768',
      permissions: ['read'],
      settings: {
        allowedPaths: ['/data', '/documents'],
      }
    }
  },
]

export default function MCPConfigPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pipelineType = searchParams.get('type')
  
  const [enabledServers, setEnabledServers] = useState<string[]>([])
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'error'>>({})

  const toggleServer = (serverId: string) => {
    if (enabledServers.includes(serverId)) {
      setEnabledServers(prev => prev.filter(id => id !== serverId))
      setConnectionStatus(prev => {
        const updated = { ...prev }
        delete updated[serverId]
        return updated
      })
    } else {
      setEnabledServers(prev => [...prev, serverId])
    }
  }

  const openConfig = (server: MCPServer) => {
    setSelectedServer(server)
    setConfigModalOpen(true)
  }

  const testConnection = async (serverId: string) => {
    setTestingConnection(serverId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setConnectionStatus(prev => ({
      ...prev,
      [serverId]: Math.random() > 0.3 ? 'connected' : 'error'
    }))
    setTestingConnection(null)
  }

  const handleNext = () => {
    router.push(`/inferencer/new/llm?type=${pipelineType}`)
  }

  const handleBack = () => {
    router.push(`/inferencer/new/memory?type=${pipelineType}`)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'database': return Database
      case 'web': return Globe
      case 'email': return Mail
      case 'filesystem': return FolderOpen
      default: return Settings
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Model Context Protocol (MCP)</p>
          <p className="text-muted-foreground">
            Connect external tools and services to enhance your pipeline capabilities. 
            MCP servers provide access to databases, web browsing, file systems, and more.
          </p>
        </div>
      </div>

      {/* MCP Servers */}
      <Card>
        <CardHeader>
          <CardTitle>Available MCP Servers</CardTitle>
          <CardDescription>
            Select and configure the tools you want to make available to your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableMCPServers.map((server) => {
            const Icon = getIcon(server.type)
            const isEnabled = enabledServers.includes(server.id)
            const status = connectionStatus[server.id]
            const isTesting = testingConnection === server.id
            
            return (
              <div
                key={server.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border transition-all",
                  isEnabled ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleServer(server.id)}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{server.icon}</span>
                    <h4 className="font-medium">{server.name}</h4>
                    {isEnabled && status && (
                      <Badge 
                        variant={status === 'connected' ? 'success' : 'destructive'}
                        className="text-xs"
                      >
                        {status === 'connected' ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Connected
                          </>
                        ) : (
                          <>
                            <X className="mr-1 h-3 w-3" />
                            Error
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {server.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Icon className="h-3 w-3" />
                    <span>Status: {isEnabled && status ? status : 'Not configured'}</span>
                  </div>
                </div>
                
                {isEnabled && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openConfig(server)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(server.id)}
                      disabled={isTesting}
                    >
                      {isTesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
          
          {/* Add Custom MCP Server */}
          <button
            className="flex items-center gap-3 w-full p-4 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors"
            onClick={() => {/* Open custom server dialog */}}
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Custom MCP Server</span>
          </button>
        </CardContent>
      </Card>

      {/* Enabled Summary */}
      {enabledServers.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Enabled: {enabledServers.length} server{enabledServers.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-muted-foreground">
                Estimated additional latency: +{enabledServers.length * 10}-{enabledServers.length * 20}ms
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Next: LLM & Prompts
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Configuration Modal - simplified for brevity */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedServer?.name}</DialogTitle>
            <DialogDescription>
              Set up the connection and permissions for this MCP server
            </DialogDescription>
          </DialogHeader>
          {/* Add configuration form here */}
        </DialogContent>
      </Dialog>
    </div>
  )
}