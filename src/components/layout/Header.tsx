import { Shield, Activity, Database } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  evidenceCount: number;
  suspiciousCount: number;
}

const sectionTitles: Record<string, string> = {
  upload: 'Upload Evidence',
  metadata: 'Metadata Viewer',
  integrity: 'Evidence Integrity Check',
  logs: 'Log Analysis',
  timeline: 'Investigation Timeline',
  report: 'Investigation Report',
};

export function Header({ activeSection, evidenceCount, suspiciousCount }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold">{sectionTitles[activeSection]}</h2>
        <p className="text-sm text-muted-foreground">Digital Forensics & Incident Analysis</p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
          <Database className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono">{evidenceCount} Files</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
          <Activity className="w-4 h-4 text-warning" />
          <span className="text-sm font-mono">{suspiciousCount} Alerts</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 cyber-border">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono cyber-text">Secure Mode</span>
        </div>
      </div>
    </header>
  );
}
