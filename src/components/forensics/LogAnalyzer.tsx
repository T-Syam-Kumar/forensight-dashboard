import { AlertTriangle, FileText, Search, AlertCircle, Info, Loader2 } from 'lucide-react';
import { FileEvidence, LogAnalysisResult } from '@/types/forensics';
import { getSeverityColor, getSeverityBg } from '@/services/logAnalysisService';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LogAnalyzerProps {
  evidenceFiles: FileEvidence[];
  logAnalysis: LogAnalysisResult | null;
  onAnalyze: (evidence: FileEvidence) => Promise<LogAnalysisResult>;
}

export function LogAnalyzer({ evidenceFiles, logAnalysis, onAnalyze }: LogAnalyzerProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'warning' | 'critical'>('all');

  const logFiles = evidenceFiles.filter(f => 
    f.name.endsWith('.log') || f.name.endsWith('.txt') || f.type === 'text/plain'
  );

  const handleAnalyze = async (evidence: FileEvidence) => {
    setAnalyzing(true);
    await onAnalyze(evidence);
    setAnalyzing(false);
  };

  const filteredEntries = logAnalysis?.entries.filter(entry => {
    if (filter === 'all') return true;
    return entry.severity === filter;
  }) || [];

  const criticalCount = logAnalysis?.entries.filter(e => e.severity === 'critical').length || 0;
  const warningCount = logAnalysis?.entries.filter(e => e.severity === 'warning').length || 0;

  if (logFiles.length === 0 && !logAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Log Files</h3>
        <p className="text-muted-foreground">Upload .log or .txt files to analyze for suspicious activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* File Selection */}
      {!logAnalysis && logFiles.length > 0 && (
        <div className="grid gap-4">
          {logFiles.map((evidence) => (
            <div key={evidence.id} className="cyber-card p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">{evidence.name}</p>
                  <p className="text-sm text-muted-foreground">Log file ready for analysis</p>
                </div>
              </div>
              <Button
                onClick={() => handleAnalyze(evidence)}
                disabled={analyzing}
                variant="outline"
                className="cyber-border"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze Logs
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Results */}
      {logAnalysis && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="cyber-card p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Lines</p>
              <p className="text-2xl font-bold font-mono">{logAnalysis.totalLines}</p>
            </div>
            <div className="cyber-card p-4 rounded-lg border-warning/30">
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold font-mono text-warning">{warningCount}</p>
            </div>
            <div className="cyber-card p-4 rounded-lg border-destructive/30">
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold font-mono danger-text">{criticalCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({logAnalysis.entries.length})
            </Button>
            <Button
              variant={filter === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('warning')}
              className={filter === 'warning' ? 'bg-warning text-warning-foreground' : ''}
            >
              Warnings ({warningCount})
            </Button>
            <Button
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
              className={filter === 'critical' ? 'bg-destructive' : ''}
            >
              Critical ({criticalCount})
            </Button>
          </div>

          {/* Log Entries */}
          <div className="cyber-card rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
            <div className="divide-y divide-border">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.lineNumber}
                  className={cn(
                    "p-3 flex items-start gap-3 border-l-2",
                    getSeverityBg(entry.severity)
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {entry.severity === 'critical' && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    {entry.severity === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                    {entry.severity === 'normal' && (
                      <Info className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        Line {entry.lineNumber}
                      </span>
                      {entry.timestamp && (
                        <span className="text-xs font-mono text-primary">
                          {entry.timestamp}
                        </span>
                      )}
                      {entry.matchedKeywords.length > 0 && (
                        <div className="flex gap-1">
                          {entry.matchedKeywords.map((kw) => (
                            <span
                              key={kw}
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded",
                                entry.severity === 'critical'
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-warning/20 text-warning"
                              )}
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <code className={cn(
                      "text-sm font-mono break-all",
                      getSeverityColor(entry.severity)
                    )}>
                      {entry.content}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
