import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Calendar, FileText, ExternalLink, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface GHLContact {
  id: string;
  contactName?: string;
  firstName?: string;
  lastName?: string;
  firstNameRaw?: string;
  lastNameRaw?: string;
  email?: string;
  phone?: string;
  source?: string;
  type?: string;
  dateAdded?: string;
  dateUpdated?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  address1?: string;
  companyName?: string;
  website?: string;
  timezone?: string;
  dnd?: boolean;
  tags?: string[];
  customFields?: Array<{ id: string; value: string }>;
  attributions?: Array<{ medium?: string; pageUrl?: string }>;
}

const getFullName = (contact: GHLContact) => {
  return contact.contactName || 
    `${contact.firstNameRaw || contact.firstName || ''} ${contact.lastNameRaw || contact.lastName || ''}`.trim() || 
    'Unknown';
};

const getInitials = (contact: GHLContact) => {
  const name = getFullName(contact);
  if (!name || name === 'Unknown') return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return '—';
  }
};

const getResumeUrl = (contact: GHLContact) => {
  const resumeField = contact.customFields?.find(
    f => f.value && (f.value.includes('documents/download') || f.value.includes('.pdf'))
  );
  return resumeField?.value;
};

const getAppointmentSource = (contact: GHLContact) => {
  const calendarAttribution = contact.attributions?.find(a => a.medium === 'calendar');
  if (calendarAttribution) {
    return {
      hasAppointment: true,
      bookingUrl: calendarAttribution.pageUrl,
    };
  }
  return { hasAppointment: false, bookingUrl: null };
};

const Contacts = () => {
  const [contacts, setContacts] = useState<GHLContact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ghl-sync', {
        body: { action: 'get_contacts', data: { limit: 100 } },
      });

      if (error) throw error;
      setContacts(data.contacts || []);
    } catch (error: any) {
      toast({
        title: 'Failed to fetch contacts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">All Contacts</h1>
              <p className="text-muted-foreground">
                {contacts.length} contacts from GoHighLevel
              </p>
            </div>
            <Button onClick={fetchAllContacts} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="stat-card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Loading all contacts...</span>
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No contacts found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-card z-10">Contact</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Resume</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>DND</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => {
                      const appointment = getAppointmentSource(contact);
                      const resumeUrl = getResumeUrl(contact);
                      
                      return (
                        <TableRow key={contact.id}>
                          <TableCell className="sticky left-0 bg-card z-10">
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-foreground">
                                  {getInitials(contact)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground whitespace-nowrap">
                                  {getFullName(contact)}
                                </p>
                                {contact.email && (
                                  <a 
                                    href={`mailto:${contact.email}`}
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    <Mail className="w-3 h-3" />
                                    {contact.email}
                                  </a>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            {contact.phone ? (
                              <a 
                                href={`tel:${contact.phone}`}
                                className="text-primary hover:underline flex items-center gap-1 whitespace-nowrap"
                              >
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            <Badge variant={contact.type === 'lead' ? 'default' : 'secondary'} className="capitalize">
                              {contact.type || 'lead'}
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {contact.source || 'Direct'}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            {appointment.hasAppointment ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Booked
                                </Badge>
                                {appointment.bookingUrl && (
                                  <a 
                                    href={appointment.bookingUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                No appointment
                              </Badge>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            {resumeUrl ? (
                              <a 
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <FileText className="w-4 h-4" />
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {[contact.city, contact.state, contact.country]
                                .filter(Boolean)
                                .join(', ') || '—'}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {contact.companyName || '—'}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {contact.tags && contact.tags.length > 0 ? (
                                contact.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(contact.dateAdded)}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(contact.dateUpdated)}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            {contact.dnd ? (
                              <Badge variant="destructive" className="text-xs">DND</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-muted-foreground">OK</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
