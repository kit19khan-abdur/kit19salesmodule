import React from 'react';
import { useDashboardStats } from '../hooks/useApi';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { FiUsers, FiUserPlus, FiTarget, FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Enquiries',
      value: stats?.totalEnquiries || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: FiUserPlus,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Conversions',
      value: stats?.conversions || 0,
      icon: FiTarget,
      color: 'bg-purple-500',
      trend: '+15%'
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats?.revenue || 0),
      icon: FiDollarSign,
      color: 'bg-indigo-500',
      trend: '+22%'
    },
    {
      title: 'Active Deals',
      value: stats?.activeDeals || 0,
      icon: FiTrendingUp,
      color: 'bg-amber-500',
      trend: '+5%'
    },
    {
      title: 'Follow-ups Today',
      value: stats?.followupsToday || 0,
      icon: FiCalendar,
      color: 'bg-red-500',
      trend: 'Due'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.trend} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activities">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New lead added by John Doe</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Performing Sales Reps">
          <div className="space-y-4">
            {[
              { name: 'John Doe', deals: 24, revenue: 125000 },
              { name: 'Jane Smith', deals: 19, revenue: 98000 },
              { name: 'Mike Johnson', deals: 15, revenue: 76000 }
            ].map((rep, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {rep.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rep.name}</p>
                    <p className="text-xs text-gray-500">{rep.deals} deals closed</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-600">{formatCurrency(rep.revenue)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
            <FiUserPlus className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Lead</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
            <FiCalendar className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Schedule Follow-up</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
            <FiTarget className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Create Deal</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
            <FiDollarSign className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Generate Invoice</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
