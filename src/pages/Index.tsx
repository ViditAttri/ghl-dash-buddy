import { Users, DollarSign, Target, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { QuickActions } from "@/components/dashboard/QuickActions";

const stats = [
  { title: "Total Leads", value: "2,847", change: 12.5, icon: Users },
  { title: "Revenue", value: "$128.4K", change: 8.2, icon: DollarSign },
  { title: "Conversion Rate", value: "15.5%", change: -2.4, icon: Target },
  { title: "Active Campaigns", value: "24", change: 18.7, icon: TrendingUp },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard 
                key={stat.title} 
                {...stat} 
                delay={index * 100}
              />
            ))}
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
