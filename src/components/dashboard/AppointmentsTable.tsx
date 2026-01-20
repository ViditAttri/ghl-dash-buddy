import { useState, useMemo } from "react";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import { format, isPast, isFuture, isToday } from "date-fns";
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

interface GHLAppointment {
  id: string;
  title?: string;
  calendarId?: string;
  contactId?: string;
  groupId?: string;
  status?: string;
  appoinmentStatus?: string;
  appointmentStatus?: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  notes?: string;
  contact?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

type TimeFilter = 'all' | 'upcoming' | 'past' | 'today';
type StatusFilter = 'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'showed' | 'noshow';

interface AppointmentsTableProps {
  appointments: GHLAppointment[];
  loading: boolean;
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return '—';
  try {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return '—';
  }
};

const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'h:mm a');
  } catch {
    return '';
  }
};

const getTimeStatus = (startTime?: string): 'upcoming' | 'past' | 'today' => {
  if (!startTime) return 'past';
  const date = new Date(startTime);
  if (isToday(date)) return 'today';
  if (isFuture(date)) return 'upcoming';
  return 'past';
};

const getContactName = (appointment: GHLAppointment) => {
  if (appointment.contact?.name) return appointment.contact.name;
  if (appointment.contact?.firstName || appointment.contact?.lastName) {
    return `${appointment.contact.firstName || ''} ${appointment.contact.lastName || ''}`.trim();
  }
  return 'Unknown Contact';
};

const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'showed' || s === 'completed') return 'default';
  if (s === 'cancelled' || s === 'noshow' || s === 'no-show') return 'destructive';
  return 'secondary';
};

export const AppointmentsTable = ({ appointments, loading }: AppointmentsTableProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search filter
      if (searchQuery) {
        const name = getContactName(appointment).toLowerCase();
        const title = (appointment.title || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        if (!name.includes(query) && !title.includes(query)) {
          return false;
        }
      }

      // Time filter
      const timeStatus = getTimeStatus(appointment.startTime);
      if (timeFilter === 'upcoming' && timeStatus !== 'upcoming' && timeStatus !== 'today') return false;
      if (timeFilter === 'past' && timeStatus !== 'past') return false;
      if (timeFilter === 'today' && timeStatus !== 'today') return false;

      // Status filter
      if (statusFilter !== 'all') {
        const status = (appointment.appointmentStatus || appointment.appoinmentStatus || appointment.status || '').toLowerCase();
        if (!status.includes(statusFilter)) return false;
      }

      // Date filter
      if (dateFrom && appointment.startTime) {
        const appointmentDate = new Date(appointment.startTime);
        const fromDate = new Date(dateFrom);
        if (appointmentDate < fromDate) return false;
      }
      if (dateTo && appointment.startTime) {
        const appointmentDate = new Date(appointment.startTime);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59);
        if (appointmentDate > toDate) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
      const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
      return dateB - dateA;
    });
  }, [appointments, timeFilter, statusFilter, searchQuery, dateFrom, dateTo]);

  const clearFilters = () => {
    setTimeFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = timeFilter !== 'all' || statusFilter !== 'all' || searchQuery || dateFrom || dateTo;

  // Stats
  const upcomingCount = appointments.filter(a => getTimeStatus(a.startTime) === 'upcoming' || getTimeStatus(a.startTime) === 'today').length;
  const pastCount = appointments.filter(a => getTimeStatus(a.startTime) === 'past').length;
  const todayCount = appointments.filter(a => getTimeStatus(a.startTime) === 'today').length;

  if (loading) {
    return (
      <div className="stat-card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Appointments</h3>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{todayCount} today</span>
              <span>•</span>
              <span>{upcomingCount} upcoming</span>
              <span>•</span>
              <span>{pastCount} past</span>
            </div>
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
            placeholder="Search name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px]"
          />
          
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="showed">Showed</SelectItem>
              <SelectItem value="noshow">No Show</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
              <TableHead className="min-w-[180px]">Date & Time</TableHead>
              <TableHead className="min-w-[150px]">Title</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[100px]">Time Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {appointments.length === 0 ? 'No appointments found' : 'No appointments match the filters'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.slice(0, 50).map((appointment) => {
                const timeStatus = getTimeStatus(appointment.startTime);
                const status = appointment.appointmentStatus || appointment.appoinmentStatus || appointment.status || 'pending';
                
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {getContactName(appointment)}
                          </p>
                          {appointment.contact?.email && (
                            <p className="text-xs text-muted-foreground">
                              {appointment.contact.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {formatDateTime(appointment.startTime)}
                          </p>
                          {appointment.endTime && (
                            <p className="text-xs text-muted-foreground">
                              to {formatTime(appointment.endTime)}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {appointment.title || '—'}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getStatusVariant(status)} className="capitalize text-xs">
                        {status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          timeStatus === 'today' 
                            ? 'bg-warning/10 text-warning border-warning/20' 
                            : timeStatus === 'upcoming' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {timeStatus === 'today' ? 'Today' : timeStatus === 'upcoming' ? 'Upcoming' : 'Past'}
                      </Badge>
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
