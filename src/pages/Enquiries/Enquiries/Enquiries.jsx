import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EnquiryDetails from './EnquiryDetails';
import EnquiryList from './components/EnquiryList';
import EnquiryTable from './components/EnquiryTable';
import EnquiryDetailPanel from './components/EnquiryDetailPanel';
import { getEnquiryList, getEnquiryActivities, getEnquiryList_WithPredefinedAndCustomFilter } from '../../../utils/enquiry';
import { getSession } from '../../../getSession';
import nodata from '../../../assets/nodata.gif';
import ReadExcelOnEnquiryPage from './ReadExcel';

const Enquiries = () => {
  const [selectedLead, setSelectedLead] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [enquiries, setEnquiries] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState('20');
  const { userId, TokenId } = getSession();
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [filterExpSQLClause, setFilterExpSQLClause] = useState('');
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

  const fecthEnquiry = async (loadMore = false, page = 1) => {
    setIsLoading(true);
    // Calculate Start index: (page - 1) * itemsPerPage
    const start = loadMore ? startIndex : (page - 1) * parseInt(itemsPerPage, 10);
    
    // Determine whether a filter/search is applied
    const isFilterApplied = (searchText && String(searchText).trim().length > 0) || 
                            (filterExp && String(filterExp).trim().length > 0) ||
                            (filterExpSQLClause && String(filterExpSQLClause).trim().length > 0);
    
    // Build Details object conditionally
    const details = isFilterApplied
      ? {
          UserId: userId,
          CustomSearchId: 0,
          PredefinedSearchId: 0,
          FilterText: searchText || '',
          FilterExp: filterExpSQLClause || '', //filterExp || '',
          Ordstr: '',
          OffsetValue: start,
          SortOrder: 'desc',
          PageSize: parseInt(itemsPerPage, 10),
          IsFilter: true,
        }
      : {
          UserId: userId,
          CustomSearchId: 0,
          PredefinedSearchId: 0,
          FilterText: '',
          Start: start,
          Limit: parseInt(itemsPerPage, 10),
          IsFilter: false,
        };

    const payload = {
      Token: TokenId,
      Message: '',
      LoggedUserId: userId,
      MAC_Address: '',
      IP_Address: '102.16.32.189',
      Details: details,
      BroadcastName: '',
    };

    /*
     	exec usp_mob_GetEnquiryListNewLatest @UserId=43422,
       @CustomSearchId=0, @PredefindSearchId=0,
       @FilterText=N'', @FilterExp=N'', @Ordstr=N''
      ,@OffsetValue=0, @SortOrder=N'desc', @PageSize=100
    */

      //debugger;

    try {
      // Choose API based on whether a filter/search is applied
      let response;
      
        //setStartIndex(0);
        //setCurrentPage(1);
       // handlePageChange(1);      


      if (isFilterApplied) {
        // Switch to table view when filter is applied (before fetching data)
        setViewMode('table');
        setShowDetailPanel(false);
        // setStartIndex(0);
        // setCurrentPage(1);
        // //handlePageChange(1);  
        response = await getEnquiryList_WithPredefinedAndCustomFilter(payload);
      
      } else {
        response = await getEnquiryList(payload);
      }
      //onPageChange(1);
        
      // Normalize and use the response
      const details = response?.Details || { totalRecords: 0, data: [] };
      setTotalRecord(details.totalRecords);

      if (loadMore) {
        setEnquiries(prev => [...prev, ...details.data]);
      } else {
        setEnquiries(details.data);
        if (details.data && details.data.length > 0 && !selectedEnquiry) {
          setSelectedLead(details.data[0].EnquiryId);
          setSelectedEnquiry(details.data[0]);
        }
      }
    } catch (error)
    {
      console.error(error);
                // onPageChange(1); // Removed, use setCurrentPage(1) above
               // onPageChange
             //  handlePageChange(1);
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const newStart = startIndex + parseInt(itemsPerPage);
    setStartIndex(newStart);
    fecthEnquiry(true);
  };

  const handleSelectEnquiry = async (enquiry) => {
    setSelectedLead(enquiry.EnquiryId);
    setSelectedEnquiry(enquiry);
    if (viewMode === 'table') {
      setShowDetailPanel(false);
    }

    // Fetch activities for the selected enquiry
    try {
      const payload = {
        EnquiryID: enquiry.EnquiryId,
        Start: 0,
        Limit: 10
      };
      const response = await getEnquiryActivities(payload);
      setActivities(response?.d || []);
    } catch (error) {
      console.error('fetchActivities error:', error);
      setActivities([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fecthEnquiry(false, page);
  }
  useEffect(() => {
    fecthEnquiry();
  }, []);

  // Fetch data when itemsPerPage changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      fecthEnquiry(false, 1);
    }
  }, [itemsPerPage]);

  const searchTText = async () => {
    setEnquiries([]);
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
      const response = await getEnquiryList(payload);
      setEnquiries(response.Details.data);
      if (response.Details.data && response.Details.data.length > 0) {
        setSelectedLead(response.Details.data[0].EnquiryId);
        setSelectedEnquiry(response.Details.data[0]);
      }
    } catch (error) {
      console.error('search error:', error);
    }
  };

  const hasMore = enquiries.length < totalRecord;

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Card View with Left Sidebar */}
      {viewMode === 'card' && (
        <>
          <EnquiryList
            enquiries={enquiries}
            selectedLead={selectedLead}
            onSelectEnquiry={handleSelectEnquiry}
            searchText={searchText}
            onSearchChange={setSearchText}
            onSearch={searchTText}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isCollapsed={isLeftCollapsed}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            totalRecord={totalRecord}
            showToolbarMenu={showToolbarMenu}
            setShowToolbarMenu={setShowToolbarMenu}
            toolbarMenuRef={toolbarMenuRef}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />

          {/* Toggle Button for Left Sidebar */}
          {!isLeftCollapsed && (
            <button
              onClick={() => setIsLeftCollapsed(true)}
              className="absolute left-[286px] top-[4px] z-10 p-1.5 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {isLeftCollapsed && (
            <button
              onClick={() => setIsLeftCollapsed(false)}
              className="absolute left-2 top-4 z-10 p-1.5 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </>
      )}

      {/* Table View */}
      {viewMode === 'table' ? (
        <EnquiryTable
          enquiries={enquiries}
          selectedLead={selectedLead}
          onSelectEnquiry={handleSelectEnquiry}
          searchText={searchText}
          onSearchChange={setSearchText}
          onSearch={searchTText}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalRecord={totalRecord}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setEnquiries={setEnquiries}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          fecthEnquiry={fecthEnquiry}
          setFilterExp={setFilterExp}
          setFilterExpSQLClause={setFilterExpSQLClause}
        />
      ) : (
        /* Card View - Main Content */
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isLeftCollapsed ? 'ml-0' : ''}`}>
                 

          {selectedEnquiry ? (
            <EnquiryDetails
              enquiry={selectedEnquiry}
              isLeftCollapsed={isLeftCollapsed}
              onMerged={() => fecthEnquiry(false, currentPage)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#ffffff]">
              <img src={nodata} alt="nodata" />
            </div>
          )}
        </div>
      )}

      {/* Slide-out Detail Panel for Table View */}
      {showDetailPanel && viewMode === 'table' && (
        <EnquiryDetailPanel
          enquiry={selectedEnquiry}
          onClose={() => setShowDetailPanel(false)}
          activities={activities}
        />
      )}
    </div>
  );
}
export default Enquiries;
