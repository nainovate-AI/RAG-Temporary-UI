'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { WizardStepProps } from '@/types/wizard.types';
import { Info, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import pipelineConfig from '@/config/pipeline-config.json';

interface BasicInfoData {
  name: string;
  description: string;
  type: 'rag' | 'llm';
  useCase: string;
  tags: string[];
  _isValid?: boolean;
}

export function BasicInfoStep({ data, onChange, errors }: WizardStepProps) {
  const [currentTag, setCurrentTag] = useState('');

  const [localData, setLocalData] = useState<BasicInfoData>(() => {
    const initialData = data as BasicInfoData;
    return {
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: initialData?.type || 'rag',
      useCase: initialData?.useCase || '',
      tags: initialData?.tags || [],
    };
  });

  // Get use cases from pipeline config
  const currentUseCases = pipelineConfig.useCases[localData.type];

  useEffect(() => {
    const isValid = !!localData.name.trim() && !!localData.useCase;
    onChange({ ...localData, _isValid: isValid });
  }, [localData, onChange]);

  const updateField = (field: keyof BasicInfoData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !localData.tags.includes(currentTag.trim())) {
      setLocalData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setLocalData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Pipeline Information</p>
          <p className="text-muted-foreground">
            {localData.type === 'rag' 
              ? 'RAG pipelines combine your documents with AI to answer questions based on your data.'
              : 'LLM pipelines use AI models directly for content generation and transformation.'}
          </p>
        </div>
      </div>

      {/* Pipeline Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Pipeline Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          value={localData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder={localData.type === 'rag' ? 'e.g., Customer Support RAG' : 'e.g., Blog Content Writer'}
          className={cn(errors?.name && 'border-red-500')}
        />
        {errors?.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={localData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe what this pipeline will do..."
          rows={3}
        />
      </div>

      {/* Use Case Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Use Case <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentUseCases.map((useCase) => (
            <Card
              key={useCase.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                localData.useCase === useCase.id && 'ring-2 ring-primary'
              )}
              onClick={() => updateField('useCase', useCase.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{useCase.icon}</span>
                  <span className="text-sm font-medium">{useCase.label}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors?.useCase && <p className="text-sm text-red-500">{errors.useCase}</p>}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags
        </label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add tags..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addTag}
            disabled={!currentTag.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {localData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {localData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}