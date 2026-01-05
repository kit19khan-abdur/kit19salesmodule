import React, { useState } from 'react';
import { useFollowups, useCreateFollowup, useUpdateFollowup } from '../hooks/useApi';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { formatDateTime } from '../utils/helpers';
import { FiPhone, FiMail, FiMessageSquare, FiPlus } from 'react-icons/fi';

const FollowupsList = () => {
  const [activeTab, setActiveTab] = useState('dueToday');
  const { data, isLoading } = useFollowups({ type: activeTab });

  const tabs = [
    { key: 'dueToday', label: 'Due Today', count: data?.dueTodayCount || 0 },
    { key: 'scheduled', label: 'Scheduled', count: data?.scheduledCount || 0 },
    { key: 'overdue', label: 'Overdue', count: data?.overdueCount || 0 },
    { key: 'none', label: 'No Follow-ups', count: data?.noneCount || 0 }
  ];

  const columns = [
    {
      key: 'leadName',
      label: 'Lead Name',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>
    },
    {
      key: 'mobile',
      label: 'Mobile',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'followupDateTime',
      label: 'Follow-up Date',
      render: (value) => <span className="text-sm">{formatDateTime(value)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Completed' ? 'success' : 'warning'} size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <button className="text-green-600 hover:text-green-700" title="Call">
            <FiPhone className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-700" title="Email">
            <FiMail className="w-4 h-4" />
          </button>
          <button className="text-purple-600 hover:text-purple-700" title="WhatsApp">
            <FiMessageSquare className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
        <Button variant="primary" icon={<FiPlus />}>
          Add Follow-up
        </Button>
      </div>

      <Card>
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <Table
          columns={columns}
          data={data?.items || []}
          loading={isLoading}
          emptyMessage="No follow-ups found"
        />
      </Card>
    </div>
  );
};

export default FollowupsList;
