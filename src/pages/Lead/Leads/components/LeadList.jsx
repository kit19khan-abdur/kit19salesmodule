import React, { useState, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, RefreshCw, Download, Upload, Filter, MoreVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PremiumButton from '../../../Enquiries/Enquiries/components/PremiumButton';
import FollowupTooltip from './FollowupTooltip';
import { BsTelephonePlus } from "react-icons/bs";
import PopUpModal from '../../../../components/common/Modal';
import ScheduleCallForm from './ScheduleCallForm';
import Button from '../../../../components/common/Button';
import ImportData from '../../../../components/ImportData/ImportData';
import AddFollowupForm from '../../../Enquiries/Forms/AddFollowupForm';
import SendSMS from '../../../../components/LeadMass/SendSMS';
import SendMail from '../../../../components/LeadMass/SendMail';
import VoiceBroadCast from '../../../../components/LeadMass/VoiceBroadCast';
import UpdateForm from '../../../../components/LeadMass/UpdateForm';
import AddTaskForm from '../../../../components/LeadMass/AddTaskForm';
import AddAppointmentForm from '../../../../components/LeadMass/AddAppointmentForm';
import MarkettingSequence from '../../../../components/LeadMass/MarkettingSequence';
import SendInternationalSMS from '../../../../components/LeadMass/SendInternationalSMS';
import AddRemoveTag from '../../../../components/LeadMass/AddRemoveTag';
import AddCallList from '../../../../components/LeadMass/AddCallList';
import Modal from '../../../../components/common/Modal';

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
  const [selectAllLeads, setSelectAllLeads] = useState(false);
  const toolbarMenuRef = useRef(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreActionsRef = useRef(null);
  const columnSearchRef = useRef(null);
  const totalPages = Math.ceil(totalRecord / parseInt(itemsPerPage));
  const scrollContainerRef = useRef(null);
  const [isImportDataModal, setIsImportDataModal] = useState(false);

  // ---------------------------------------Mass Operation-----------------------------------
  const [isMassAddFollowupModal, setIsMassAddFollowupModal] = useState(false);
  const [isMassSendSMS, setIsMassSendSMS] = useState(false);
  const [isMassSendMail, setIsMassSendMail] = useState(false);
  const [isMassSendVoiceBroadCast, setIsMassSendVoiceBroadCast] = useState(false);
  const [isMassUpdateLead, setIsMassUpdateLead] = useState(false);
  const [isMassAddTask, setIsMassAddTask] = useState(false);
  const [isMassAddAppointment, setIsMassAddAppointment] = useState(false);
  const [isMassMsrketingSequence, setIsMassMarketingSequence] = useState(false);
  const [isSendInternationalSMS, setIsSendInternationalSMS] = useState(false);
  const [isMassAddTag, setIsMassAddTag] = useState(false);
  const [isAddTag, setIsAddTag] = useState(false);
  const [isMassAddCallList, setIsMassAddCallList] = useState(false);
  const [isDeleteMassConfirmModal, setDeleteMassConfirmModal] = useState({ show: false, leadId: null });

  // ---------------------------------------End Mass Operation-------------------------------

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
      setSelectAllLeads(false); // Uncheck "Apply on All" when selecting current page
    } else {
      setSelectedLeads([]);
      setSelectAllLeads(false);
    }
  };

  const handleSelectAllLeads = (e) => {
    if (e.target.checked) {
      setSelectAllLeads(true);
      // Select all on current page as well
      setSelectedLeads(leads.map(lead => lead.ID));
    } else {
      setSelectAllLeads(false);
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
            <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1.5 text-sm text-gray-700 flex items-center gap-2">
              {selectAllLeads ? (
                <span className="font-semibold">All {totalRecord} leads selected</span>
              ) : (
                <span>{selectedLeads.length} of {totalRecord} {selectedLeads.length === 1 ? 'lead' : 'leads'} selected</span>
              )}
            </div>
            {/* Show "Apply on all" checkbox when current page is fully selected and there are more records */}
            {selectedLeads.length === leads.length && totalRecord > leads.length && (
              <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-1.5 text-sm text-gray-700 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAllLeads}
                  onChange={handleSelectAllLeads}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label 
                  className="cursor-pointer select-none text-xs"
                  onClick={() => handleSelectAllLeads({ target: { checked: !selectAllLeads } })}
                >
                  Apply on all <span className="font-semibold">{totalRecord}</span> leads
                </label>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedLeads([]);
                setSelectAllLeads(false);
              }}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50 transition"
            >
              Clear
            </button>
            <button
              onClick={() => setIsMassAddFollowupModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              AssignTo
            </button>
            <button
              onClick={() => setIsMassSendSMS(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Send SMS
            </button>
            <button
              onClick={() => setIsMassSendMail(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Send Mail
            </button>
            <button
              onClick={() => setIsMassSendVoiceBroadCast(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Voice Broadcast
            </button>
            <button
              onClick={() => setIsMassUpdateLead(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Update
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
                      onClick={() => { setIsMassAddTask(true); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => { setIsMassAddAppointment(true); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Appointment
                    </button>
                    <button
                      onClick={() => { setIsMassMarketingSequence(true); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Marketting Sequence
                    </button>
                    <button
                      onClick={() => { setIsSendInternationalSMS(true); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Send International SMS
                    </button>
                    <button
                      onClick={() => { setIsMassAddTag(true); setIsAddTag(true); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Tag
                    </button>
                    <button
                      onClick={() => { setIsMassAddTag(true); setIsAddTag(false); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Remove Tag
                    </button>
                    <button
                      onClick={() => { setIsMassAddCallList(true); setShowMoreActions(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Call List
                    </button>
                    <button
                      onClick={() => setDeleteMassConfirmModal({ show: true, leadId: null })}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Delete
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
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getBadgeColor(lead.FollowupCount)} border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:brightness-110 transition-all shadow-md`}>
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
                  {/* {console.log(`lead`, lead)} */}
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


      {/* ------------------------------------------------Mass Operation Modal---------------------- */}

      <PopUpModal
        isOpen={isMassAddFollowupModal}
        onClose={() => setIsMassAddFollowupModal(false)}
        title="Add AssignTo"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassAddFollowupModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddFollowupForm selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassSendSMS}
        onClose={() => setIsMassSendSMS(false)}
        title="Send SMS"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassSendSMS(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <SendSMS selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassSendMail}
        onClose={() => setIsMassSendMail(false)}
        title="Send Mail"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassSendMail(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <SendMail selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassSendVoiceBroadCast}
        onClose={() => setIsMassSendVoiceBroadCast(false)}
        title="Send Voice BroadCast"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassSendVoiceBroadCast(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <VoiceBroadCast selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassUpdateLead}
        onClose={() => setIsMassUpdateLead(false)}
        title="Mass Update Lead"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassUpdateLead(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <UpdateForm selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassAddTask}
        onClose={() => setIsMassAddTask(false)}
        title="Mass Add Task"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassAddTask(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddTaskForm selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassAddAppointment}
        onClose={() => setIsMassAddAppointment(false)}
        title="Mass Add Appointment"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassAddAppointment(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddAppointmentForm selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassMsrketingSequence}
        onClose={() => setIsMassMarketingSequence(false)}
        title="Mass Marketing Sequence"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassMarketingSequence(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <MarkettingSequence selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isSendInternationalSMS}
        onClose={() => setIsSendInternationalSMS(false)}
        title="Send International SMS"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsSendInternationalSMS(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <SendInternationalSMS />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassAddTag}
        onClose={() => setIsMassAddTag(false)}
        title={isAddTag ? "Mass Add Tag" : "Mass Remove Tag"}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassAddTag(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddRemoveTag mode={isAddTag ? 'add' : 'remove'} selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <PopUpModal
        isOpen={isMassAddCallList}
        onClose={() => setIsMassAddCallList(false)}
        title="Mass Add Call List"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsMassAddCallList(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={() => { }}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddCallList selectedCount={selectedLeads?.length + 1} />
      </PopUpModal>

      <Modal
        isOpen={isDeleteMassConfirmModal.show}
        onClose={() => setDeleteMassConfirmModal({ show: false, leadId: null })}
        title="Mass Delete Lead"
        size="sm"
        showCloseButton={false}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteMassConfirmModal({ show: false, leadId: null })}
            >
              No
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeleteMassConfirmModal({ show: false, leadId: null });
              }}
            >
              Yes
            </Button>
          </>
        }
      >
        <p className="text-gray-700">
          You are about to perform a mass delete action on <strong>{selectedLeads?.length + 1}</strong> selected record(s).
        </p>
      </Modal>

      {/* ------------------------------------------------End Mass Operation Modal---------------------- */}

    </div>
  );
};

export default LeadList;
