import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Zap,
  Target,
  Mail,
  Phone
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Contacts" },
  { icon: Target, label: "Pipelines" },
  { icon: MessageSquare, label: "Conversations" },
  { icon: Calendar, label: "Calendar" },
  { icon: Mail, label: "Email Marketing" },
  { icon: Phone, label: "Phone System" },
  { icon: Zap, label: "Automations" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">GHL</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center pulse-dot">
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
