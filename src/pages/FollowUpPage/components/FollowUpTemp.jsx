import React, { useState } from 'react';
import { 
  Phone, Mail, Video, FileText, Calendar, 
  Settings, Plus, MoreVertical, ChevronLeft, 
  ChevronRight, User, TrendingUp
} from 'lucide-react';

const FollowUpTemp = () => {
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [currentPage, setCurrentPage] = useState(1);

  const statusFilters = [
    { 
      id: 'overdue', 
      label: 'Overdue', 
      count: 1247, 
      color: 'rose',
      gradient: 'from-rose-500 to-pink-500'
    },
    { 
      id: 'today', 
      label: 'Due Today', 
      count: 892, 
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      id: 'scheduled', 
      label: 'Scheduled', 
      count: 3456, 
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      id: 'none', 
      label: 'No Follow-up', 
      count: 2103, 
      color: 'slate',
      gradient: 'from-slate-500 to-gray-500'
    }
  ];

  const followUpTypes = {
    call: { icon: Phone, color: 'blue', label: 'Call-Back' },
    email: { icon: Mail, color: 'purple', label: 'Email' },
    demo: { icon: Video, color: 'indigo', label: 'Demo' },
    meeting: { icon: Calendar, color: 'cyan', label: 'Meeting' },
    contract: { icon: FileText, color: 'green', label: 'Contract' }
  };

  const followUps = [
    {
      id: 1,
      type: 'call',
      title: 'Product inquiry follow-up',
      dueDate: '13 Jan 2026',
      dueTime: '16:49',
      created: '10 Jan 2026 09:30',
      contactCount: 3,
      contact: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        avatar: 'RK',
        activityCount: 2
      },
      status: 'today',
      priority: 'high'
    },
    {
      id: 2,
      type: 'email',
      title: 'Proposal discussion',
      dueDate: '12 Jan 2026',
      dueTime: '14:20',
      created: '08 Jan 2026 11:45',
      contactCount: 1,
      contact: {
        name: 'Priya Sharma',
        phone: '+91 87654 32109',
        avatar: 'PS',
        activityCount: 5
      },
      status: 'overdue',
      priority: 'urgent'
    },
    {
      id: 3,
      type: 'demo',
      title: 'Platform walkthrough',
      dueDate: '15 Jan 2026',
      dueTime: '10:00',
      created: '11 Jan 2026 16:12',
      contactCount: 0,
      contact: {
        name: 'Amit Patel',
        phone: '+91 76543 21098',
        avatar: 'AP',
        activityCount: 1
      },
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'contract',
      title: 'Agreement review',
      dueDate: '13 Jan 2026',
      dueTime: '18:30',
      created: '09 Jan 2026 13:25',
      contactCount: 2,
      contact: {
        name: 'Sneha Reddy',
        phone: '+91 65432 10987',
        avatar: 'SR',
        activityCount: 3
      },
      status: 'today',
      priority: 'high'
    },
    {
      id: 5,
      type: 'meeting',
      title: 'Quarterly business review',
      dueDate: '20 Jan 2026',
      dueTime: '11:00',
      created: '12 Jan 2026 08:15',
      contactCount: 4,
      contact: {
        name: 'Vikram Singh',
        phone: '+91 54321 09876',
        avatar: 'VS',
        activityCount: 0
      },
      status: 'scheduled',
      priority: 'medium'
    }
  ];

  const toggleFilter = (filterId) => {
    if (filterId === 'all') {
      setSelectedFilters(['all']);
    } else {
      const newFilters = selectedFilters.includes(filterId)
        ? selectedFilters.filter(f => f !== filterId)
        : [...selectedFilters.filter(f => f !== 'all'), filterId];
      
      setSelectedFilters(newFilters.length === 0 ? ['all'] : newFilters);
    }
  };

  const getPriorityIndicator = (priority) => {
    const colors = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const TypeIcon = followUpTypes[type]?.icon || Calendar;
    return TypeIcon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full p-2">
        
        {/* Page Header */}
        {/* <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Follow Ups</h1>
            <p className="text-gray-600 text-sm">Track and manage all customer interactions</p>
          </div>
          <button 
            className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            title="Settings"
          >
            <Settings className="text-gray-600" size={20} />
          </button>
        </div> */}

        

        {/* Insights Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Active Filters: <span className="font-semibold text-gray-900">{selectedFilters.length}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <TrendingUp className="text-green-600" size={16} />
                <span className="text-sm font-semibold text-gray-900">₹45.2M</span>
                <span className="text-xs text-gray-600">Pipeline</span>
              </div>
            </div>
            
            {/* <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleFilter('all')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Show All
              </button>
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">1–100</span> of{' '}
                <span className="font-semibold text-gray-900">570,373</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Follow-ups List */}
        <div className="space-y-3 mb-6">
          {followUps.map(item => {
            const TypeIcon = getTypeIcon(item.type);
            const typeColor = followUpTypes[item.type]?.color || 'gray';
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    
                    {/* Priority Indicator */}
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className={`w-1 h-16 rounded-full ${getPriorityIndicator(item.priority)}`}></div>
                    </div>

                    {/* Type Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-${typeColor}-50 flex items-center justify-center flex-shrink-0`}>
                      <TypeIcon className={`text-${typeColor}-600`} size={24} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className={`px-2.5 py-1 rounded-lg font-medium bg-${typeColor}-50 text-${typeColor}-700`}>
                              {followUpTypes[item.type]?.label}
                            </span>
                            <span>Created: {item.created}</span>
                          </div>
                        </div>
                        
                        {/* Due Date Badge */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100">
                          <div className="text-xs text-gray-600 mb-0.5">Due</div>
                          <div className="font-semibold text-gray-900">{item.dueDate}</div>
                          <div className="text-sm text-blue-600 font-medium">{item.dueTime}</div>
                        </div>
                      </div>

                      {/* Contact Info & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          
                          {/* Avatar with Badge */}
                          <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                              {item.contact.avatar}
                            </div>
                            {item.contact.activityCount > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white">
                                {item.contact.activityCount}
                              </div>
                            )}
                          </div>

                          {/* Contact Details */}
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-0.5">
                              {item.contact.name}
                            </div>
                            <a 
                              href={`tel:${item.contact.phone}`}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group/phone"
                            >
                              <Phone size={14} />
                              <span className="group-hover/phone:underline">{item.contact.phone}</span>
                            </a>
                          </div>

                          {/* Contact Count */}
                          {item.contactCount > 0 && (
                            <div className="px-3 py-1.5 bg-gray-100 rounded-lg flex items-center gap-1.5">
                              <User size={14} className="text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                +{item.contactCount}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Add follow-up"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                            title="More actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </div>
  );
};

export default FollowUpTemp;