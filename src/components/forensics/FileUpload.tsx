import { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileEvidence } from '@/types/forensics';
import { formatFileSize } from '@/services/metadataService';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<FileEvidence[]>;
  evidenceFiles: FileEvidence[];
  isProcessing: boolean;
}

export function FileUpload({ onUpload, evidenceFiles, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await onUpload(files);
    }
    e.target.value = '';
  }, [onUpload]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300",
          "flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          isProcessing && "opacity-50 pointer-events-none"
        )}
      >
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all",
          isDragging ? "bg-primary/20 scale-110" : "bg-muted"
        )}>
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {isDragging ? "Drop files here" : "Upload Evidence Files"}
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop files or click to browse
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Supports: Documents, Logs, Images, and other evidence files
        </p>
        
        <label>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          <Button variant="outline" className="cyber-border" asChild>
            <span className="cursor-pointer">
              Select Files
            </span>
          </Button>
        </label>
      </div>

      {/* Uploaded Files List */}
      {evidenceFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Uploaded Evidence ({evidenceFiles.length})
          </h4>
          <div className="grid gap-3">
            {evidenceFiles.map((evidence) => (
              <div
                key={evidence.id}
                className="cyber-card p-4 rounded-lg flex items-center gap-4 animate-fade-in-up"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <File className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{evidence.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(evidence.size)} • {evidence.type || 'Unknown type'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm matrix-text">Uploaded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
