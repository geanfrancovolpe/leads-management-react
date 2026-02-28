'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { leadsService } from '@/lib/services/leads.service';
import { campaignsService } from '@/lib/services/campaigns.service';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadsResponse, campaignsResponse] = await Promise.all([
          leadsService.getLeads(),
          campaignsService.getCampaigns(),
        ]);
        
        setStats({
          totalLeads: leadsResponse.count,
          totalCampaigns: campaignsResponse.count,
          activeLeads: leadsResponse.results.filter((l: any) => l.status === 'active').length,
          respondedLeads: leadsResponse.results.filter((l: any) => l.responded).length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Campaigns',
      value: stats?.totalCampaigns || 0,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Leads',
      value: stats?.activeLeads || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Responses',
      value: stats?.respondedLeads || 0,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your campaigns.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/dashboard/leads/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Create Lead</h3>
              <p className="text-sm text-gray-600">Add a new lead to your campaigns</p>
            </a>
            
            <a
              href="/dashboard/campaigns/new"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all cursor-pointer"
            >
              <Briefcase className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold">New Campaign</h3>
              <p className="text-sm text-gray-600">Start a new outreach campaign</p>
            </a>
            
            <a
              href="/dashboard/chat"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">Chat with AI</h3>
              <p className="text-sm text-gray-600">Get help from your AI assistant</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
