import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LeadDetails from './LeadDetails';
import LeadList from './components/LeadList';
import LeadTable from './components/LeadTable';
import LeadDetailPanel from './components/LeadDetailPanel';
import { getLeadList, getLeadActivities, getLeadDetailList } from '../../../utils/lead';
import { getSession } from '../../../getSession';
import nodata from '../../../assets/nodata.gif';

const Leads = () => {
  const [selectedLead, setSelectedLead] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [leads, setLeads] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const { userId, TokenId, parentId} = getSession();
  const [selectedLeadData, setSelectedLeadData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showToolbarMenu, setShowToolbarMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState('Default Sort');
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toolbarMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarMenuRef.current && !toolbarMenuRef.current.contains(event.target)) {
        setShowToolbarMenu(false);
      }
    };

    if (showToolbarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolbarMenu]);

  // Fetch leads function - you'll need to implement the API call
  const fetchLeads = async (loadMore = false, page = 1) => {
    setIsLoading(true);
    setLeads([])
    const pageNum = page || currentPage || 1;
    const limit = parseInt(itemsPerPage) || 20;
    const startNo = loadMore ? startIndex : (pageNum - 1) * limit;
    const endNo = startNo + limit - 1;

    const details = {
      draw: pageNum,
      StartNo: startNo,
      EndNo: endNo,
      UserId: userId || '',
      SearchName: searchText || '',
      ParentId: parentId || '',
      OrderStr: '',
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
      const response = await getLeadDetailList(payload);
      // The API returns an objResponseStatusEntity where Details is a DataTableResponse
      const table = response?.Details ?? {};
      const rows = Array.isArray(table?.data) ? table.data : [];
      setTotalRecord(table?.recordsFiltered || table?.recordsTotal || rows.length);

      if (loadMore) {
        setLeads(prev => [...prev, ...rows]);
      } else {
        setLeads(rows);
        if (rows && rows.length > 0 && !selectedLeadData) {
          const first = rows[0];
          setSelectedLead(first.LeadId || first.Id || first.id || first.leadId || null);
          setSelectedLeadData(first);
        }
      }
    } catch (error) {
      console.error('fetchLeads error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(false, currentPage);
  }, [currentPage, itemsPerPage]);

  const handleLoadMore = () => {
    const newStart = startIndex + parseInt(itemsPerPage);
    setStartIndex(newStart);
    fetchLeads(true);
  };

  const handleSearch = () => {
    fetchLeads();
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead.id);
    setSelectedLeadData(lead);
    setShowDetailPanel(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      {!isLeftCollapsed && viewMode === 'card' && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <LeadList
            leads={leads}
            selectedLead={selectedLead}
            onSelectLead={handleSelectLead}
            searchText={searchText}
            onSearchChange={setSearchText}
            onSearch={handleSearch}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            hasMore={leads.length < totalRecord}
            viewMode={viewMode}
            setViewMode={setViewMode}
            itemsPerPage={itemsPerPage}
            totalRecord={totalRecord}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}

      {/* Collapse/Expand Button for Left Sidebar */}
      {viewMode === 'card' && (
        <button
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          className="fixed text-gray-600 rounded-[4px] shadow-2xl hover:bg-gray-200 transition z-[9999]"
          style={{
            left: isLeftCollapsed ? '60px' : '363px',
            top: '10%',
            transform: 'translateY(-50%)',
            padding: '2px'
          }}
          title={isLeftCollapsed ? "Expand Leads List" : "Collapse Leads List"}
        >
          {isLeftCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {viewMode === 'table' ? (
          <LeadTable
            leads={leads}
            selectedLead={selectedLead}
            onSelectLead={handleSelectLead}
            searchText={searchText}
            onSearchChange={setSearchText}
            onSearch={handleSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalRecord={totalRecord}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setLeads={setLeads}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        ) : (
          <>
            {selectedLeadData ? (
              <LeadDetails
                lead={selectedLeadData}
                isLeftCollapsed={isLeftCollapsed}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <img src={nodata} alt="No data" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Detail Panel */}
      {/* {showDetailPanel && viewMode === 'table' && (
        <div className="w-96 bg-white border-l border-gray-200">
          <LeadDetailPanel
            lead={selectedLeadData}
            onClose={() => setShowDetailPanel(false)}
          />
        </div>
      )} */}
    </div>
  );
};

export default Leads;
