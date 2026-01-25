import { Clock, Upload, FileSearch, Shield, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { TimelineEvent } from '@/types/forensics';
import { cn } from '@/lib/utils';

interface TimelineProps {
  events: TimelineEvent[];
}

const eventIcons: Record<TimelineEvent['type'], React.ElementType> = {
  upload: Upload,
  metadata: FileSearch,
  hash: Shield,
  analysis: AlertTriangle,
  report: FileText,
};

const eventColors: Record<TimelineEvent['type'], string> = {
  upload: 'bg-primary/20 text-primary border-primary/30',
  metadata: 'bg-accent/20 text-accent border-accent/30',
  hash: 'bg-success/20 text-success border-success/30',
  analysis: 'bg-warning/20 text-warning border-warning/30',
  report: 'bg-primary/20 text-primary border-primary/30',
};

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
        <p className="text-muted-foreground">Start uploading and analyzing evidence to build your timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="cyber-card p-4 rounded-lg border-primary/30 mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-medium cyber-text">Investigation Timeline</h4>
            <p className="text-sm text-muted-foreground">
              {events.length} event{events.length !== 1 && 's'} recorded
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type];
            
            return (
              <div
                key={event.id}
                className="relative pl-16 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={cn(
                  "absolute left-3 w-7 h-7 rounded-full flex items-center justify-center border",
                  eventColors[event.type]
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Content */}
                <div className="cyber-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-xs text-muted-foreground">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
