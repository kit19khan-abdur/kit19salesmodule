import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LeadDetails from './LeadDetails';
import LeadList from './components/LeadList';
import LeadTable from './components/LeadTable';
import LeadDetailPanel from './components/LeadDetailPanel';
import { getSession } from '../../../getSession';
import nodata from '../../../assets/nodata.gif';

const Leads = () => {
  const [selectedLead, setSelectedLead] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [leads, setLeads] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const { userId, TokenId } = getSession();
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
    const start = loadMore ? startIndex : (page - 1) * parseInt(itemsPerPage);

    // Mock data for now - replace with actual API call
    const mockLeads = [
      { id: 1, PersonName: 'Rajesh Kumar', CsvMobileNo: '+91 98765 43210', CsvEmailId: 'rajesh.kumar@email.com', CreatedDate: '28 Dec 2024, 10:30 AM', Source: 'Website', IsOpen: true, Type: 'Hot Lead', LeadId: 'LD-2024-0001', Image: 'https://docs.kit19.com/default/person.png' },
      { id: 2, PersonName: 'Priya Sharma', CsvMobileNo: '+91 98765 43211', CsvEmailId: 'priya.sharma@email.com', CreatedDate: '27 Dec 2024, 02:15 PM', Source: 'Referral', IsOpen: false, Type: 'Warm Lead', LeadId: 'LD-2024-0002', Image: 'https://docs.kit19.com/default/person.png' },
      { id: 3, PersonName: 'Amit Patel', CsvMobileNo: '+91 98765 43212', CsvEmailId: 'amit.patel@email.com', CreatedDate: '26 Dec 2024, 09:45 AM', Source: '-', IsOpen: false, Type: '-', LeadId: 'LD-2024-0003', Image: 'https://docs.kit19.com/default/person.png' },
    ];

    setTotalRecord(mockLeads.length);

    if (loadMore) {
      setLeads(prev => [...prev, ...mockLeads]);
    } else {
      setLeads(mockLeads);
      if (mockLeads && mockLeads.length > 0 && !selectedLeadData) {
        setSelectedLead(mockLeads[0].id);
        setSelectedLeadData(mockLeads[0]);
      }
    }

    setIsLoading(false);
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
      {showDetailPanel && viewMode === 'table' && (
        <div className="w-96 bg-white border-l border-gray-200">
          <LeadDetailPanel
            lead={selectedLeadData}
            onClose={() => setShowDetailPanel(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Leads;
