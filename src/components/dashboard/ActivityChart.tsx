const weekData = [
  { day: "Mon", calls: 45, emails: 32, meetings: 8 },
  { day: "Tue", calls: 52, emails: 48, meetings: 12 },
  { day: "Wed", calls: 38, emails: 41, meetings: 6 },
  { day: "Thu", calls: 65, emails: 55, meetings: 15 },
  { day: "Fri", calls: 48, emails: 38, meetings: 10 },
  { day: "Sat", calls: 22, emails: 18, meetings: 3 },
  { day: "Sun", calls: 15, emails: 12, meetings: 2 },
];

const maxValue = Math.max(...weekData.flatMap(d => [d.calls, d.emails, d.meetings]));

export const ActivityChart = () => {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Weekly Activity</h3>
          <p className="text-sm text-muted-foreground">Team performance this week</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Emails</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">Meetings</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-48">
        {weekData.map((item, index) => (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center gap-1 h-40">
              <div 
                className="w-3 rounded-t bg-primary transition-all duration-700"
                style={{ 
                  height: `${(item.calls / maxValue) * 100}%`,
                  animationDelay: `${index * 50}ms`
                }}
              />
              <div 
                className="w-3 rounded-t bg-success transition-all duration-700"
                style={{ 
                  height: `${(item.emails / maxValue) * 100}%`,
                  animationDelay: `${index * 50 + 100}ms`
                }}
              />
              <div 
                className="w-3 rounded-t bg-warning transition-all duration-700"
                style={{ 
                  height: `${(item.meetings / maxValue) * 100}%`,
                  animationDelay: `${index * 50 + 200}ms`
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xl font-bold text-primary">285</p>
          <p className="text-xs text-muted-foreground">Total Calls</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-success">244</p>
          <p className="text-xs text-muted-foreground">Emails Sent</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-warning">56</p>
          <p className="text-xs text-muted-foreground">Meetings</p>
        </div>
      </div>
    </div>
  );
};
