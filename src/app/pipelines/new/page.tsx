'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

export default function NewPipelineBasicPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState('')

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        })
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleNext = () => {
    // In a real app, you'd save this to a context or state management solution
    router.push('/pipelines/new/processing')
  }

  const handleSaveAsDraft = () => {
    // Save draft logic
    console.log('Saving as draft:', formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Name and describe your pipeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Pipeline Name"
            placeholder="Enter pipeline name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            helperText="Choose a descriptive name for your pipeline"
          />

          <Textarea
            label="Description"
            placeholder="Describe the purpose of this pipeline"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            helperText="Explain what this pipeline will be used for and any special requirements"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              helperText="Tags help organize and filter your pipelines"
            />
          </div>
        </CardContent>
      </Card>

      {/* Example Configuration */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Example Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground mb-1">Customer Support Pipeline</p>
              <p className="text-muted-foreground">
                This pipeline handles customer inquiries across multiple languages, providing accurate 
                responses based on our knowledge base and support documentation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">customer-support</Badge>
              <Badge variant="outline">multi-language</Badge>
              <Badge variant="outline">production</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="ghost"
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/pipelines')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={!formData.name || !formData.description}
          >
            Next: Document Processing →
          </Button>
        </div>
      </div>
    </div>
  )
}

