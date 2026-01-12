import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GHLStats {
  totalContacts: number;
  totalOpportunities: number;
  totalValue: number;
  conversionRate: string;
  recentContacts: any[];
  pipelineData: any[];
}

export const useGHLData = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<GHLStats | null>(null);
  const { toast } = useToast();

  const testConnection = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ghl-sync', {
        body: { action: 'test_connection' },
      });

      if (error) throw error;

      if (data.success) {
        setConnected(true);
        toast({
          title: 'Connected to GHL',
          description: `Location: ${data.location?.name || 'Connected'}`,
        });
        return true;
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error: any) {
      setConnected(false);
      toast({
        title: 'Connection Failed',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ghl-sync', {
        body: { action: 'get_stats' },
      });

      if (error) throw error;
      
      setStats(data);
      setConnected(true);
      return data;
    } catch (error: any) {
      toast({
        title: 'Failed to fetch stats',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchContacts = useCallback(async (limit = 20) => {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-sync', {
        body: { action: 'get_contacts', data: { limit } },
      });

      if (error) throw error;
      return data.contacts || [];
    } catch (error: any) {
      toast({
        title: 'Failed to fetch contacts',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  const fetchOpportunities = useCallback(async (limit = 20) => {
    try {
      const { data, error } = await supabase.functions.invoke('ghl-sync', {
        body: { action: 'get_opportunities', data: { limit } },
      });

      if (error) throw error;
      return data.opportunities || [];
    } catch (error: any) {
      toast({
        title: 'Failed to fetch opportunities',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  }, [toast]);

  return {
    loading,
    connected,
    stats,
    testConnection,
    fetchStats,
    fetchContacts,
    fetchOpportunities,
  };
};
