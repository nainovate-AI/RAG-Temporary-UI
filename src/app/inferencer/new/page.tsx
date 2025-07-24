'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  ArrowRight,
  FileText,
  MessageSquare,
  Database,
  Brain,
  Sparkles,
  Zap,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import pipelineTypesData from '@/data/pipeline-types.json';

type PipelineType = 'rag' | 'llm';

// Icon mapping
const iconMap = {
  FileText,
  MessageSquare,
  Database,
  Brain,
  Sparkles,
  Zap
};

export default function NewPipelinePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PipelineType | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleTypeSelect = (type: PipelineType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    
    setIsNavigating(true);
    // Navigate to pipeline wizard with selected type
    router.push(`/inferencer/pipelines/new?type=${selectedType}`);
  };

  const handleBack = () => {
    router.push('/inferencer');
  };

  return (
    <MainLayout>
      <PageHeader
        title="Create New Pipeline"
        description="Choose the type of AI pipeline you want to create"
      >
        <Button
          variant="outline"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pipelines
        </Button>
      </PageHeader>

      <PageContent>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Info Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">What type of pipeline do you need?</h2>
            <p className="text-muted-foreground">
              Select the pipeline type that best fits your use case
            </p>
          </div>

          {/* Pipeline Type Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {pipelineTypesData.pipelineTypes.map((pipelineType) => {
              const Icon = iconMap[pipelineType.icon as keyof typeof iconMap];
              const isSelected = selectedType === pipelineType.type;

              return (
                <Card
                  key={pipelineType.type}
                  className={cn(
                    "relative cursor-pointer transition-all hover:shadow-lg",
                    isSelected && "ring-2 ring-primary shadow-lg"
                  )}
                  onClick={() => handleTypeSelect(pipelineType.type as PipelineType)}
                >
                  {pipelineType.recommended && (
                    <div className="absolute -top-3 -right-3">
                      <Badge className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        Recommended
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isSelected ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "h-6 w-6",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{pipelineType.title}</CardTitle>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {pipelineType.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {pipelineType.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use Cases */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Best For</h4>
                      <div className="flex flex-wrap gap-2">
                        {pipelineType.useCases.slice(0, 3).map((useCase, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                        {pipelineType.useCases.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{pipelineType.useCases.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {pipelineTypesData.pipelineTypes.map((pipelineType) => {
                  const MainIcon = iconMap[pipelineType.icon as keyof typeof iconMap];
                  
                  return (
                    <div key={pipelineType.type} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MainIcon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{pipelineType.title}</span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                        {pipelineType.requirements.map((req, index) => {
                          const ReqIcon = iconMap[req.icon as keyof typeof iconMap];
                          return (
                            <li key={index} className="flex items-center gap-2">
                              <ReqIcon className="h-4 w-4" />
                              {req.text}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedType || isNavigating}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PageContent>
    </MainLayout>
  );
}