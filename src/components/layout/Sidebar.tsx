import { cn } from '@/lib/utils';
import { 
  Upload, 
  FileSearch, 
  Shield, 
  AlertTriangle, 
  Clock, 
  FileText,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'upload', label: 'Upload Evidence', icon: Upload },
  { id: 'metadata', label: 'Metadata Viewer', icon: FileSearch },
  { id: 'integrity', label: 'Integrity Check', icon: Shield },
  { id: 'logs', label: 'Log Analysis', icon: AlertTriangle },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'report', label: 'Report', icon: FileText },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center cyber-border">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold cyber-text">ForenSight</h1>
            <p className="text-xs text-muted-foreground">Digital Forensics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary cyber-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="cyber-card p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs matrix-text">Active & Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
