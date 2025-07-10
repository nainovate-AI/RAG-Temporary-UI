'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
  Folder,
  Globe,
  Plus,
  Loader2,
  FileIcon,
  FileSpreadsheet,
  FileType,
  FileImage,
  Trash2,
  Info
} from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/html': ['.html'],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export default function UploadDocumentsPage() {
  const router = useRouter()
  const [collectionName, setCollectionName] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [accessLevel, setAccessLevel] = useState<'public' | 'private' | 'restricted'>('public')

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      status: 'pending' as const,
    }))

    // Validate files
    newFiles.forEach(uploadedFile => {
      if (uploadedFile.file.size > MAX_FILE_SIZE) {
        uploadedFile.status = 'error'
        uploadedFile.error = 'File size exceeds 50MB limit'
      }
    })

    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const canProceed = collectionName.trim() && uploadedFiles.length > 0

  const handleNext = () => {
    if (canProceed) {
      // Save data to session/context
      router.push('/documents/ingest/new/processing')
    }
  }

  const getFileIcon = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />
      case 'csv':
      case 'xlsx':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      case 'doc':
      case 'docx':
        return <FileType className="h-5 w-5 text-blue-500" />
      case 'txt':
      case 'md':
        return <FileText className="h-5 w-5 text-gray-500" />
      default:
        return <FileIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const totalSize = uploadedFiles.reduce((sum, f) => sum + f.file.size, 0)

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Information</CardTitle>
          <CardDescription>
            Provide basic details about this document collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name *</Label>
            <Input
              id="collection-name"
              placeholder="e.g., Customer Support Knowledge Base"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name to identify this collection
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
              placeholder="Describe the purpose and contents of this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
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

          <div className="space-y-2">
            <Label>Access Level</Label>
            <div className="flex gap-4">
              {(['public', 'private', 'restricted'] as const).map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="access-level"
                    value={level}
                    checked={accessLevel === level}
                    onChange={(e) => setAccessLevel(e.target.value as any)}
                    className="text-primary"
                  />
                  <span className="text-sm capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload files or provide URLs to ingest into this collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-border",
              "hover:border-primary hover:bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()} // Added click handler
          >
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported: PDF, TXT, MD, CSV, DOC, DOCX, HTML (Max 50MB per file)
            </p>
            
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.txt,.md,.csv,.doc,.docx,.html"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label>Or add from URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/document.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button variant="outline" disabled>
                <Globe className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">
                  {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: {formatBytes(totalSize)}
                </p>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {uploadedFiles.map((uploadedFile) => (
                  <div
                    key={uploadedFile.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-background"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(uploadedFile.file)}
                      <div>
                        <p className="text-sm font-medium truncate max-w-[300px]">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(uploadedFile.file.size)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === 'error' && (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs">{uploadedFile.error}</span>
                        </div>
                      )}
                      {uploadedFile.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {uploadedFile.status === 'uploading' && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
            <Info className="h-4 w-4 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">Processing Information</p>
              <p className="text-muted-foreground mt-1">
                Documents will be processed asynchronously. You'll be able to track progress
                and add more documents later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/documents')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next: Processing Config
        </Button>
      </div>
    </div>
  )
}