import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import PremiumButton from '../../../Enquiries/Enquiries/components/PremiumButton';

const LeadList = ({
  leads,
  selectedLead,
  onSelectLead,
  searchText,
  onSearchChange,
  onSearch,
  isLoading,
  hasMore,
  onLoadMore,
  viewMode,
  setViewMode
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (lead) => {
    if (lead.IsOpen) return 'bg-green-100 text-green-700';
    return 'bg-gray-600 text-white';
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Leads</h2>
          <div className="flex items-center gap-2">
            {/* Compact View Toggle */}
            <div className="ml-2">
              <div className="inline-flex gap-1 items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded-md transition-flex ${viewMode === 'card' ? 'bg-[#dbeafe] text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                  title="Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-flex ${viewMode === 'table' ? 'bg-[#dbeafe] text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="w-full pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer"
            onClick={onSearch}
          />
        </div>
      </div>

      {/* Lead List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && leads.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">No leads found</div>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                selectedLead === lead.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {getInitials(lead.PersonName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {lead.PersonName}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {lead.CreatedDate?.split(',')[0] || ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{lead.CsvMobileNo}</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead)}`}
                  >
                    {lead.IsOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <PremiumButton onClick={onLoadMore} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load More'}
            </PremiumButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadList;
