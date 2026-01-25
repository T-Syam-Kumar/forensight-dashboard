import { useState, useCallback } from 'react';
import { FileEvidence, FileMetadata, HashResult, LogAnalysisResult, TimelineEvent, InvestigationReport } from '@/types/forensics';
import { generateSHA256Hash } from '@/services/hashService';
import { extractMetadata } from '@/services/metadataService';
import { analyzeLogFile } from '@/services/logAnalysisService';
import { generateReport } from '@/services/reportService';

export function useForensics() {
  const [evidenceFiles, setEvidenceFiles] = useState<FileEvidence[]>([]);
  const [metadataResults, setMetadataResults] = useState<FileMetadata[]>([]);
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [logAnalysis, setLogAnalysis] = useState<LogAnalysisResult | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addTimelineEvent = useCallback((
    type: TimelineEvent['type'],
    title: string,
    description: string
  ) => {
    const event: TimelineEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type,
      title,
      description,
      status: 'completed',
    };
    setTimeline(prev => [...prev, event]);
    return event;
  }, []);

  const uploadEvidence = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    
    const newEvidence: FileEvidence[] = files.map(file => ({
      id: `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      file,
    }));
    
    setEvidenceFiles(prev => [...prev, ...newEvidence]);
    
    for (const evidence of newEvidence) {
      addTimelineEvent(
        'upload',
        'Evidence Uploaded',
        `File "${evidence.name}" uploaded successfully`
      );
    }
    
    setIsProcessing(false);
    return newEvidence;
  }, [addTimelineEvent]);

  const processMetadata = useCallback(async (evidence: FileEvidence) => {
    setIsProcessing(true);
    
    const metadata = extractMetadata(evidence.file);
    setMetadataResults(prev => [...prev, metadata]);
    
    addTimelineEvent(
      'metadata',
      'Metadata Extracted',
      `Extracted metadata from "${evidence.name}"`
    );
    
    setIsProcessing(false);
    return metadata;
  }, [addTimelineEvent]);

  const generateHash = useCallback(async (evidence: FileEvidence) => {
    setIsProcessing(true);
    
    const hash = await generateSHA256Hash(evidence.file);
    setHashResults(prev => [...prev, hash]);
    
    addTimelineEvent(
      'hash',
      'Hash Generated',
      `SHA-256 hash computed for "${evidence.name}"`
    );
    
    setIsProcessing(false);
    return hash;
  }, [addTimelineEvent]);

  const analyzeLogs = useCallback(async (evidence: FileEvidence) => {
    setIsProcessing(true);
    
    const analysis = await analyzeLogFile(evidence.file);
    setLogAnalysis(analysis);
    
    addTimelineEvent(
      'analysis',
      'Log Analysis Complete',
      `Analyzed ${analysis.totalLines} lines, found ${analysis.suspiciousCount} suspicious entries`
    );
    
    setIsProcessing(false);
    return analysis;
  }, [addTimelineEvent]);

  const generateInvestigationReport = useCallback(() => {
    const suspiciousEntries = logAnalysis?.entries.filter(e => e.severity !== 'normal') || [];
    
    const newReport = generateReport(
      evidenceFiles,
      metadataResults,
      hashResults,
      suspiciousEntries,
      timeline
    );
    
    setReport(newReport);
    
    addTimelineEvent(
      'report',
      'Report Generated',
      `Investigation report ${newReport.caseId} created`
    );
    
    return newReport;
  }, [evidenceFiles, metadataResults, hashResults, logAnalysis, timeline, addTimelineEvent]);

  const clearAll = useCallback(() => {
    setEvidenceFiles([]);
    setMetadataResults([]);
    setHashResults([]);
    setLogAnalysis(null);
    setTimeline([]);
    setReport(null);
  }, []);

  return {
    evidenceFiles,
    metadataResults,
    hashResults,
    logAnalysis,
    timeline,
    report,
    isProcessing,
    uploadEvidence,
    processMetadata,
    generateHash,
    analyzeLogs,
    generateInvestigationReport,
    clearAll,
  };
}
