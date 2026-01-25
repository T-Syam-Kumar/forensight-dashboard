import { BookOpen, Upload, FileSearch, Shield, AlertTriangle, Clock, FileText, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function HowToUse() {
  const steps = [
    {
      icon: Upload,
      title: "1. Upload Evidence Files",
      description: "Start by uploading your digital evidence files for analysis.",
      examples: [
        "Drag and drop files directly into the upload zone",
        "Click to browse and select files from your computer",
        "Supported formats: Documents, images, log files (.log, .txt), and more"
      ],
      tip: "You can upload multiple files at once for batch processing."
    },
    {
      icon: FileSearch,
      title: "2. Extract Metadata",
      description: "View detailed file information and properties.",
      examples: [
        "File size, type, and last modified date",
        "File permissions (read/write/execute)",
        "Creation and access timestamps"
      ],
      tip: "Metadata helps establish the origin and modification history of evidence."
    },
    {
      icon: Shield,
      title: "3. Verify File Integrity",
      description: "Generate SHA-256 cryptographic hashes to ensure file authenticity.",
      examples: [
        "Click 'Generate Hash' next to any uploaded file",
        "Compare hash values to verify files haven't been tampered with",
        "Copy hashes for documentation and chain of custody"
      ],
      tip: "Always generate hashes immediately after acquiring evidence to maintain integrity."
    },
    {
      icon: AlertTriangle,
      title: "4. Analyze Log Files",
      description: "Detect suspicious activity patterns in system logs.",
      examples: [
        "Upload .log or .txt files containing system logs",
        "Automatic detection of keywords: 'failed', 'unauthorized', 'denied', 'root'",
        "Filter results by severity: Critical, Warning, or Normal"
      ],
      tip: "Critical entries indicate potential security breaches requiring immediate attention."
    },
    {
      icon: Clock,
      title: "5. Review Timeline",
      description: "Track all investigation activities chronologically.",
      examples: [
        "See when each file was uploaded",
        "Track metadata extraction timestamps",
        "Monitor analysis completion times"
      ],
      tip: "The timeline creates an audit trail for your investigation process."
    },
    {
      icon: FileText,
      title: "6. Generate Report",
      description: "Create a comprehensive investigation report.",
      examples: [
        "Click 'Generate Report' to compile all findings",
        "Download as JSON for further processing",
        "Includes: case summary, metadata, hashes, suspicious entries, timeline"
      ],
      tip: "Reports can be regenerated anytime as you add more evidence."
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">How to Use ForenSight</h3>
          <p className="text-sm text-muted-foreground">Step-by-step guide for digital forensics investigation</p>
        </div>
      </div>

      {/* Quick Start */}
      <div className="cyber-card p-4 rounded-lg border-primary/30">
        <h4 className="font-semibold text-primary mb-2">🚀 Quick Start</h4>
        <p className="text-sm text-muted-foreground">
          Upload evidence → Extract metadata → Generate hashes → Analyze logs → Generate report
        </p>
      </div>

      {/* Steps Accordion */}
      <Accordion type="single" collapsible className="space-y-2">
        {steps.map((step, index) => (
          <AccordionItem 
            key={index} 
            value={`step-${index}`}
            className="cyber-card rounded-lg border-none px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{step.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-11 space-y-4">
                <p className="text-muted-foreground">{step.description}</p>
                
                {/* Examples */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Examples:</p>
                  <ul className="space-y-1.5">
                    {step.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro Tip */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm">
                    <span className="text-primary font-medium">💡 Pro Tip: </span>
                    <span className="text-muted-foreground">{step.tip}</span>
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Example Use Cases */}
      <div className="cyber-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold">📋 Example Use Cases</h4>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-primary">Incident Response</h5>
            <p className="text-sm text-muted-foreground">
              After detecting a potential breach, upload system logs (auth.log, syslog) to identify 
              unauthorized access attempts. Use log analysis to find "failed" login attempts and 
              "denied" access entries.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-primary">Evidence Preservation</h5>
            <p className="text-sm text-muted-foreground">
              When collecting digital evidence, immediately generate SHA-256 hashes for each file. 
              Document these hashes in your report to prove the evidence hasn't been modified.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-primary">Malware Analysis Prep</h5>
            <p className="text-sm text-muted-foreground">
              Upload suspicious files to extract metadata and generate hashes. Compare hashes 
              against known malware databases. Review the timeline for sequence of events.
            </p>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="cyber-card rounded-lg p-4">
        <h4 className="font-semibold mb-3">⌨️ Tips & Best Practices</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Always document your investigation process using the timeline
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Generate hashes before making any analysis to preserve evidence integrity
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Export reports regularly during long investigations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Use Clear All to start a new investigation case
          </li>
        </ul>
      </div>
    </div>
  );
}
