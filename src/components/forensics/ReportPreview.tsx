import { FileText, Download, AlertCircle, Shield, Clock, Database } from 'lucide-react';
import { InvestigationReport, FileEvidence, FileMetadata, HashResult, LogEntry, TimelineEvent } from '@/types/forensics';
import { downloadReport } from '@/services/reportService';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/services/metadataService';
import { cn } from '@/lib/utils';

interface ReportPreviewProps {
  evidenceFiles: FileEvidence[];
  metadataResults: FileMetadata[];
  hashResults: HashResult[];
  logAnalysis: { entries: LogEntry[] } | null;
  timeline: TimelineEvent[];
  report: InvestigationReport | null;
  onGenerate: () => InvestigationReport;
}

export function ReportPreview({
  evidenceFiles,
  metadataResults,
  hashResults,
  logAnalysis,
  timeline,
  report,
  onGenerate,
}: ReportPreviewProps) {
  const suspiciousEntries = logAnalysis?.entries.filter(e => e.severity !== 'normal') || [];
  const criticalCount = suspiciousEntries.filter(e => e.severity === 'critical').length;
  const warningCount = suspiciousEntries.filter(e => e.severity === 'warning').length;

  const canGenerateReport = evidenceFiles.length > 0;

  if (!canGenerateReport) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Data for Report</h3>
        <p className="text-muted-foreground">Upload and analyze evidence to generate an investigation report</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Investigation Report</h3>
          <p className="text-sm text-muted-foreground">
            {report ? `Case ID: ${report.caseId}` : 'Generate a comprehensive report'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onGenerate} variant="outline" className="cyber-border">
            {report ? 'Regenerate' : 'Generate Report'}
          </Button>
          {report && (
            <Button onClick={() => downloadReport(report)} className="bg-primary text-primary-foreground">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          )}
        </div>
      </div>

      {/* Report Content */}
      {report ? (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className={cn(
            "cyber-card p-6 rounded-lg",
            criticalCount > 0 ? "border-destructive/30" : warningCount > 0 ? "border-warning/30" : "border-success/30"
          )}>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {criticalCount > 0 ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : (
                <Shield className="w-5 h-5 text-success" />
              )}
              Case Summary
            </h4>
            <p className="text-muted-foreground">{report.summary}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-card p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Database className="w-4 h-4" />
                <span className="text-xs">Evidence Files</span>
              </div>
              <p className="text-2xl font-bold font-mono">{report.evidenceFiles.length}</p>
            </div>
            <div className="cyber-card p-4 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Hash Values</span>
              </div>
              <p className="text-2xl font-bold font-mono matrix-text">{report.hashValues.length}</p>
            </div>
            <div className="cyber-card p-4 rounded-lg border-warning/30">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Warnings</span>
              </div>
              <p className="text-2xl font-bold font-mono text-warning">{warningCount}</p>
            </div>
            <div className="cyber-card p-4 rounded-lg border-destructive/30">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Critical</span>
              </div>
              <p className="text-2xl font-bold font-mono danger-text">{criticalCount}</p>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="cyber-card rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <h4 className="font-semibold">Evidence Files</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">File Name</th>
                    <th className="text-left p-3 text-sm font-medium">Size</th>
                    <th className="text-left p-3 text-sm font-medium">Type</th>
                    <th className="text-left p-3 text-sm font-medium">Uploaded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {report.evidenceFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono text-sm">{file.name}</td>
                      <td className="p-3 font-mono text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{file.type || 'Unknown'}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {file.uploadedAt.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hash Values */}
          {report.hashValues.length > 0 && (
            <div className="cyber-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  Integrity Hashes
                </h4>
              </div>
              <div className="p-4 space-y-3">
                {report.hashValues.map((hash, i) => (
                  <div key={i} className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">{hash.fileName}</p>
                    <code className="text-xs font-mono text-primary break-all">{hash.hash}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspicious Entries */}
          {report.suspiciousEntries.length > 0 && (
            <div className="cyber-card rounded-lg overflow-hidden border-destructive/30">
              <div className="p-4 border-b border-border bg-destructive/5">
                <h4 className="font-semibold flex items-center gap-2 danger-text">
                  <AlertCircle className="w-4 h-4" />
                  Suspicious Log Entries
                </h4>
              </div>
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {report.suspiciousEntries.slice(0, 10).map((entry) => (
                  <div key={entry.lineNumber} className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        entry.severity === 'critical' 
                          ? "bg-destructive/20 text-destructive" 
                          : "bg-warning/20 text-warning"
                      )}>
                        {entry.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">Line {entry.lineNumber}</span>
                    </div>
                    <code className="text-sm font-mono text-muted-foreground">{entry.content}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="cyber-card rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <h4 className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Investigation Timeline
              </h4>
            </div>
            <div className="p-4 space-y-2">
              {report.timeline.map((event) => (
                <div key={event.id} className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground font-mono text-xs w-20">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="font-medium">{event.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Preview Stats */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="cyber-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Evidence Files</p>
            <p className="text-2xl font-bold font-mono">{evidenceFiles.length}</p>
          </div>
          <div className="cyber-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Metadata Extracted</p>
            <p className="text-2xl font-bold font-mono">{metadataResults.length}</p>
          </div>
          <div className="cyber-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Hashes Generated</p>
            <p className="text-2xl font-bold font-mono matrix-text">{hashResults.length}</p>
          </div>
          <div className="cyber-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Timeline Events</p>
            <p className="text-2xl font-bold font-mono">{timeline.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
