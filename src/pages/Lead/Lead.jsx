
import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, MessageSquare, Calendar, Plus, Users, FileText, MoreHorizontal, Grid, List, ChevronDown, LayoutGrid } from 'lucide-react';
import LeadDetail from './LeadDetail';
import PremiumButton from '../Enquiries/Enquiries/components/PremiumButton';
import { getLeadList, getLeadActivities, getLeadDetailList } from '../../utils/lead';
import { getSession } from '../../getSession';

const Lead = () => {
    const [selectedLead, setSelectedLead] = useState(null);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [activeTab, setActiveTab] = useState('activities');

    const [leads, setLeads] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState('20');
    const [startIndex, setStartIndex] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');

    const { userId,parentId, TokenId } = getSession();

    const currentLead = leads.find(l => l.id === selectedLead) || leads[0] || null;

    const fetchLeads = async (loadMore = false, page = 1) => {
        setIsLoading(true);
        const pageNum = page || currentPage || 1;
        const limit = parseInt(itemsPerPage) || 20;
        const start = loadMore ? startIndex : (pageNum - 1) * limit;
        const end = start + limit - 1;

        // Build Details object to match GetLeadDetailListNew definition
        const details = {
            draw: pageNum,
            StartNo: start,
            EndNo: end,
            UserId: userId || 0,
            SearchName: '',
            ParentId: parentId || 0,
            FilterText: searchText || '',
            OrderStr: '',
            TextSearch: searchText || '',
            NotFollowUp: 0
        };

        const payload = {
            Token: TokenId,
            Message: "",
            LoggedUserId: userId,
            MAC_Address: "",
            IP_Address: "102.16.32.189",
            Details: details,
            BroadcastName: ""
        };

        try {
            // Use the detail-list API which returns a DataTable-like response
            const response = await getLeadDetailList(payload);
            // The helper returns response.data (objResponseStatusEntity), so Details contains the DataTableResponse
            const table = response?.Details || {};
            setTotalRecord(table?.recordsFiltered || table?.recordsTotal || 0);

            const rows = table?.data || [];
            if (loadMore) {
                setLeads(prev => [...prev, ...rows]);
            } else {
                setLeads(rows);
                if (rows.length > 0) {
                    const first = rows[0];
                    // Data keys vary; try common id fields
                    setSelectedLead(first.LeadId || first.Id || first.id || first.leadId || null);
                }
            }
        } catch (error) {
            console.error('fetchLeads error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleLoadMore = () => {
    const newStart = startIndex + parseInt(itemsPerPage);
    setStartIndex(newStart);
    fetchLeads(true);
    };
    const handleSelectLead = async (lead) => {
        setSelectedLead(lead.LeadId || lead.ID || null);
        try {
            // const payload = {
            //     LeadId: lead.LeadId || lead.ID,
            //     Start: 0,
            //     Limit: 10
            // };
             const details = {
            LeadId: lead.LeadId || lead.ID,
                Start: 0,
                Limit: 10
        };

        const payload = {
            Token: TokenId,
            Message: "",
            LoggedUserId: userId,
            MAC_Address: "",
            IP_Address: "102.16.32.189",
            Details: details,
            BroadcastName: ""
        };
            const response = await getLeadActivities(payload);
            setActivities(response?.d || []);
        } catch (error) {
            console.error('getLeadActivities error:', error);
            setActivities([]);
        }
    };

    
const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchLeads(false, page);
  };

  useEffect(() => {
        fetchLeads(false, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  // Fetch data when itemsPerPage changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      fetchLeads(false, 1);
    } else {
      fetchLeads(false, 1);
    }
  }, [itemsPerPage]);
const searchTText = async () => {
    setLeads([]);
    setStartIndex(0);
    const payload = {
      Token: TokenId,
      Message: "",
      LoggedUserId: userId,
      MAC_Address: "",
      IP_Address: "102.16.32.189",
      Details: {
        UserId: userId,
        CustomSearchId: 0,
        PredefinedSearchId: 0,
                FilterText: searchText,
        Start: 0,
        Limit: parseInt(itemsPerPage)
      },
      BroadcastName: ""
    };
    try {
      const response = await getLeadList(payload);
      setLeads(response.Details.data);
      if (response.Details.data && response.Details.data.length > 0) {
        setSelectedLead(response.Details.data[0].LeadID);
      }
    } catch (error) {
      console.error('search error:', error);
    }
  };
const searchLeadText = async () => {
        setLeads([]);
        setStartIndex(0);
        const payload = {
            Token: TokenId,
            Message: "",
            LoggedUserId: userId,
            MAC_Address: "",
            IP_Address: "102.16.32.189",
            Details: {
                UserId: userId,
                CustomSearchId: 0,
                PredefinedSearchId: 0,
                FilterText: searchText,
                Start: 0,
                Limit: parseInt(itemsPerPage)
            },
            BroadcastName: ""
        };
        try {
            const response = await getLeadList(payload);
            const data = response.Details?.data || [];
            setLeads(data);
            if (data.length > 0) {
                const first = data[0];
                setSelectedLead(first.LeadId || first.id || null);
                // optionally fetch activities for the first result
                try {
                    const actResp = await getLeadActivities({ LeadID: first.LeadId || first.id, Start: 0, Limit: 10 });
                    setActivities(actResp?.d || []);
                } catch (err) {
                    console.error('searchLeadText - getLeadActivities error:', err);
                    setActivities([]);
                }
            }
        } catch (error) {
            console.error('search error:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-700';
            case 'Call-Back': return 'bg-yellow-100 text-yellow-700';
            case 'Closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (viewMode === 'list') {
        return <LeadDetail leads={leads} activities={activities} onSelectLead={handleSelectLead} currentPage={currentPage} onPageChange={handlePageChange} />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar - Lead List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { setCurrentPage(1); setStartIndex(0); searchLeadText(); } }}
                            placeholder="Search leads..."
                            className="w-full pl-9 pr-20 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => { setCurrentPage(1); setStartIndex(0); searchLeadText(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                            Search
                        </button>
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

                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {leads.map(lead => (
                        <div
                            key={lead.Id || lead.id}
                            onClick={() => handleSelectLead(lead)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedLead === lead.ID ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                    {/* {lead.avatar} */}
                                    <img
                src={lead.Image}
                alt={lead.PersonName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://docs.kit19.com/default/person.png';
                }}
              />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-medium text-gray-900 text-sm truncate">{lead.PersonName || lead.name}</h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{lead.CreatedOn || lead.date}</span>
                                    </div>
                                        <p className="text-xs text-gray-600 mb-2">{lead.MobileNo || lead.phone}</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.FollowupStatus || lead.status)}`}>
                                            {lead.Status || lead.status}
                                        </span>
                                </div>
                            </div>
                        </div>
                    ))}
                                        <div className="p-4 border-t border-gray-200 flex justify-center">
                                                <PremiumButton
                                                        onClick={handleLoadMore}
                                                        disabled={isLoading}
                                                >
                                                        Load More
                                                </PremiumButton>
                                        </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-2">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
                                    {currentLead?.avatar}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentLead?.PersonName}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-4 w-4" />
                                            <span>{currentLead?.MobileNo}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            <span>{currentLead?.EmailId}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(currentLead?.status)}`}>
                                    {currentLead?.FollowupStatus}
                                </span>
                                <p className="text-xs text-gray-500 mt-2">Created: {currentLead?.CreatedOn}, 10:30 AM</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Lead Information Card */}
                        <div className="col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.MobileNo}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.Email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Lead ID</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">LD-2024-{currentLead && (currentLead.LeadNo || currentLead.id) ? String(currentLead.LeadNo || currentLead.id).padStart(4, '0') : ''}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wide">Created Date</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.CreatedOn}</p>
                                        </div>
                                        {showMoreDetails && (
                                            <>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">City</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.City}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">State</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.State}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Pincode</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.PinCode}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Source</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">{currentLead?.SourceName}</p>
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
                                                <Phone className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{activity.Action || activity.action || activity}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    by {activity.UserName || activity.user || ''} • {activity.CreatedDate || activity.time || ''}
                                                </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Action Panel */}
                        <div className="col-span-1 space-y-6">
                            {/* Contact Options */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Options</h3>
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
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lead;