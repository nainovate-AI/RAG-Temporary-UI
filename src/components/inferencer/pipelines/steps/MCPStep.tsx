'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { WizardStepProps } from '@/types/wizard.types';
import { 
  Info, 
  Cpu, 
  Database, 
  Globe, 
  Mail, 
  FileText, 
  Terminal, 
  Plus, 
  Trash2, 
  Settings,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MCPData {
  enabled: boolean;
  servers: Array<{
    id: string;
    name: string;
    type: string;
    status?: 'connected' | 'disconnected' | 'error';
    config?: any;
  }>;
  _isValid?: boolean;
}

const availableServers = [
  {
    id: 'web-search',
    name: 'Web Search',
    type: 'web',
    icon: Globe,
    description: 'Search the web for real-time information',
    configFields: ['apiKey', 'searchEngine'],
  },
  {
    id: 'database',
    name: 'SQL Database',
    type: 'database',
    icon: Database,
    description: 'Query your SQL databases',
    configFields: ['connectionString', 'allowedTables'],
  },
  {
    id: 'email',
    name: 'Email Integration',
    type: 'email',
    icon: Mail,
    description: 'Send and read emails',
    configFields: ['provider', 'credentials'],
  },
  {
    id: 'file-system',
    name: 'File System',
    type: 'filesystem',
    icon: FileText,
    description: 'Access and manage files',
    configFields: ['basePath', 'permissions'],
  },
  {
    id: 'terminal',
    name: 'Terminal/Shell',
    type: 'terminal',
    icon: Terminal,
    description: 'Execute shell commands',
    configFields: ['allowedCommands', 'workingDirectory'],
  },
];

export function MCPStep({ data, onChange }: WizardStepProps) {
  const [localData, setLocalData] = useState<MCPData>(() => {
    const initialData = data as MCPData;
    return {
      enabled: initialData?.enabled ?? false,
      servers: initialData?.servers || [],
    };
  });

  const [showAddServer, setShowAddServer] = useState(false);

  useEffect(() => {
    onChange({ ...localData, _isValid: true }); // Always valid
  }, [localData, onChange]);

  const updateField = (field: keyof MCPData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleEnableToggle = (enabled: boolean) => {
    updateField('enabled', enabled);
    if (!enabled) {
      updateField('servers', []);
    }
  };

  const addServer = (serverId: string) => {
    const serverTemplate = availableServers.find(s => s.id === serverId);
    if (!serverTemplate) return;

    const newServer = {
      id: `${serverId}-${Date.now()}`,
      name: serverTemplate.name,
      type: serverTemplate.type,
      status: 'disconnected' as const,
      config: {},
    };

    setLocalData(prev => ({
      ...prev,
      servers: [...prev.servers, newServer],
    }));
    setShowAddServer(false);
  };

  const removeServer = (serverId: string) => {
    setLocalData(prev => ({
      ...prev,
      servers: prev.servers.filter(s => s.id !== serverId),
    }));
  };

  const updateServerConfig = (serverId: string, config: any) => {
    setLocalData(prev => ({
      ...prev,
      servers: prev.servers.map(s => 
        s.id === serverId ? { ...s, config } : s
      ),
    }));
  };

  const testConnection = async (serverId: string) => {
    // Simulate connection test
    setLocalData(prev => ({
      ...prev,
      servers: prev.servers.map(s => 
        s.id === serverId ? { ...s, status: 'connected' } : s
      ),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">MCP Tools</p>
          <p className="text-muted-foreground">
            Model Context Protocol (MCP) allows your pipeline to interact with external tools and services. 
            This enables actions like web search, database queries, and file operations.
          </p>
        </div>
      </div>

      {/* Enable MCP */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            External Tools Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="mcp-enabled"
              checked={localData.enabled}
              onCheckedChange={handleEnableToggle}
            />
            <Label htmlFor="mcp-enabled" className="flex-1">
              <div>
                <p className="font-medium">Enable MCP tools</p>
                <p className="text-sm text-muted-foreground">
                  Allow your pipeline to use external tools and services
                </p>
              </div>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* MCP Servers */}
      {localData.enabled && (
        <>
          {/* Connected Servers */}
          {localData.servers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Connected Tools</h3>
              {localData.servers.map((server) => {
                const serverTemplate = availableServers.find(s => s.type === server.type);
                const Icon = serverTemplate?.icon || Cpu;
                
                return (
                  <Card key={server.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            server.status === 'connected' ? "bg-green-100 dark:bg-green-900/20" :
                            server.status === 'error' ? "bg-red-100 dark:bg-red-900/20" :
                            "bg-gray-100 dark:bg-gray-800"
                          )}>
                            <Icon className={cn(
                              "h-4 w-4",
                              server.status === 'connected' ? "text-green-600" :
                              server.status === 'error' ? "text-red-600" :
                              "text-gray-600"
                            )} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{server.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {serverTemplate?.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            server.status === 'connected' ? 'default' :
                            server.status === 'error' ? 'destructive' :
                            'secondary'
                          } className="text-xs">
                            {server.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {server.status === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                            {server.status === 'disconnected' && <Loader2 className="h-3 w-3 mr-1" />}
                            {server.status || 'disconnected'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeServer(server.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Simple config placeholder */}
                        <div className="text-sm text-muted-foreground">
                          Configuration will be set during deployment
                        </div>
                        
                        {/* Test Connection Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testConnection(server.id)}
                          className="w-full"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Test Connection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Add Server */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Tools</CardTitle>
              <CardDescription>
                Add tools to enhance your pipeline capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {availableServers
                  .filter(server => !localData.servers.some(s => s.type === server.type))
                  .map((server) => {
                    const Icon = server.icon;
                    return (
                      <div
                        key={server.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{server.name}</p>
                            <p className="text-xs text-muted-foreground">{server.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addServer(server.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
              </div>

              {availableServers.length === localData.servers.length && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All available tools have been added
                </p>
              )}
            </CardContent>
          </Card>

          {/* Security Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-600">Security Notice</p>
              <p className="text-muted-foreground">
                MCP tools will have access to external resources. Ensure you trust the tools and configure appropriate permissions.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}