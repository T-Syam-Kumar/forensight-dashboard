import { AlertTriangle, FileText, Search, AlertCircle, Info, Loader2, Download } from 'lucide-react';
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

const SAMPLE_LOG_CONTENT = `2024-01-15 08:23:15 INFO System startup initiated
2024-01-15 08:23:16 INFO Loading configuration files
2024-01-15 08:23:17 INFO Database connection established
2024-01-15 08:24:01 WARNING High memory usage detected: 85%
2024-01-15 08:25:33 INFO User admin logged in successfully
2024-01-15 08:26:45 ERROR Failed login attempt for user: guest
2024-01-15 08:26:46 ERROR Failed login attempt for user: guest
2024-01-15 08:26:47 CRITICAL Failed login attempt for user: root
2024-01-15 08:27:12 WARNING Unauthorized access attempt to /admin/config
2024-01-15 08:28:00 INFO Scheduled backup started
2024-01-15 08:29:15 ERROR Connection denied from IP: 192.168.1.105
2024-01-15 08:30:22 CRITICAL Unauthorized modification attempt on system files
2024-01-15 08:31:00 INFO Firewall rules updated
2024-01-15 08:32:45 WARNING Unusual network traffic detected
2024-01-15 08:33:10 ERROR Access denied for user: anonymous
2024-01-15 08:34:00 INFO System health check completed
2024-01-15 08:35:22 CRITICAL Root access attempt from external IP: 45.33.32.156
2024-01-15 08:36:00 INFO Email notification sent to admin
2024-01-15 08:37:15 WARNING Failed authentication for service account
2024-01-15 08:38:00 INFO Log rotation completed
2024-01-15 08:39:30 ERROR Database query timeout - possible injection attempt
2024-01-15 08:40:00 INFO Intrusion detection system scan started
2024-01-15 08:41:12 CRITICAL Unauthorized privilege escalation detected
2024-01-15 08:42:00 INFO Security incident logged and reported
2024-01-15 08:43:00 INFO System monitoring active`;

function downloadSampleLog() {
  const blob = new Blob([SAMPLE_LOG_CONTENT], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-security.log';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
        <p className="text-muted-foreground mb-4">Upload .log or .txt files to analyze for suspicious activity</p>
        
        {/* Sample Log Download */}
        <div className="cyber-card p-4 rounded-lg max-w-md">
          <p className="text-sm text-muted-foreground mb-3">
            Don't have a log file? Download our sample security log to test the analysis feature.
          </p>
          <Button onClick={downloadSampleLog} variant="outline" className="cyber-border">
            <Download className="w-4 h-4 mr-2" />
            Download Sample Log
          </Button>
        </div>
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
