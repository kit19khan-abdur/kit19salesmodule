import React, { useState } from 'react';
import { Search, Phone, Mail, MessageSquare, Calendar, Plus, FileText, MoreVertical, Grid, List, RefreshCw, ChevronDown, ChevronLeft, ChevronRight, X, LayoutGrid } from 'lucide-react';
import Lead from './Lead';

const LeadDetail = () => {
    const [view, setView] = useState('table'); // 'table' or 'grid'
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [detailView, setDetailView] = useState(null);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [showAllTabs, setShowAllTabs] = useState(false);
    const [activeTab, setActiveTab] = useState('activities');
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);

    const leadsData = [
        { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh.kumar@email.com', date: '28 Dec 2024, 10:30 AM', source: 'Website', status: 'Open', type: 'Hot Lead', avatar: 'RK', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya.sharma@email.com', date: '27 Dec 2024, 02:15 PM', source: 'Referral', status: 'Open', type: 'Warm Lead', avatar: 'PS', city: 'Delhi', state: 'Delhi', pincode: '110001' },
        { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit.patel@email.com', date: '26 Dec 2024, 09:45 AM', source: '-', status: 'Callback', type: '-', avatar: 'AP', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
        { id: 4, name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha.reddy@email.com', date: '25 Dec 2024, 11:20 AM', source: 'LinkedIn', status: 'Open', type: 'Cold Lead', avatar: 'SR', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
        { id: 5, name: 'Vikram Singh', phone: '+91 98765 43214', email: 'vikram.singh@email.com', date: '24 Dec 2024, 04:30 PM', source: 'Direct Call', status: 'Closed', type: 'Hot Lead', avatar: 'VS', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
        { id: 6, name: 'Anita Desai', phone: '+91 98765 43215', email: 'anita.desai@email.com', date: '23 Dec 2024, 01:10 PM', source: 'Website', status: 'Open', type: 'Warm Lead', avatar: 'AD', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        { id: 7, name: 'Rohit Mehta', phone: '+91 98765 43216', email: 'rohit.mehta@email.com', date: '22 Dec 2024, 03:50 PM', source: '-', status: 'Callback', type: '-', avatar: 'RM', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
        { id: 8, name: 'Kavita Joshi', phone: '+91 98765 43217', email: 'kavita.joshi@email.com', date: '21 Dec 2024, 10:00 AM', source: 'Facebook', status: 'Open', type: 'Cold Lead', avatar: 'KJ', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    ];

    const activities = [
        { type: 'call', action: 'Outbound call made', user: 'John Doe', time: '2 hours ago', icon: Phone },
        { type: 'note', action: 'Note added: Follow up required', user: 'Sarah Smith', time: '5 hours ago', icon: FileText },
        { type: 'email', action: 'Email sent to lead', user: 'John Doe', time: '1 day ago', icon: Mail },
        { type: 'meeting', action: 'Meeting scheduled', user: 'Mike Johnson', time: '2 days ago', icon: Calendar },
    ];

    const toggleLeadSelection = (id) => {
        setSelectedLeads(prev =>
            prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedLeads(selectedLeads.length === leadsData.length ? [] : leadsData.map(l => l.id));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-700';
            case 'Callback': return 'bg-yellow-100 text-yellow-700';
            case 'Closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (view === 'grid' && !detailView) {
        return <Lead />
    }

    // if (detailView) {
    //     const lead = leadsData.find(l => l.id === detailView);

    //     return (
    //         <div className="flex h-screen bg-gray-50">
    //             {/* Left Sidebar - Lead List */}
    //             <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
    //                 <div className="p-4 border-b border-gray-200">
    //                     <div className="flex items-center justify-between mb-3">
    //                         <h2 className="text-lg font-semibold text-gray-800">Leads</h2>
    //                         <button
    //                             onClick={() => setDetailView(null)}
    //                             className="p-1 hover:bg-gray-100 rounded"
    //                         >
    //                             <X className="h-5 w-5 text-gray-500" />
    //                         </button>
    //                     </div>
    //                     <div className="relative">
    //                         <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    //                         <input
    //                             type="text"
    //                             placeholder="Search leads..."
    //                             className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                         />
    //                     </div>
    //                 </div>

    //                 <div className="flex-1 overflow-y-auto">
    //                     {leadsData.map(l => (
    //                         <div
    //                             key={l.id}
    //                             onClick={() => setDetailView(l.id)}
    //                             className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${detailView === l.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
    //                                 }`}
    //                         >
    //                             <div className="flex items-start gap-3">
    //                                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
    //                                     {l.avatar}
    //                                 </div>
    //                                 <div className="flex-1 min-w-0">
    //                                     <div className="flex justify-between items-start mb-1">
    //                                         <h3 className="font-medium text-gray-900 text-sm truncate">{l.name}</h3>
    //                                         <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{l.date.split(',')[0]}</span>
    //                                     </div>
    //                                     <p className="text-xs text-gray-600 mb-2">{l.phone}</p>
    //                                     <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(l.status)}`}>
    //                                         {l.status}
    //                                     </span>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>

    //             {/* Main Content Area */}
    //             <div className="flex-1 overflow-y-auto">
    //                 <div className="w-full h-full p-6">
    //                     {/* Header Section */}
    //                     <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
    //                         <div className="flex items-start justify-between">
    //                             <div className="flex items-start gap-4">
    //                                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
    //                                     {lead.avatar}
    //                                 </div>
    //                                 <div>
    //                                     <h1 className="text-2xl font-bold text-gray-900 mb-2">{lead.name}</h1>
    //                                     <div className="flex items-center gap-4 text-sm text-gray-600">
    //                                         <div className="flex items-center gap-1.5">
    //                                             <Phone className="h-4 w-4" />
    //                                             <span>{lead.phone}</span>
    //                                         </div>
    //                                         <div className="flex items-center gap-1.5">
    //                                             <Mail className="h-4 w-4" />
    //                                             <span>{lead.email}</span>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                             <div className="text-right">
    //                                 <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
    //                                     {lead.status}
    //                                 </span>
    //                                 <p className="text-xs text-gray-500 mt-2">Created: {lead.date}</p>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     <div className={`grid gap-6 transition-all duration-300 ${isRightCollapsed ? 'grid-cols-1' : 'grid-cols-3'}`}>
    //                         {/* Lead Information Card */}
    //                         <div className={`space-y-6 transition-all duration-300 ${isRightCollapsed ? 'col-span-1' : 'col-span-2'}`}>
    //                             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    //                                 <div className="p-6 border-b border-gray-200">
    //                                     <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
    //                                 </div>
    //                                 <div className="p-6">
    //                                     <div className="grid grid-cols-2 gap-6">
    //                                         <div>
    //                                             <label className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</label>
    //                                             <p className="mt-1 text-sm font-medium text-gray-900">{lead.phone}</p>
    //                                         </div>
    //                                         <div>
    //                                             <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
    //                                             <p className="mt-1 text-sm font-medium text-gray-900">{lead.email}</p>
    //                                         </div>
    //                                         <div>
    //                                             <label className="text-xs text-gray-500 uppercase tracking-wide">Lead ID</label>
    //                                             <p className="mt-1 text-sm font-medium text-gray-900">LD-2024-{lead.id.toString().padStart(4, '0')}</p>
    //                                         </div>
    //                                         <div>
    //                                             <label className="text-xs text-gray-500 uppercase tracking-wide">Created Date</label>
    //                                             <p className="mt-1 text-sm font-medium text-gray-900">{lead.date}</p>
    //                                         </div>
    //                                         {showMoreDetails && (
    //                                             <>
    //                                                 <div>
    //                                                     <label className="text-xs text-gray-500 uppercase tracking-wide">City</label>
    //                                                     <p className="mt-1 text-sm font-medium text-gray-900">{lead.city}</p>
    //                                                 </div>
    //                                                 <div>
    //                                                     <label className="text-xs text-gray-500 uppercase tracking-wide">State</label>
    //                                                     <p className="mt-1 text-sm font-medium text-gray-900">{lead.state}</p>
    //                                                 </div>
    //                                                 <div>
    //                                                     <label className="text-xs text-gray-500 uppercase tracking-wide">Pincode</label>
    //                                                     <p className="mt-1 text-sm font-medium text-gray-900">{lead.pincode}</p>
    //                                                 </div>
    //                                                 <div>
    //                                                     <label className="text-xs text-gray-500 uppercase tracking-wide">Source</label>
    //                                                     <p className="mt-1 text-sm font-medium text-gray-900">{lead.source}</p>
    //                                                 </div>
    //                                             </>
    //                                         )}
    //                                     </div>
    //                                     <button
    //                                         onClick={() => setShowMoreDetails(!showMoreDetails)}
    //                                         className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
    //                                     >
    //                                         {showMoreDetails ? 'Hide Details' : 'Show More Details'}
    //                                         <ChevronDown className={`h-4 w-4 transition-transform ${showMoreDetails ? 'rotate-180' : ''}`} />
    //                                     </button>
    //                                 </div>
    //                             </div>

    //                             {/* Activity Tabs Section */}
    //                             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    //                                 <div className="border-b border-gray-200">
    //                                     <div className="flex gap-6 px-6">
    //                                         {[
    //                                             'Activities',
    //                                             'Calls',
    //                                             'WhatsApp',
    //                                             'Meetings',
    //                                             ...(showAllTabs
    //                                                 ? ['Physical Appointments', 'Chat', 'Webform']
    //                                                 : [])
    //                                         ].map(tab => (
    //                                             <button
    //                                                 key={tab}
    //                                                 onClick={() => setActiveTab(tab.toLowerCase())}
    //                                                 className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase()
    //                                                         ? 'border-blue-500 text-blue-600'
    //                                                         : 'border-transparent text-gray-600 hover:text-gray-900'
    //                                                     }`}
    //                                             >
    //                                                 {tab}
    //                                             </button>
    //                                         ))}

    //                                         <button
    //                                             onClick={() => setShowAllTabs(prev => !prev)}
    //                                             className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
    //                                         >
    //                                             {showAllTabs ? 'Less' : 'More'}
    //                                         </button>
    //                                     </div>
    //                                 </div>

    //                                 <div className="p-6">
    //                                     <div className="space-y-4">
    //                                         {activities.map((activity, idx) => (
    //                                             <div key={idx} className="flex gap-4">
    //                                                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
    //                                                     <activity.icon className="h-5 w-5 text-blue-600" />
    //                                                 </div>
    //                                                 <div className="flex-1">
    //                                                     <p className="text-sm font-medium text-gray-900">{activity.action}</p>
    //                                                     <p className="text-xs text-gray-500 mt-0.5">
    //                                                         by {activity.user} • {activity.time}
    //                                                     </p>
    //                                                 </div>
    //                                             </div>
    //                                         ))}
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>

    //                         {/* Right Sidebar - Action Panel */}
    //                         <div className={`space-y-6 transition-all duration-300 relative ${isRightCollapsed ? 'w-0 overflow-hidden opacity-0' : 'col-span-1 w-auto opacity-100'}`}>
    //                             {/* Contact Options */}
    //                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    //                                 <div className="flex items-center justify-between mb-4">
    //                                     <h3 className="text-sm font-semibold text-gray-900">Contact Options</h3>
    //                                     <button
    //                                         onClick={() => setIsRightCollapsed(true)}
    //                                         className="p-1 hover:bg-gray-200 rounded transition"
    //                                         title="Collapse"
    //                                     >
    //                                         <ChevronRight className="w-4 h-4 text-gray-600" />
    //                                     </button>
    //                                 </div>
    //                                 <div className="space-y-3">
    //                                     <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
    //                                         <Phone className="h-4 w-4" />
    //                                         Call
    //                                     </button>
    //                                     <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
    //                                         <MessageSquare className="h-4 w-4" />
    //                                         WhatsApp
    //                                     </button>
    //                                     <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 transition-colors">
    //                                         <Mail className="h-4 w-4" />
    //                                         Email
    //                                     </button>
    //                                     <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 transition-colors">
    //                                         <MessageSquare className="h-4 w-4" />
    //                                         SMS
    //                                     </button>
    //                                 </div>
    //                             </div>

    //                             {/* Quick Actions */}
    //                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    //                                 <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
    //                                 <div className="space-y-3">
    //                                     <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
    //                                         <Plus className="h-4 w-4" />
    //                                         Add or Merge Lead
    //                                     </button>
    //                                     <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
    //                                         <Calendar className="h-4 w-4" />
    //                                         Schedule Meeting
    //                                     </button>
    //                                     <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
    //                                         <FileText className="h-4 w-4" />
    //                                         Add Note
    //                                     </button>
    //                                     <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-start gap-2 transition-colors">
    //                                         <MessageSquare className="h-4 w-4" />
    //                                         Send Message
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                         </div>

    //                         {/* Floating Expand Button when Right Sidebar is Collapsed */}
    //                         {isRightCollapsed && (
    //                             <button
    //                                 onClick={() => setIsRightCollapsed(false)}
    //                                 className="fixed bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-10"
    //                                 style={{
    //                                     right: '56px',
    //                                     top: '8%',
    //                                     transform: 'translateY(-50%)',
    //                                     padding: '8px'
    //                                 }}
    //                                 title="Expand Quick Actions"
    //                             >
    //                                 <Plus className="w-5 h-5" />
    //                             </button>
    //                         )}
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // Table View
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Search className="h-5 w-5 text-gray-400" />
                            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">20 of 3667</span>
                            <div className="flex items-center gap-1  rounded-lg p-1">
                                <button
                                    onClick={() => setView('table')}
                                    className={`p-1.5 rounded ${view === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-1.5 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <RefreshCw className="h-5 w-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreVertical className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-12 px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedLeads.length === leadsData.length}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lead Details</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Creation Details</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {leadsData.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        onClick={() => setDetailView(lead.id)}
                                        className={`cursor-pointer transition-colors ${selectedLeads.includes(lead.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <td className="px-4 py-1" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={() => toggleLeadSelection(lead.id)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                                    {lead.avatar}
                                                </div>
                                                <span className="font-medium text-gray-900">{lead.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <Phone className="h-4 w-4" />
                                                <span className="text-sm">{lead.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">{lead.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            <div className="text-sm">
                                                {/* <div className="text-xs text-gray-500 uppercase">Date</div> */}
                                                <div className="text-gray-900 mt-0.5">{lead.date}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            <span className="text-sm text-gray-700">{lead.source}</span>
                                        </td>
                                        <td className="px-4 py-1">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1">
                                            <span className="text-sm text-gray-700">{lead.type}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                            </button>
                            {[1, 2, 3, 4, 5].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-white'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="p-2 hover:bg-white rounded transition-colors"
                            >
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;