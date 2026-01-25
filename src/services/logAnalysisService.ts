import { LogEntry, LogAnalysisResult } from '@/types/forensics';

const SUSPICIOUS_KEYWORDS = [
  'failed',
  'unauthorized',
  'denied',
  'root',
  'sudo',
  'permission',
  'attack',
  'malicious',
  'exploit',
  'injection',
  'breach',
  'intrusion',
  'anomaly',
  'error',
  'critical',
  'warning',
];

const CRITICAL_KEYWORDS = ['attack', 'malicious', 'exploit', 'injection', 'breach', 'intrusion', 'root', 'sudo'];

export async function analyzeLogFile(file: File): Promise<LogAnalysisResult> {
  const content = await file.text();
  const lines = content.split('\n').filter(line => line.trim());
  
  const entries: LogEntry[] = lines.map((line, index) => {
    const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(keyword => 
      line.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const hasCritical = matchedKeywords.some(kw => 
      CRITICAL_KEYWORDS.includes(kw.toLowerCase())
    );
    
    let severity: 'normal' | 'warning' | 'critical' = 'normal';
    if (hasCritical) {
      severity = 'critical';
    } else if (matchedKeywords.length > 0) {
      severity = 'warning';
    }
    
    // Try to extract timestamp from common log formats
    const timestampMatch = line.match(/\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}/);
    
    return {
      lineNumber: index + 1,
      content: line,
      timestamp: timestampMatch ? timestampMatch[0] : undefined,
      severity,
      matchedKeywords,
    };
  });
  
  const suspiciousCount = entries.filter(e => e.severity !== 'normal').length;
  
  return {
    fileName: file.name,
    totalLines: entries.length,
    suspiciousCount,
    entries,
    analyzedAt: new Date(),
  };
}

export function getSeverityColor(severity: 'normal' | 'warning' | 'critical'): string {
  switch (severity) {
    case 'critical':
      return 'text-destructive';
    case 'warning':
      return 'text-warning';
    default:
      return 'text-muted-foreground';
  }
}

export function getSeverityBg(severity: 'normal' | 'warning' | 'critical'): string {
  switch (severity) {
    case 'critical':
      return 'bg-destructive/10 border-destructive/30';
    case 'warning':
      return 'bg-warning/10 border-warning/30';
    default:
      return 'bg-muted/50 border-border';
  }
}
