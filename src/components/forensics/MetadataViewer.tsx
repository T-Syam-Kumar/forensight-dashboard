import { FileSearch, FileText, Calendar, HardDrive, Lock, Unlock } from 'lucide-react';
import { FileEvidence, FileMetadata } from '@/types/forensics';
import { formatFileSize, extractMetadata } from '@/services/metadataService';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MetadataViewerProps {
  evidenceFiles: FileEvidence[];
  metadataResults: FileMetadata[];
  onExtract: (evidence: FileEvidence) => Promise<FileMetadata>;
}

export function MetadataViewer({ evidenceFiles, metadataResults, onExtract }: MetadataViewerProps) {
  const [extracting, setExtracting] = useState<string | null>(null);

  const handleExtract = async (evidence: FileEvidence) => {
    setExtracting(evidence.id);
    await onExtract(evidence);
    setExtracting(null);
  };

  const getMetadataForFile = (fileName: string) => {
    return metadataResults.find(m => m.fileName === fileName);
  };

  if (evidenceFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Evidence Files</h3>
        <p className="text-muted-foreground">Upload evidence files to extract metadata</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid gap-4">
        {evidenceFiles.map((evidence) => {
          const metadata = getMetadataForFile(evidence.name);
          
          return (
            <div key={evidence.id} className="cyber-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{evidence.name}</p>
                    <p className="text-sm text-muted-foreground">{evidence.type || 'Unknown'}</p>
                  </div>
                </div>
                
                {!metadata && (
                  <Button 
                    onClick={() => handleExtract(evidence)}
                    disabled={extracting === evidence.id}
                    className="cyber-border"
                    variant="outline"
                  >
                    {extracting === evidence.id ? 'Extracting...' : 'Extract Metadata'}
                  </Button>
                )}
              </div>
              
              {metadata && (
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> File Size
                    </p>
                    <p className="font-mono text-sm">{formatFileSize(metadata.fileSize)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" /> MIME Type
                    </p>
                    <p className="font-mono text-sm truncate">{metadata.fileType}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Last Modified
                    </p>
                    <p className="font-mono text-sm">
                      {metadata.lastModified.toLocaleDateString()} {metadata.lastModified.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="col-span-2 md:col-span-3 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Permissions</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        {metadata.permissions.readable ? (
                          <Unlock className="w-4 h-4 text-success" />
                        ) : (
                          <Lock className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm">Read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {metadata.permissions.writable ? (
                          <Unlock className="w-4 h-4 text-success" />
                        ) : (
                          <Lock className="w-4 h-4 text-destructive" />
                        )}
                        <span className="text-sm">Write</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {metadata.permissions.executable ? (
                          <Unlock className="w-4 h-4 text-warning" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">Execute</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
