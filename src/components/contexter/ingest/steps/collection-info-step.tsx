'use client';

import { useState, useEffect } from 'react';
import { WizardStepProps } from '@/types/wizard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X, Globe, Lock, Shield } from 'lucide-react';
import { useIngestState } from '../providers/ingest-state-provider';

interface CollectionInfoData {
  name: string;
  description: string;
  tags: string[];
  accessLevel: 'public' | 'private' | 'restricted';
}

export function CollectionInfoStep({ 
  data = {}, 
  onChange,
  onNext,
  errors 
}: WizardStepProps) {
  const { updateStepData } = useIngestState();
  const [formData, setFormData] = useState<CollectionInfoData>({
    name: '',
    description: '',
    tags: [],
    accessLevel: 'public',
    ...data
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    onChange(formData);
    updateStepData('collectionInfo', formData);
  }, [formData]);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const isValid = formData.name.trim().length > 0 && formData.description.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Collection Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Collection Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Customer Support Knowledge Base"
          className={errors?.name ? 'border-red-500' : ''}
        />
        {errors?.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what documents will be in this collection..."
          rows={3}
          className={errors?.description ? 'border-red-500' : ''}
        />
        {errors?.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add a tag..."
          />
          <Button type="button" onClick={addTag} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Access Level */}
      <div className="space-y-2">
        <Label>Access Level</Label>
        <RadioGroup
          value={formData.accessLevel}
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            accessLevel: value as 'public' | 'private' | 'restricted' 
          }))}
        >
          <div className="grid grid-cols-3 gap-4">
            <Card className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, accessLevel: 'public' }))}>
              <CardHeader className="p-4">
                <RadioGroupItem value="public" id="public" className="sr-only" />
                <Label htmlFor="public" className="cursor-pointer flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  Public
                </Label>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Anyone can access</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, accessLevel: 'private' }))}>
              <CardHeader className="p-4">
                <RadioGroupItem value="private" id="private" className="sr-only" />
                <Label htmlFor="private" className="cursor-pointer flex items-center gap-2">
                  <Lock className="h-4 w-4 text-yellow-500" />
                  Private
                </Label>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Only you can access</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, accessLevel: 'restricted' }))}>
              <CardHeader className="p-4">
                <RadioGroupItem value="restricted" id="restricted" className="sr-only" />
                <Label htmlFor="restricted" className="cursor-pointer flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  Restricted
                </Label>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">Specific permissions</p>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      {/* Navigation handled by WizardContainer */}
    </div>
  );
}