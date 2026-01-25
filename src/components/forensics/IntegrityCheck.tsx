import { Shield, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { FileEvidence, HashResult } from '@/types/forensics';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface IntegrityCheckProps {
  evidenceFiles: FileEvidence[];
  hashResults: HashResult[];
  onGenerateHash: (evidence: FileEvidence) => Promise<HashResult>;
}

export function IntegrityCheck({ evidenceFiles, hashResults, onGenerateHash }: IntegrityCheckProps) {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerateHash = async (evidence: FileEvidence) => {
    setGenerating(evidence.id);
    await onGenerateHash(evidence);
    setGenerating(null);
  };

  const getHashForFile = (fileName: string) => {
    return hashResults.find(h => h.fileName === fileName);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash copied to clipboard');
  };

  if (evidenceFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Evidence Files</h3>
        <p className="text-muted-foreground">Upload evidence files to verify integrity</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="cyber-card p-4 rounded-lg border-primary/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium cyber-text">Evidence Integrity Verification</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Generate SHA-256 cryptographic hashes to verify file integrity. 
              These hashes serve as digital fingerprints to detect any tampering.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {evidenceFiles.map((evidence) => {
          const hash = getHashForFile(evidence.name);
          
          return (
            <div key={evidence.id} className="cyber-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{evidence.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {hash ? 'Integrity verified' : 'Pending verification'}
                    </p>
                  </div>
                </div>
                
                {!hash && (
                  <Button 
                    onClick={() => handleGenerateHash(evidence)}
                    disabled={generating === evidence.id}
                    className="cyber-border"
                    variant="outline"
                  >
                    {generating === evidence.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Hash'
                    )}
                  </Button>
                )}
              </div>
              
              {hash && (
                <div className="p-4 bg-success/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium matrix-text">{hash.algorithm}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Generated: {hash.generatedAt.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background/50 px-3 py-2 rounded font-mono text-xs break-all">
                      {hash.hash}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyHash(hash.hash)}
                      className="shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
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
