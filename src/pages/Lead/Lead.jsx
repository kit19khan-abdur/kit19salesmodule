import React, { useState } from 'react';
import { Search, Phone, Mail, MessageSquare, Calendar, Plus, Users, FileText, MoreHorizontal, Grid, List, ChevronDown, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';
import LeadDetail from './LeadDetail';
import PremiumButton from '../Enquiries/Enquiries/components/PremiumButton';

const Lead = () => {
    const [selectedLead, setSelectedLead] = useState(1);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [activeTab, setActiveTab] = useState('activities');
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);
    const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);


    const leads = [
        { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', status: 'Open', date: '28 Dec 2024', avatar: 'RK' },
        { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', status: 'Callback', date: '27 Dec 2024', avatar: 'PS' },
        { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', status: 'Closed', date: '26 Dec 2024', avatar: 'AP' },
        { id: 4, name: 'Sneha Reddy', phone: '+91 98765 43213', status: 'Open', date: '25 Dec 2024', avatar: 'SR' },
        { id: 5, name: 'Vikram Singh', phone: '+91 98765 43214', status: 'Callback', date: '24 Dec 2024', avatar: 'VS' },
    ];

    const currentLead = leads.find(l => l.id === selectedLead);

    const activities = [
        { type: 'call', action: 'Outbound call made', user: 'John Doe', time: '2 hours ago', icon: Phone },
        { type: 'note', action: 'Note added: Follow up required', user: 'Sarah Smith', time: '5 hours ago', icon: FileText },
        { type: 'email', action: 'Email sent to lead', user: 'John Doe', time: '1 day ago', icon: Mail },
        { type: 'meeting', action: 'Meeting scheduled', user: 'Mike Johnson', time: '2 days ago', icon: Calendar },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-700';
            case 'Callback': return 'bg-yellow-100 text-yellow-700';
            case 'Closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (viewMode === 'list') {
        return <LeadDetail />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar - Lead List */}
            <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isLeftCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-80 opacity-100'}`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Leads</h2>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                <List className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => setIsLeftCollapsed(true)}
                                className="p-1.5 rounded text-gray-400 hover:bg-gray-100"
                                title="Collapse"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {leads.map(lead => (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedLead(lead.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedLead === lead.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                    {lead.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-medium text-gray-900 text-sm truncate">{lead.name}</h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{lead.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{lead.phone}</p>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 border-t border-gray-200 flex justify-center">
                                <PremiumButton
                                //   onClick={onLoadMore}
                                //   disabled={isLoading}
                                  // className="loadmorebutton"
                                >
                                 Load More
                                </PremiumButton>
                              </div>
                </div>
            </div>

            {/* Floating Expand Button for Left Sidebar when Collapsed */}
            {isLeftCollapsed && (
                <button
                    onClick={() => setIsLeftCollapsed(false)}
                    className="fixed bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition z-[9999]"
                    style={{
                        left: '64px',
                        top: '26%',
                        transform: 'translateY(-50%)',
                        padding: '6px'
                    }}
                    title="Expand Leads List"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className={`mx-auto px-2 transition-all duration-300 ${isLeftCollapsed ? 'max-w-full' : 'max-w-6xl'}`}>
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
                                    {currentLead?.avatar}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentLead?.name}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-4 w-4" />
                                            <span>{currentLead?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            <span>rajesh.kumar@email.com</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(currentLead?.status)}`}>
                                    {currentLead?.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-2">Created: {currentLead?.date}, 10:30 AM</p>
                            </div>
                        </div>
                    </div>

                    <div className={`grid gap-6 transition-all duration-300 ${isRightCollapsed ? 'grid-cols-1' : 'grid-cols-3'}`}>
                        {/* Lead Information Card */}
                        <div className={`space-y-6 transition-all duration-300 ${isRightCollapsed ? 'col-span-1' : 'col-span-2'}`}>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">rajesh.kumar@email.com</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Lead ID</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">LD-2024-{currentLead?.id.toString().padStart(4, '0')}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Created Date</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.date}</p>
                                        </div>
                                        {showMoreDetails && (
                                            <>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">City</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">Mumbai</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">State</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">Maharashtra</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Pincode</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">400001</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Source</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">Website Form</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowMoreDetails(!showMoreDetails)}
                                        className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                    >
                                        {showMoreDetails ? (
                                            <>Hide Details <ChevronDown className="h-4 w-4" /></>
                                        ) : (
                                            <>Show More Details <ChevronDown className="h-4 w-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Activity Tabs Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="border-b border-gray-200">
                                    <div className="flex gap-6 px-6">
                                        {['Activities', 'Calls', 'WhatsApp', 'Meetings', 'More'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab.toLowerCase())}
                                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {activities.map((activity, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <activity.icon className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        by {activity.user} • {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Action Panel */}
                        <div className={`space-y-6 transition-all duration-300 relative ${isRightCollapsed ? 'w-0 overflow-hidden opacity-0' : 'col-span-1 w-auto opacity-100'}`}>
                            {/* Contact Options */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-900">Contact Options</h3>
                                    <button
                                        onClick={() => setIsRightCollapsed(true)}
                                        className="p-1 hover:bg-gray-200 rounded transition"
                                        title="Collapse"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Phone className="h-4 w-4" />
                                        Call
                                    </button>
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                        <MessageSquare className="h-4 w-4" />
                                        WhatsApp
                                    </button>
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 transition-colors">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </button>
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 transition-colors">
                                        <MessageSquare className="h-4 w-4" />
                                        SMS
                                    </button>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                                    <button
                                        onClick={() => setIsRightCollapsed(true)}
                                        className="p-1 hover:bg-gray-200 rounded transition"
                                        title="Collapse"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
                                        <Plus className="h-4 w-4" />
                                        Add or Merge Lead
                                    </button>
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
                                        <Calendar className="h-4 w-4" />
                                        Schedule Meeting
                                    </button>
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
                                        <FileText className="h-4 w-4" />
                                        Add Note
                                    </button>
                                    <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
                                        <MessageSquare className="h-4 w-4" />
                                        Send Message
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating Expand Button when Right Sidebar is Collapsed */}
                        {isRightCollapsed && (
                            <button
                                onClick={() => setIsRightCollapsed(false)}
                                className="fixed bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-10"
                                style={{
                                    right: '56px',
                                    top: '8%',
                                    transform: 'translateY(-50%)',
                                    padding: '8px'
                                }}
                                title="Expand Quick Actions"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lead;