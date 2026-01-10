import React, { useState, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, RefreshCw, Download, Upload, Filter, MoreVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PremiumButton from '../../../Enquiries/Enquiries/components/PremiumButton';
import FollowupTooltip from './FollowupTooltip';
import { BsTelephonePlus } from "react-icons/bs";
import PopUpModal from '../../../../components/common/Modal';
import ScheduleCallForm from './ScheduleCallForm';
import Button from '../../../../components/common/Button';
import ImportData from '../../../../components/ImportData/ImportData';

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
  setViewMode,
  totalRecord,
  itemsPerPage,
  setItemsPerPage
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleLead, setScheduleLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showToolbarMenu, setShowToolbarMenu] = useState(false);
  const toolbarMenuRef = useRef(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreActionsRef = useRef(null);
  const columnSearchRef = useRef(null);
  const totalPages = Math.ceil(totalRecord / parseInt(itemsPerPage));
  const scrollContainerRef = useRef(null);
  const [isImportDataModal, setIsImportDataModal] = useState(false);

  const getStatusColor = (lead) => {
    return 'bg-green-100 text-green-700';
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(leads.map(lead => lead.ID));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  // Infinite scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Trigger load more when scrolled to within 100px of bottom
      if (scrollHeight - scrollTop - clientHeight < 100 && hasMore && !isLoading) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarMenuRef.current && !toolbarMenuRef.current.contains(event.target)) {
        setShowToolbarMenu(false);
      }
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setShowMoreActions(false);
      }
    };

    if (showMoreActions || showToolbarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showToolbarMenu, showMoreActions]);

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        {/* Search */}
        <div className="flex justify-between">
          <p className='font-[600]'>Leads</p>
          <div className="relative mb-3">
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
        <div className="flex justify-between items-center">
          {/* <h2 className="text-lg font-semibold text-gray-800">Leads</h2> */}
          {viewMode === 'card' && (
            <input
              type="checkbox"
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              title="Select All"
            />
          )}
          <div className="flex items-center gap-2">
            {/* Select All Checkbox */}
            {/* Compact View Toggle */}
            <div className="ml-2 flex items-center">
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
              <div className="relative flex" ref={toolbarMenuRef}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                  onClick={() => {
                    window.location.reload();
                    setShowToolbarMenu(false);
                  }}
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded transition"
                  title="More Options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowToolbarMenu(!showToolbarMenu);
                  }}
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {showToolbarMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {/* Items Per Page */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Items Per Page</label>
                      <select
                        className="w-full mt-1.5 px-2 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(e.target.value);
                          setShowToolbarMenu(false);
                        }}
                      >
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                    </div>
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
                        setIsImportDataModal(true);
                        setShowToolbarMenu(false);
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
        </div>

        {/* Mass Operation Buttons */}
        {selectedLeads.length > 0 && (
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-sm text-gray-600">{selectedLeads.length} selected</span>
            <button
              onClick={() => console.log('Add Lead', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Add Lead
            </button>
            <button
              onClick={() => console.log('Send SMS to', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Send SMS
            </button>
            <button
              onClick={() => console.log('Send Mail to', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Send Mail
            </button>
            <button
              onClick={() => console.log('Update', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Update
            </button>
            <button
              onClick={() => console.log('Sequence', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Sequence
            </button>
            <button
              onClick={() => console.log('International SMS', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              InternationalSMS
            </button>
            <button
              onClick={() => console.log('Add Tag', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Add Tag
            </button>
            <button
              onClick={() => console.log('Remove Tag', selectedLeads)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Remove Tag
            </button>
            <div className="relative" ref={moreActionsRef}>
              <button
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="p-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-1"
              >
                More actions
                {showMoreActions ? (<ChevronUp className="w-4 h-4" />) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showMoreActions && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => { console.log('Add Call List', selectedLeads); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Call List
                    </button>
                    <button
                      onClick={() => { console.log('Remove Tag', selectedLeads); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Remove Tag
                    </button>
                    <button
                      onClick={() => { console.log('Add Task', selectedLeads); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => { console.log('Add Appointment', selectedLeads); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lead List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-visible">
        {isLoading && leads.length === 0 ? (
          <div className="p-4 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">No leads found</div>
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.ID}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${selectedLead === lead.ID
                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-50'
                }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox for selection */}
                <input
                  type="checkbox"
                  checked={selectedLeads.includes(lead.ID)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectLead(lead.ID);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    <img src="https://kit19.com/assets/custom/img/img_avatar.png" alt="img" className="w-10 h-10 rounded-full" />
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
                <div className="flex-1 min-w-0" onClick={() => onSelectLead(lead)}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {lead.PersonName}
                    </h3>
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {lead.CreatedOn?.split(',')[0] || ''}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{lead.MobileNo}</p>
                  {console.log(`lead`, lead)}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead)}`}
                  >
                    {lead.FollowupStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Inline Loading Indicator */}
        {isLoading && leads.length > 0 && (
          <div className="p-4 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-600">Loading more...</span>
          </div>
        )}
      </div>
      <PopUpModal
        isOpen={isImportDataModal}
        onClose={() => setIsImportDataModal(false)}
        title="Import Data"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsImportDataModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => console.log('Upload data')}
            >
              Upload
            </Button>
          </div>
        }
      >
        <ImportData onClose={() => setIsImportDataModal(false)} onSubmit={() => console.log('Submit data')} />
      </PopUpModal>
    </div>
  );
};

export default LeadList;
