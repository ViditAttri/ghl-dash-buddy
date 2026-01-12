import { Search, Bell, Plus } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <span className="text-sm text-muted-foreground">Welcome back, John 👋</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search contacts, deals..."
            className="w-64 pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Quick Add */}
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>
      </div>
    </header>
  );
};
