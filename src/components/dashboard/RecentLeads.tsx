import { MoreHorizontal, Mail, Phone, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GHLContact {
  id: string;
  contactName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  type?: string;
  dateAdded?: string;
}

interface RecentLeadsProps {
  contacts?: GHLContact[];
  loading?: boolean;
}

const statusColors: Record<string, string> = {
  "lead": "bg-primary/20 text-primary",
  "customer": "bg-success/20 text-success",
  "prospect": "bg-warning/20 text-warning",
  "new": "bg-accent/20 text-accent",
};

const getInitials = (contact: GHLContact) => {
  const name = contact.contactName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getFullName = (contact: GHLContact) => {
  return contact.contactName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown';
};

const getTimeAgo = (dateString?: string) => {
  if (!dateString) return '—';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return '—';
  }
};

export const RecentLeads = ({ contacts = [], loading = false }: RecentLeadsProps) => {
  return (
    <div className="stat-card animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Leads</h3>
          <p className="text-sm text-muted-foreground">Latest contacts from GHL</p>
        </div>
        <button className="text-primary text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading contacts...</span>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No recent contacts found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b border-border/50">
                <th className="pb-4 font-medium">Contact</th>
                <th className="pb-4 font-medium">Source</th>
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 font-medium">Added</th>
                <th className="pb-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(0, 5).map((contact) => (
                <tr key={contact.id} className="table-row">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-semibold text-foreground">
                          {getInitials(contact)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{getFullName(contact)}</p>
                        <p className="text-sm text-muted-foreground">{contact.email || contact.phone || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {contact.source || 'Direct'}
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[contact.type?.toLowerCase() || 'lead'] || statusColors.lead}`}>
                      {contact.type || 'Lead'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {getTimeAgo(contact.dateAdded)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {contact.email && (
                        <a 
                          href={`mailto:${contact.email}`}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {contact.phone && (
                        <a 
                          href={`tel:${contact.phone}`}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
