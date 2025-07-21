'use client';

import { useState, useEffect, useCallback } from 'react';
import { WizardStepProps } from '@/types/wizard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  File, 
  X, 
  FileText, 
  FileCode, 
  FileSpreadsheet,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngestState } from '../providers/ingest-state-provider';

interface DocumentUploadData {
  files: File[];
  totalSize: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.md', '.docx', '.csv', '.json', '.html'];

export function DocumentUploadStep({ 
  data = {}, 
  onChange,
  errors 
}: WizardStepProps) {
  const { updateStepData } = useIngestState();
  const [formData, setFormData] = useState<DocumentUploadData>({
    files: [],
    totalSize: 0,
    ...data
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  useEffect(() => {
    onChange(formData);
    updateStepData('documents', formData);
  }, [formData]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf':
      case 'txt':
      case 'md':
      case 'docx':
        return <FileText className="h-5 w-5" />;
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'json':
      case 'html':
      case 'xml':
        return <FileCode className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(`${file.name}: Unsupported file type`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 50MB)`);
      } else if (formData.files.some(f => f.name === file.name)) {
        errors.push(`${file.name}: File already added`);
      } else {
        valid.push(file);
      }
    });

    return { valid, errors };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const { valid, errors } = validateFiles(droppedFiles);
    
    setUploadErrors(errors);
    
    if (valid.length > 0) {
      const newTotalSize = formData.totalSize + valid.reduce((sum, file) => sum + file.size, 0);
      setFormData(prev => ({
        files: [...prev.files, ...valid],
        totalSize: newTotalSize
      }));
    }
  }, [formData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const { valid, errors } = validateFiles(selectedFiles);
    
    setUploadErrors(errors);
    
    if (valid.length > 0) {
      const newTotalSize = formData.totalSize + valid.reduce((sum, file) => sum + file.size, 0);
      setFormData(prev => ({
        files: [...prev.files, ...valid],
        totalSize: newTotalSize
      }));
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = formData.files[index];
    setFormData(prev => ({
      files: prev.files.filter((_, i) => i !== index),
      totalSize: prev.totalSize - fileToRemove.size
    }));
  };

  const isValid = formData.files.length > 0;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          errors?.files && "border-red-500"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          multiple
          accept={ALLOWED_EXTENSIONS.join(',')}
          onChange={handleFileSelect}
        />
        
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        
        <p className="text-lg font-medium mb-2">
          Drop files here or{' '}
          <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
            browse
          </label>
        </p>
        
        <p className="text-sm text-muted-foreground">
          Supported formats: PDF, TXT, MD, DOCX, CSV, JSON, HTML
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Maximum file size: 50MB per file
        </p>
      </div>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              Upload Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              {uploadErrors.map((error, index) => (
                <li key={index} className="text-red-600 dark:text-red-400">
                  • {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {formData.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uploaded Files</CardTitle>
            <CardDescription>
              {formData.files.length} file{formData.files.length !== 1 ? 's' : ''} • 
              Total size: {formatFileSize(formData.totalSize)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {isValid 
                  ? `Ready to process ${formData.files.length} document${formData.files.length !== 1 ? 's' : ''}`
                  : 'Please upload at least one document'
                }
              </span>
            </div>
            {formData.totalSize > 0 && (
              <Badge variant="secondary">
                {formatFileSize(formData.totalSize)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}