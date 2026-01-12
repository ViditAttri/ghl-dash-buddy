import { Phone, Mail, Calendar, MessageSquare, Zap, FileText } from "lucide-react";

const actions = [
  { icon: Phone, label: "Log Call", color: "bg-primary/10 text-primary" },
  { icon: Mail, label: "Send Email", color: "bg-success/10 text-success" },
  { icon: Calendar, label: "Schedule", color: "bg-warning/10 text-warning" },
  { icon: MessageSquare, label: "SMS", color: "bg-accent/10 text-accent" },
  { icon: Zap, label: "Automation", color: "bg-destructive/10 text-destructive" },
  { icon: FileText, label: "Create Task", color: "bg-muted text-foreground" },
];

export const QuickActions = () => {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "500ms" }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary transition-all duration-200 group"
          >
            <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
