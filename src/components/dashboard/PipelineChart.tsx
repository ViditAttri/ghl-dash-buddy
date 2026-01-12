const pipelineData = [
  { stage: "New Leads", count: 245, percentage: 100 },
  { stage: "Contacted", count: 189, percentage: 77 },
  { stage: "Qualified", count: 132, percentage: 54 },
  { stage: "Proposal", count: 87, percentage: 35 },
  { stage: "Negotiation", count: 54, percentage: 22 },
  { stage: "Won", count: 38, percentage: 15 },
];

export const PipelineChart = () => {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sales Pipeline</h3>
          <p className="text-sm text-muted-foreground">Current funnel overview</p>
        </div>
        <select className="bg-secondary border-none text-sm text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/50">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="space-y-4">
        {pipelineData.map((item, index) => (
          <div key={item.stage} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.stage}</span>
              <span className="font-semibold text-foreground">{item.count}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full chart-bar"
                style={{ 
                  width: `${item.percentage}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold gradient-text">15.5%</p>
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">$284K</p>
          <p className="text-sm text-muted-foreground">Pipeline Value</p>
        </div>
      </div>
    </div>
  );
};
