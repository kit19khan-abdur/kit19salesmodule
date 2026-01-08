import React, { useState } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import PremiumButton from '../../../Enquiries/Enquiries/components/PremiumButton';
import FollowupTooltip from './FollowupTooltip';
import { BsTelephonePlus } from "react-icons/bs";
import PopUpModal from '../../../../components/common/Modal';
import ScheduleCallForm from './ScheduleCallForm';

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

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleLead, setScheduleLead] = useState(null);

  const getStatusColor = (lead) => {
    if (lead.IsOpen) return 'bg-green-100 text-green-700';
    return 'bg-gray-600 text-white';
  };

  const getBadgeColor = (count) => {
    const num = count || 0;
    if (num === 0) return 'bg-gray-400';
    if (num === 1) return 'bg-green-400';
    if (num === 2) return 'bg-green-500';
    if (num === 3) return 'bg-lime-500';
    if (num === 4) return 'bg-yellow-400';
    if (num === 5) return 'bg-yellow-500';
    if (num === 6) return 'bg-orange-400';
    if (num === 7) return 'bg-orange-500';
    if (num === 8) return 'bg-red-400';
    if (num === 9) return 'bg-red-500';
    if (num >= 10) return 'bg-red-600';
    return 'bg-blue-500';
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
      <div className="flex-1 overflow-y-auto overflow-x-visible">
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
              key={lead.ID}
              onClick={() => onSelectLead(lead)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                selectedLead === lead.ID
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {getInitials(lead.PersonName)}
                  </div>
                  {/* Followup Count Badge with Tooltip */}
                  <FollowupTooltip lead={lead}>
                    <div className={`absolute z-50 -bottom-1 -right-1 w-6 h-6 ${getBadgeColor(lead.FollowupCount)} border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:brightness-110 transition-all shadow-md`}>
                      {lead.FollowupCount || 0}
                    </div>
                  </FollowupTooltip>

                  {/* Call icon overlay next to avatar - stops propagation so it doesn't select the lead */}
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setScheduleLead(lead);
                          setShowScheduleModal(true);
                        }}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600 shadow-sm"
                        title="Call"
                      >
                        <BsTelephonePlus size={14} />
                      </button>
                    </>
                  
                    {showScheduleModal && (
                      <PopUpModal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Call">
                        <ScheduleCallForm
                          lead={scheduleLead}
                          onCancel={() => setShowScheduleModal(false)}
                          onSave={(data) => {
                            console.debug('scheduled call', data, 'for', scheduleLead);
                            setShowScheduleModal(false);
                          }}
                        />
                      </PopUpModal>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {lead.PersonName}
                    </h3>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {lead.CreatedOn?.split(',')[0] || ''}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{lead.MobileNo}</p>
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
