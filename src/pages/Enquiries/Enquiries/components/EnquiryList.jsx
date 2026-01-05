import React, { useState } from 'react';
import { Search, RefreshCw, Filter, MoreVertical, Table, LayoutGrid, Upload, Download, List } from 'lucide-react';
import PremiumButton from './PremiumButton';
import CapSuleButton from '../../../../components/CapSuleButton';
import PopUpModal from '../../../../components/PopUpModal/PopUpModal';
import Button from '../../../../components/common/Button';
import ImportData from '../../../../components/ImportData/ImportData';


const EnquiryList = ({
  enquiries,
  selectedLead,
  onSelectEnquiry,
  searchText,
  onSearchChange,
  onSearch,
  viewMode,
  setViewMode,
  isCollapsed,
  hasMore,
  onLoadMore,
  isLoading,
  totalRecord,
  showToolbarMenu,
  setShowToolbarMenu,
  toolbarMenuRef,
  sortOrder,
  setSortOrder,
  itemsPerPage,
  setItemsPerPage
}) => {
  const [isImportDataModal, setIsImportDataModal] = useState(false);

  const handleCancelImportDataModal = () => {
    setIsImportDataModal(false);
  }

  const handleImportData = (data) => {
    console.log('Import data:', data);
    alert('Data imported successfully!');
    setIsImportDataModal(false);
  }

 
  if (isCollapsed) return null;

  const statusColors = {
    'Hot Lead': 'bg-red-100 text-red-700',
    'Lead': 'bg-gray-600 text-white',
    'Open': 'bg-green-100 text-green-700'
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 w-80`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Enquiries</h2>
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {enquiries.length} of {totalRecord}
          </span>
        </div>

        {/* Search and Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={onSearch}
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="w-full pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 transition ${viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* More Menu */}
          <div className="relative" ref={toolbarMenuRef}>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="More"
              onClick={() => setShowToolbarMenu(!showToolbarMenu)}
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showToolbarMenu && (
              <div className="absolute right-4 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {/* Items Per Page */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Items Per Page</label>
                  <select
                    className="w-full mt-1.5 px-2 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(e.target.value)}
                  >
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                  onClick={() => {
                    window.location.reload();
                    setShowToolbarMenu(false);
                  }}
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                  <span>Refresh</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                  onClick={() => setShowToolbarMenu(false)}
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span>Filter</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                  onClick={() => {
                    setShowToolbarMenu(false);
                    setIsImportDataModal(true);
                  }}

                >
                  <Upload className="w-4 h-4 text-gray-600" />
                  <span>Import</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700 border-t border-gray-100"
                  onClick={() => setShowToolbarMenu(false)}
                >
                  <Download className="w-4 h-4 text-gray-600" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry List */}
      <div className="flex-1 overflow-y-auto">
        {enquiries.map((enquiry) => (
          <div
            key={enquiry.EnquiryId}
            onClick={() => onSelectEnquiry(enquiry)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition ${selectedLead === enquiry.EnquiryId
              ? 'bg-blue-50 border-l-4 border-l-blue-500'
              : 'hover:bg-gray-50'
              }`}
          >
            <div className="flex items-start gap-3">
              <img
                src={enquiry.Image}
                alt={enquiry.PersonName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://docs.kit19.com/default/person.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-800 truncate">{enquiry.PersonName}</h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {new Date(enquiry.CreatedDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">{enquiry.CsvMobileNo}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${enquiry.IsOpen ? statusColors['Open'] : statusColors['Lead']
                    }`}
                >
                  {enquiry.IsOpen ? 'Open' : 'Lead'}
                </span>
              </div>
            </div>
          </div>
        ))}


        {hasMore && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>Load More</>
              )}
            </button>
          </div>
        )}
      </div>
      <PopUpModal
        isOpen={isImportDataModal}
        onClose={handleCancelImportDataModal}
        title="Import Data"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={handleCancelImportDataModal}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleImportData}
            >
              Upload
            </Button>
          </div>
        }
      >
        <ImportData onClose={handleCancelImportDataModal} onSubmit={handleImportData} />
      </PopUpModal>


    </div>
  );
};

export default EnquiryList;
