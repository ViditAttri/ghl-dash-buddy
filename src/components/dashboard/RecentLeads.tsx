import { MoreHorizontal, Mail, Phone } from "lucide-react";

const leads = [
  { name: "Sarah Johnson", email: "sarah@techcorp.com", source: "Facebook Ads", status: "New", value: "$12,500", time: "2 min ago" },
  { name: "Mike Chen", email: "mike@startupxyz.io", source: "Google Ads", status: "Contacted", value: "$8,900", time: "15 min ago" },
  { name: "Emily Davis", email: "emily@agency.co", source: "Referral", status: "Qualified", value: "$24,000", time: "1 hour ago" },
  { name: "James Wilson", email: "james@enterprise.com", source: "Website", status: "Proposal", value: "$45,000", time: "2 hours ago" },
  { name: "Lisa Thompson", email: "lisa@retail.com", source: "LinkedIn", status: "New", value: "$6,200", time: "3 hours ago" },
];

const statusColors: Record<string, string> = {
  "New": "bg-primary/20 text-primary",
  "Contacted": "bg-warning/20 text-warning",
  "Qualified": "bg-success/20 text-success",
  "Proposal": "bg-accent/20 text-accent",
};

export const RecentLeads = () => {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
          <p className="text-sm text-muted-foreground">Latest opportunities</p>
        </div>
        <button className="text-primary text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
              <th className="pb-4 font-medium">Contact</th>
              <th className="pb-4 font-medium">Source</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Value</th>
              <th className="pb-4 font-medium">Time</th>
              <th className="pb-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={index} className="table-row">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-semibold text-foreground">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-muted-foreground">{lead.source}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-4 font-semibold text-foreground">{lead.value}</td>
                <td className="py-4 text-sm text-muted-foreground">{lead.time}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
