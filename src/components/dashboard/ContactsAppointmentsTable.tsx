import { useState, useMemo } from "react";
import { Mail, Phone, Calendar, FileText, ExternalLink, Download, Filter } from "lucide-react";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
  tags?: string[];
  customFields?: Array<{ id: string; value: string }>;
  attributions?: Array<{ medium?: string; pageUrl?: string }>;
}

type AppointmentFilter = 'all' | 'booked' | 'no-appointment';
type ResumeFilter = 'all' | 'has-resume' | 'no-resume';

interface ContactsAppointmentsTableProps {
  contacts: GHLContact[];
  loading: boolean;
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
    return format(new Date(dateString), 'MMM d, yyyy');
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

export const ContactsAppointmentsTable = ({ contacts, loading }: ContactsAppointmentsTableProps) => {
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentFilter>('all');
  const [resumeFilter, setResumeFilter] = useState<ResumeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search filter
      if (searchQuery) {
        const name = getFullName(contact).toLowerCase();
        const email = (contact.email || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        if (!name.includes(query) && !email.includes(query)) {
          return false;
        }
      }

      // Appointment filter
      const hasAppointment = getAppointmentSource(contact).hasAppointment;
      if (appointmentFilter === 'booked' && !hasAppointment) return false;
      if (appointmentFilter === 'no-appointment' && hasAppointment) return false;

      // Resume filter
      const hasResume = !!getResumeUrl(contact);
      if (resumeFilter === 'has-resume' && !hasResume) return false;
      if (resumeFilter === 'no-resume' && hasResume) return false;

      // Date filter
      if (dateFrom && contact.dateAdded) {
        const contactDate = new Date(contact.dateAdded);
        const fromDate = new Date(dateFrom);
        if (contactDate < fromDate) return false;
      }
      if (dateTo && contact.dateAdded) {
        const contactDate = new Date(contact.dateAdded);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59);
        if (contactDate > toDate) return false;
      }

      return true;
    });
  }, [contacts, appointmentFilter, resumeFilter, searchQuery, dateFrom, dateTo]);

  const handleDownloadResume = (url: string, contactName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contactName.replace(/\s+/g, '_')}_resume.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setAppointmentFilter('all');
    setResumeFilter('all');
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = appointmentFilter !== 'all' || resumeFilter !== 'all' || searchQuery || dateFrom || dateTo;

  if (loading) {
    return (
      <div className="stat-card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Contacts & Appointments</h3>
            <p className="text-sm text-muted-foreground">
              {filteredContacts.length} of {contacts.length} contacts
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px]"
          />
          
          <Select value={appointmentFilter} onValueChange={(v) => setAppointmentFilter(v as AppointmentFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Appointment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="booked">Has Appointment</SelectItem>
              <SelectItem value="no-appointment">No Appointment</SelectItem>
            </SelectContent>
          </Select>

          <Select value={resumeFilter} onValueChange={(v) => setResumeFilter(v as ResumeFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Resume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resumes</SelectItem>
              <SelectItem value="has-resume">Has Resume</SelectItem>
              <SelectItem value="no-resume">No Resume</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">From:</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[140px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">To:</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[140px]"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="min-w-[200px]">Contact</TableHead>
              <TableHead className="min-w-[140px]">Phone</TableHead>
              <TableHead className="min-w-[100px]">Type</TableHead>
              <TableHead className="min-w-[130px]">Appointment</TableHead>
              <TableHead className="min-w-[100px]">Resume</TableHead>
              <TableHead className="min-w-[120px]">Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {contacts.length === 0 ? 'No contacts found' : 'No contacts match the filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.slice(0, 50).map((contact) => {
                const appointment = getAppointmentSource(contact);
                const resumeUrl = getResumeUrl(contact);
                
                return (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-foreground">
                            {getInitials(contact)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {getFullName(contact)}
                          </p>
                          {contact.email && (
                            <a 
                              href={`mailto:${contact.email}`}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
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
                          className="text-primary hover:underline flex items-center gap-1 text-sm"
                        >
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={contact.type === 'lead' ? 'default' : 'secondary'} className="capitalize text-xs">
                        {contact.type || 'lead'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {appointment.hasAppointment ? (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
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
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">
                          None
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {resumeUrl ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadResume(resumeUrl, getFullName(contact))}
                          className="h-7 px-2 text-primary hover:text-primary/80"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(contact.dateAdded)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
