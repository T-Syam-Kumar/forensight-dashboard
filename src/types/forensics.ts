export interface FileEvidence {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  file: File;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModified: Date;
  createdAt?: Date;
  accessedAt?: Date;
  permissions: {
    readable: boolean;
    writable: boolean;
    executable: boolean;
  };
}

export interface HashResult {
  algorithm: string;
  hash: string;
  fileName: string;
  generatedAt: Date;
}

export interface LogEntry {
  lineNumber: number;
  content: string;
  timestamp?: string;
  severity: 'normal' | 'warning' | 'critical';
  matchedKeywords: string[];
}

export interface LogAnalysisResult {
  fileName: string;
  totalLines: number;
  suspiciousCount: number;
  entries: LogEntry[];
  analyzedAt: Date;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'upload' | 'metadata' | 'hash' | 'analysis' | 'report';
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
}

export interface InvestigationReport {
  caseId: string;
  generatedAt: Date;
  summary: string;
  evidenceFiles: FileEvidence[];
  metadataFindings: FileMetadata[];
  hashValues: HashResult[];
  suspiciousEntries: LogEntry[];
  timeline: TimelineEvent[];
}
