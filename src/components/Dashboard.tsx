import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FileUpload } from '@/components/forensics/FileUpload';
import { MetadataViewer } from '@/components/forensics/MetadataViewer';
import { IntegrityCheck } from '@/components/forensics/IntegrityCheck';
import { LogAnalyzer } from '@/components/forensics/LogAnalyzer';
import { Timeline } from '@/components/forensics/Timeline';
import { ReportPreview } from '@/components/forensics/ReportPreview';
import { HowToUse } from '@/components/forensics/HowToUse';
import { useForensics } from '@/hooks/useForensics';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('upload');
  const forensics = useForensics();

  const suspiciousCount = forensics.logAnalysis?.entries.filter(
    e => e.severity !== 'normal'
  ).length || 0;

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <FileUpload
            onUpload={forensics.uploadEvidence}
            evidenceFiles={forensics.evidenceFiles}
            isProcessing={forensics.isProcessing}
          />
        );
      case 'metadata':
        return (
          <MetadataViewer
            evidenceFiles={forensics.evidenceFiles}
            metadataResults={forensics.metadataResults}
            onExtract={forensics.processMetadata}
          />
        );
      case 'integrity':
        return (
          <IntegrityCheck
            evidenceFiles={forensics.evidenceFiles}
            hashResults={forensics.hashResults}
            onGenerateHash={forensics.generateHash}
          />
        );
      case 'logs':
        return (
          <LogAnalyzer
            evidenceFiles={forensics.evidenceFiles}
            logAnalysis={forensics.logAnalysis}
            onAnalyze={forensics.analyzeLogs}
          />
        );
      case 'timeline':
        return <Timeline events={forensics.timeline} />;
      case 'report':
        return (
          <ReportPreview
            evidenceFiles={forensics.evidenceFiles}
            metadataResults={forensics.metadataResults}
            hashResults={forensics.hashResults}
            logAnalysis={forensics.logAnalysis}
            timeline={forensics.timeline}
            report={forensics.report}
            onGenerate={forensics.generateInvestigationReport}
          />
        );
      case 'guide':
        return <HowToUse />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 scan-line opacity-30" />
      
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeSection={activeSection}
          evidenceCount={forensics.evidenceFiles.length}
          suspiciousCount={suspiciousCount}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
