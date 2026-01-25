import { InvestigationReport, FileEvidence, FileMetadata, HashResult, LogEntry, TimelineEvent } from '@/types/forensics';

export function generateReport(
  evidenceFiles: FileEvidence[],
  metadataFindings: FileMetadata[],
  hashValues: HashResult[],
  suspiciousEntries: LogEntry[],
  timeline: TimelineEvent[]
): InvestigationReport {
  const caseId = `CASE-${Date.now().toString(36).toUpperCase()}`;
  
  return {
    caseId,
    generatedAt: new Date(),
    summary: generateSummary(evidenceFiles, suspiciousEntries),
    evidenceFiles,
    metadataFindings,
    hashValues,
    suspiciousEntries,
    timeline,
  };
}

function generateSummary(files: FileEvidence[], suspicious: LogEntry[]): string {
  const criticalCount = suspicious.filter(e => e.severity === 'critical').length;
  const warningCount = suspicious.filter(e => e.severity === 'warning').length;
  
  let summary = `Digital forensics investigation completed. Analyzed ${files.length} evidence file(s). `;
  
  if (criticalCount > 0) {
    summary += `CRITICAL: ${criticalCount} critical security event(s) detected. `;
  }
  if (warningCount > 0) {
    summary += `WARNING: ${warningCount} suspicious activit${warningCount === 1 ? 'y' : 'ies'} flagged for review. `;
  }
  if (criticalCount === 0 && warningCount === 0) {
    summary += 'No suspicious activity detected in analyzed logs.';
  }
  
  return summary;
}

export function exportReportAsJSON(report: InvestigationReport): string {
  return JSON.stringify(report, null, 2);
}

export function downloadReport(report: InvestigationReport): void {
  const jsonString = exportReportAsJSON(report);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.caseId}-report.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
