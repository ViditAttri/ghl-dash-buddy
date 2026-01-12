import { useEffect } from "react";
import { Users, DollarSign, Target, TrendingUp, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GHLConnectionStatus } from "@/components/dashboard/GHLConnectionStatus";
import { useGHLData } from "@/hooks/useGHLData";

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const formatNumber = (value: number) => {
  return value.toLocaleString();
};

const Index = () => {
  const { stats, connected, loading, fetchStats } = useGHLData();

  useEffect(() => {
    // Auto-fetch stats on mount
    fetchStats();
  }, [fetchStats]);

  const liveStats = [
    { 
      title: "Total Leads", 
      value: stats ? formatNumber(stats.totalContacts) : "—", 
      change: 12.5, 
      icon: Users 
    },
    { 
      title: "Revenue", 
      value: stats ? formatCurrency(stats.totalValue) : "—", 
      change: 8.2, 
      icon: DollarSign 
    },
    { 
      title: "Conversion Rate", 
      value: stats ? stats.conversionRate : "—", 
      change: -2.4, 
      icon: Target 
    },
    { 
      title: "Opportunities", 
      value: stats ? formatNumber(stats.totalOpportunities) : "—", 
      change: 18.7, 
      icon: TrendingUp 
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
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading && !stats ? (
              <div className="col-span-4 flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading GHL data...</span>
              </div>
            ) : (
              liveStats.map((stat, index) => (
                <StatCard 
                  key={stat.title} 
                  {...stat} 
                  delay={index * 100}
                />
              ))
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pipeline Chart */}
            <div className="lg:col-span-2">
              <PipelineChart />
            </div>
            
            {/* Quick Actions */}
            <QuickActions />
          </div>

          {/* Activity and Leads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityChart />
            <RecentLeads />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
