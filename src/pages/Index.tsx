import { useEffect, useState } from "react";
import { Users, Calendar, Loader2, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { GHLConnectionStatus } from "@/components/dashboard/GHLConnectionStatus";
import { ContactsAppointmentsTable } from "@/components/dashboard/ContactsAppointmentsTable";
import { AppointmentsTable } from "@/components/dashboard/AppointmentsTable";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
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
  tags?: string[];
  customFields?: Array<{ id: string; value: string }>;
  attributions?: Array<{ medium?: string; pageUrl?: string }>;
}

interface GHLAppointment {
  id: string;
  title?: string;
  calendarId?: string;
  contactId?: string;
  status?: string;
  appoinmentStatus?: string;
  appointmentStatus?: string;
  startTime?: string;
  endTime?: string;
  contact?: {
    id?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

const Index = () => {
  const [contacts, setContacts] = useState<GHLContact[]>([]);
  const [appointments, setAppointments] = useState<GHLAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch contacts and appointments in parallel
      const [contactsResult, appointmentsResult] = await Promise.all([
        supabase.functions.invoke('ghl-sync', {
          body: { action: 'get_contacts', data: { limit: 100 } },
        }),
        supabase.functions.invoke('ghl-sync', {
          body: { action: 'get_appointments', data: {} },
        }),
      ]);

      if (contactsResult.error) throw contactsResult.error;
      if (appointmentsResult.error) throw appointmentsResult.error;

      setContacts(contactsResult.data.contacts || []);
      setAppointments(appointmentsResult.data.events || []);
    } catch (error: any) {
      toast({
        title: 'Failed to fetch data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  const contactsWithAppointments = contacts.filter(c => 
    c.attributions?.some(a => a.medium === 'calendar')
  ).length;

  const upcomingAppointments = appointments.filter(a => {
    if (!a.startTime) return false;
    return new Date(a.startTime) >= new Date();
  }).length;

  const stats = [
    { 
      title: "Total Contacts", 
      value: contacts.length.toString(), 
      change: 0, 
      icon: Users 
    },
    { 
      title: "With Appointments", 
      value: contactsWithAppointments.toString(), 
      change: 0, 
      icon: Calendar 
    },
    { 
      title: "Total Appointments", 
      value: appointments.length.toString(), 
      change: 0, 
      icon: Calendar 
    },
    { 
      title: "Upcoming", 
      value: upcomingAppointments.toString(), 
      change: 0, 
      icon: Calendar 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* GHL Connection Status */}
          <GHLConnectionStatus />
          
          {/* Header with Refresh */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of contacts and appointments
              </p>
            </div>
            <Button onClick={fetchData} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-4 flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading data...</span>
              </div>
            ) : (
              stats.map((stat, index) => (
                <StatCard 
                  key={stat.title} 
                  {...stat} 
                  delay={index * 100}
                />
              ))
            )}
          </div>

          {/* Two Tables Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ContactsAppointmentsTable 
              contacts={contacts} 
              loading={loading} 
            />
            <AppointmentsTable 
              appointments={appointments} 
              loading={loading} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
