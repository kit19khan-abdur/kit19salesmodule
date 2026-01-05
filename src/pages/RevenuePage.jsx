import React from 'react';
import Card from '../components/common/Card';
import { FiTrendingUp, FiDollarSign, FiClock, FiAlertCircle } from 'react-icons/fi';
import { formatCurrency } from '../utils/helpers';

const RevenuePage = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(1250000),
      icon: FiDollarSign,
      color: 'bg-green-500',
      trend: '+18%'
    },
    {
      title: 'Paid',
      value: formatCurrency(980000),
      icon: FiTrendingUp,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Pending',
      value: formatCurrency(180000),
      icon: FiClock,
      color: 'bg-amber-500',
      trend: '+5%'
    },
    {
      title: 'Overdue',
      value: formatCurrency(90000),
      icon: FiAlertCircle,
      color: 'bg-red-500',
      trend: '-8%'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your revenue and payment status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue by Month">
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Integrate with charting library
          </div>
        </Card>

        <Card title="Revenue by Source">
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart placeholder - Integrate with charting library
          </div>
        </Card>
      </div>

      <Card title="Recent Payments">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">Invoice #INV-{1000 + item}</p>
                <p className="text-sm text-gray-500">Customer Name - 2 days ago</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(15000 * item)}</p>
                <p className="text-xs text-green-600">Paid</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RevenuePage;
