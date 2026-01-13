import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Search, Phone, Mail, FileText, LayoutGrid,
    List, RefreshCw, MoreVertical, ChevronLeft, ChevronRight,
    MessageSquare, Trash2, MessageSquareMore, ChevronDown, Spotlight,
    NotebookPen, CloudUpload, Filter, Upload, Download, ChevronUp,
    ArrowUp, ArrowDown, Pin
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { TfiLayoutColumn3 } from 'react-icons/tfi';
import RowActionMenu from '../../../../components/RowActionMenu';
import LeadDetailsDrawer from './LeadDetailsDrawer';
import FollowupTooltip from './FollowupTooltip';
import nodata from '../../../../assets/nodata.gif';
import { BsTelephonePlus } from "react-icons/bs";
import PopUpModal from '../../../../components/common/Modal';
import ScheduleCallForm from './ScheduleCallForm';
import ImportData from '../../../../components/ImportData/ImportData';
import Button from '../../../../components/common/Button';
import ColumnHeaderMenu from '../../../Enquiries/Enquiries/components/ColumnHeaderMenu';
import CreateMeetingForm from '../../../../components/LeadForm/CreateMeetingForm';
import AddAppointment from '../../../../components/LeadForm/AddAppointment';
import AddPhysicalAppointmentForm from '../../../../components/LeadForm/AddPhysicalAppointmentForm';
import SendVoiceForm from '../../../../components/LeadForm/SendVoiceForm';
import AddNotes from '../../../../components/LeadForm/AddNotes';
import UploadData from '../../../../components/LeadForm/UploadData';
import AddTask from '../../../../components/LeadForm/AddTask';
import AddDeal from '../../../../components/LeadForm/AddDeal';
import WebForm from '../../../../components/LeadForm/WebForm';
import EditLeadForm from '../../../../components/LeadForm/EditLeadForm';
import WhatsAppForm from '../../../../components/LeadForm/WhatsAppForm';
import MailForm from '../../../Enquiries/Forms/MailForm';
import SMSForm from '../../../Enquiries/Forms/SMSForm';
import MergeLead from '../../../../components/LeadForm/MergeLead';
import Modal from '../../../../components/common/Modal';
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

const LeadTable = ({
    leads,
    selectedLead,
    onSelectLead,
    searchText,
    onSearchChange,
    onSearch,
    viewMode,
    setViewMode,
    totalRecord,
    sortOrder,
    setSortOrder,
    itemsPerPage,
    setItemsPerPage,
    setLeads,
    onPageChange,
    currentPage
}) => {
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [rowMenu, setRowMenu] = useState({ show: false, rowId: null });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState(null);
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [showPagePopup, setShowPagePopup] = useState(null);
    const rowMenuAnchorRefs = useRef({});
    const moreActionsRef = useRef(null);
    const ellipsisRefs = useRef([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleLead, setScheduleLead] = useState(null);
    const [showCallWidget, setShowCallWidget] = useState(false);
    const [showCallWidgetMenu, setShowCallWidgetMenu] = useState(false);
    const [callStatus, setCallStatus] = useState('Requesting');
    const [callTimer, setCallTimer] = useState('00:00:00');
    const callIntervalRef = useRef(null);
    const [showToolbarMenu, setShowToolbarMenu] = useState(false);
    const [showColumnSearch, setShowColumnSearch] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        leadDetails: true,
        mobileNo: true,
        emailId: true,
        creationDetails: true,
        source: true,
        LastFollowupedOn: true,
        FollowupStatus: true
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [headerMenu, setHeaderMenu] = useState({ show: false, col: null });
    const [pinnedColumn, setPinnedColumn] = useState(null);
    const headerIconRefs = useRef({}); const [isImportDataModal, setIsImportDataModal] = useState(false);
    const [filters, setFilters] = useState({});
    const toolbarMenuRef = useRef(null);
    const columnSearchRef = useRef(null);
    const totalPages = Math.ceil(totalRecord / parseInt(itemsPerPage));

    // -------------------------------------Modal States-------------------------------------
    const [isAddLeadModal, setIsAddLeadModal] = useState(false);
    const [isCreateMeetingModal, setIsCreateMeetingModal] = useState(false);
    const [isAddPhysicalAppointmentModal, setIsAddPhysicalAppointmentModal] = useState(false);
    const [isAddAppointmentModal, setIsAddAppointmentModal] = useState(false);
    const [isSendVoiceModal, setIsSendVoiceModal] = useState(false);
    const [isAddNotesModal, setIsAddNotesModal] = useState(false);
    const [isUploadDataModal, setIsUploadDataModal] = useState(false);
    const [isAddTaskModal, setIsAddTaskModal] = useState(false);
    const [isAddDealModal, setIsAddDealModal] = useState(false);
    const [isWebFormModal, setIsWebFormModal] = useState(false);
    const [isEditLeadModal, setIsEditLeadModal] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
    const [isMergeLeadOpen, setIsMergeLeadOpen] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, leadId: null });
    // -------------------------------------------Modals Ends----------------------------------


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

    // Debug: log headerMenu changes to trace unexpected opens
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('DEBUG headerMenu ->', headerMenu);
    }, [headerMenu]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

    const sortedLeads = useMemo(() => {
        if (!sortConfig.key) return leads;
        return [...leads].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortConfig.direction === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [leads, sortConfig]);
    const handleSortAsc = (key) => {
        setSortConfig({ key, direction: 'asc' });
        setHeaderMenu({ show: false, col: null });
    };

    const handleSortDesc = (key) => {
        setSortConfig({ key, direction: 'desc' });
        setHeaderMenu({ show: false, col: null });
    };

    const handleHideColumn = (key) => {
        // Prevent hiding required columns
        if (key === 'leadDetails' || key === 'mobileNo') {
            setHeaderMenu({ show: false, col: null });
            return;
        }
        setVisibleColumns(prev => ({ ...prev, [key]: false }));
        setHeaderMenu({ show: false, col: null });
    };

    const handlePinColumn = (key) => {
        // Toggle pin: if already pinned, unpin it
        setPinnedColumn(prev => prev === key ? null : key);
        setHeaderMenu({ show: false, col: null });
    };

    const handleFilterColumn = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleColumnToggle = (columnKey) => {
        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    };

    const handleSelectAll = () => {
        if (selectedLeads.length === leads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(leads.map(l => l.ID));
        }
    };

    const handleSelectLead = (id) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(lid => lid !== id));
        } else {
            setSelectedLeads([...selectedLeads, id]);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const delta = 2; // Number of pages to show around current page

        // If total pages is small, show all
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Always show first page
        pages.push(1);

        // Calculate range around current page
        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

        // Add ellipsis after first page if needed
        if (rangeStart > 2) {
            pages.push('...');
        }

        // Add pages around current page
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (rangeEnd < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    // Helper for all page numbers
    const getAllPageNumbers = () => Array.from({ length: totalPages }, (_, i) => i + 1);

    // Close more actions dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
                setShowMoreActions(false);
            }
            if (toolbarMenuRef.current && !toolbarMenuRef.current.contains(event.target)) {
                setShowToolbarMenu(false);
            }
            if (columnSearchRef.current && !columnSearchRef.current.contains(event.target)) {
                setShowColumnSearch(false);
            }
            // Check page popup
            if (showPagePopup !== null) {
                const popup = document.getElementById('page-popup-box');
                const ellipsis = ellipsisRefs.current[showPagePopup];
                if (
                    popup &&
                    !popup.contains(event.target) &&
                    ellipsis &&
                    !ellipsis.contains(event.target)
                ) {
                    setShowPagePopup(null);
                }
            }
        };

        if (showMoreActions || showPagePopup !== null || showToolbarMenu || showColumnSearch) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showMoreActions, showPagePopup, showToolbarMenu, showColumnSearch]);

    // Call Widget timer effect
    useEffect(() => {
        if (showCallWidget) {
            let seconds = 0;
            setCallTimer('00:00:00');
            if (callIntervalRef.current) {
                clearInterval(callIntervalRef.current);
            }
            callIntervalRef.current = setInterval(() => {
                seconds += 1;
                const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
                const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
                const ss = String(seconds % 60).padStart(2, '0');
                setCallTimer(`${hh}:${mm}:${ss}`);
            }, 1000);
        } else {
            if (callIntervalRef.current) {
                clearInterval(callIntervalRef.current);
                callIntervalRef.current = null;
            }
            setCallTimer('00:00:00');
        }

        return () => {
            if (callIntervalRef.current) {
                clearInterval(callIntervalRef.current);
                callIntervalRef.current = null;
            }
        };
    }, [showCallWidget]);

    // Call Widget timer effect
    useEffect(() => {
        if (showCallWidget) {
            let seconds = 0;
            setCallTimer('00:00:00');
            if (callIntervalRef.current) {
                clearInterval(callIntervalRef.current);
            }
            callIntervalRef.current = setInterval(() => {
                seconds += 1;
                const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
                const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
                const ss = String(seconds % 60).padStart(2, '0');
                setCallTimer(`${hh}:${mm}:${ss}`);
            }, 1000);
        } else {
            if (callIntervalRef.current) {
                clearInterval(callIntervalRef.current);
                callIntervalRef.current = null;
            }
            setCallTimer('00:00:00');
        }

        return () => {
            if (callIntervalRef.current) {
                clearInterval(callIntervalRef.current);
                callIntervalRef.current = null;
            }
        };
    }, [showCallWidget]);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchText}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Toolbar Menu */}
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
                                    {/* <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                                        onClick={() => setShowToolbarMenu(false)}
                                    >
                                        <Filter className="w-4 h-4 text-gray-600" />
                                        <span>Filter</span>
                                    </button> */}
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
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700 border-t border-gray-100"
                                        onClick={() => {
                                            setShowColumnSearch(!showColumnSearch);
                                            setShowToolbarMenu(false);
                                        }}
                                    >
                                        <TfiLayoutColumn3 className="w-4 h-4 text-gray-600" />
                                        <span>Column Search</span>
                                        {Object.values(visibleColumns).filter(v => !v).length > 0 && (
                                            <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                                                {Object.values(visibleColumns).filter(v => !v).length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Column Search Dropdown */}
                            {showColumnSearch && (
                                <div ref={columnSearchRef} className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    {/* Header */}
                                    <div className="bg-blue-500 text-white px-4 py-2.5 font-medium text-sm flex items-center justify-between">
                                        <span>{Object.values(visibleColumns).filter(Boolean).length} items selected</span>
                                        <button className="hover:bg-blue-600 p-1 rounded">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Column Options */}
                                    <div className="py-1">
                                        <button
                                            onClick={() => handleColumnToggle('leadDetails')}
                                            disabled
                                            className="w-full px-4 py-2.5 text-left text-sm text-white bg-blue-400 transition flex items-center justify-between cursor-not-allowed opacity-75"
                                        >
                                            <span>Lead Details</span>
                                            {visibleColumns.leadDetails && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleColumnToggle('mobileNo')}
                                            disabled
                                            className="w-full px-4 py-2.5 text-left text-sm text-white bg-blue-400 transition flex items-center justify-between cursor-not-allowed opacity-75"
                                        >
                                            <span>Mobile No</span>
                                            {visibleColumns.mobileNo && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleColumnToggle('emailId')}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.emailId
                                                ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>Email ID</span>
                                            {visibleColumns.emailId && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleColumnToggle('creationDetails')}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.creationDetails
                                                ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>Creation Details</span>
                                            {visibleColumns.creationDetails && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleColumnToggle('source')}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.source
                                                ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>Source</span>
                                            {visibleColumns.source && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleColumnToggle('FollowupStatus')}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.FollowupStatus
                                                ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>FollowupStatus</span>
                                            {visibleColumns.FollowupStatus && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleColumnToggle('LastFollowupedOn')}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.LastFollowupedOn
                                                ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>LastFollowuped On</span>
                                            {visibleColumns.LastFollowupedOn && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mass Operation Buttons */}
            {selectedLeads.length > 0 && (
                <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMassAddFollowupModal(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            AssignTo
                        </button>
                        <button
                            onClick={() => setIsMassSendSMS(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Send SMS
                        </button>
                        <button
                            onClick={() => setIsMassSendMail(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Send Mail
                        </button>
                        <button
                            onClick={() => setIsMassSendVoiceBroadCast(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Voice Broadcast
                        </button>
                        <button
                            onClick={() => setIsMassUpdateLead(true)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Update
                        </button>

                        {/* More Actions Dropdown */}
                        <div className="relative" ref={moreActionsRef}>
                            <button
                                onClick={() => setShowMoreActions(!showMoreActions)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-1"
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
                                            Marketing Sequence
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
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {selectedLeads.length} of {totalRecord}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedLeads.length} leads selected.
                        </span>
                        <button
                            onClick={() => setDeleteMassConfirmModal({ show: true, leadId: null })}
                            className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
                            title="Delete"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete
                        </button>
                        <button
                            onClick={() => setSelectedLeads([])}
                            className="p-1 hover:bg-gray-100 rounded transition"
                            title="Clear Selection"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Showing Records */}
            <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-start bg-gray-50">
                <div className="text-sm text-gray-600">
                    Showing Records: <strong>All Leads</strong>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                            <th className="px-3 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                    checked={selectedLeads.length === leads.length && leads.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            {visibleColumns.leadDetails && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Lead Details
                                        {pinnedColumn === 'leadDetails' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'PersonName' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span
                                        ref={el => headerIconRefs.current['leadDetails'] = el}
                                        className="inline-block ml-1 align-middle cursor-pointer"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setHeaderMenu(headerMenu.show && headerMenu.col === 'leadDetails'
                                                ? { show: false, col: null }
                                                : { show: true, col: 'leadDetails' });
                                        }}
                                    >
                                        {headerMenu.show && headerMenu.col === 'leadDetails'
                                            ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                                            : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'leadDetails'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['leadDetails'] }}
                                        onSortAsc={() => handleSortAsc('PersonName')}
                                        onSortDesc={() => handleSortDesc('PersonName')}
                                        onPin={() => handlePinColumn('leadDetails')}
                                        onHide={() => handleHideColumn('leadDetails')}
                                        onFilter={(value) => handleFilterColumn('PersonName', value)}
                                        canHide={false}
                                    />
                                </th>
                            )}
                            {visibleColumns.mobileNo && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Mobile No
                                        {pinnedColumn === 'mobileNo' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'MobileNo' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span
                                        ref={el => headerIconRefs.current['mobileNo'] = el}
                                        className="inline-block ml-1 align-middle cursor-pointer"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setHeaderMenu(headerMenu.show && headerMenu.col === 'mobileNo'
                                                ? { show: false, col: null }
                                                : { show: true, col: 'mobileNo' });
                                        }}
                                    >
                                        {headerMenu.show && headerMenu.col === 'mobileNo'
                                            ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                                            : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'mobileNo'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['mobileNo'] }}
                                        onSortAsc={() => handleSortAsc('MobileNo')}
                                        onSortDesc={() => handleSortDesc('MobileNo')}
                                        onPin={() => handlePinColumn('mobileNo')}
                                        onHide={() => handleHideColumn('mobileNo')}
                                        onFilter={(value) => handleFilterColumn('MobileNo', value)}
                                        canHide={true}
                                    />
                                </th>
                            )}
                            {visibleColumns.emailId && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Email ID
                                        {pinnedColumn === 'emailId' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'EmailId' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span
                                        ref={el => headerIconRefs.current['emailId'] = el}
                                        className="inline-block ml-1 align-middle cursor-pointer"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setHeaderMenu(headerMenu.show && headerMenu.col === 'emailId'
                                                ? { show: false, col: null }
                                                : { show: true, col: 'emailId' });
                                        }}
                                    >
                                        {headerMenu.show && headerMenu.col === 'emailId'
                                            ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                                            : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'emailId'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['emailId'] }}
                                        onSortAsc={() => handleSortAsc('EmailId')}
                                        onSortDesc={() => handleSortDesc('EmailId')}
                                        onPin={() => handlePinColumn('emailId')}
                                        onHide={() => handleHideColumn('emailId')}
                                        onFilter={(value) => handleFilterColumn('EmailId', value)}
                                        canHide={true}
                                    />
                                </th>
                            )}
                            {visibleColumns.creationDetails && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    <div className="flex items-center gap-1">
                                        Creation Details
                                        {pinnedColumn === 'creationDetails' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'CreatedDate' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span
                                        ref={el => headerIconRefs.current['creationDetails'] = el}
                                        className="inline-block ml-1 align-middle cursor-pointer"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setHeaderMenu(headerMenu.show && headerMenu.col === 'creationDetails'
                                                ? { show: false, col: null }
                                                : { show: true, col: 'creationDetails' });
                                        }}
                                    >
                                        {headerMenu.show && headerMenu.col === 'creationDetails'
                                            ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                                            : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'creationDetails'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['creationDetails'] }}
                                        onSortAsc={() => handleSortAsc('CreatedDate')}
                                        onSortDesc={() => handleSortDesc('CreatedDate')}
                                        onPin={() => handlePinColumn('creationDetails')}
                                        onHide={() => handleHideColumn('creationDetails')}
                                        onFilter={(value) => handleFilterColumn('CreatedDate', value)}
                                        canHide={true}
                                    />
                                </th>
                            )}
                            {visibleColumns.source && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    Source
                                </th>
                            )}
                            {visibleColumns.FollowupStatus && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    Status
                                </th>
                            )}
                            {visibleColumns.LastFollowupedOn && (
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                    LastFollowuped On
                                </th>
                            )}
                        </tr>
                    </thead>
                    {leads?.length > 0 ? (
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.map((lead) => (
                                <tr
                                    key={lead.ID}
                                    className={`transition hover:bg-gray-50 group ${selectedLead === lead.ID ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                            checked={selectedLeads.includes(lead.ID)}
                                            onChange={() => handleSelectLead(lead.ID)}
                                        />
                                    </td>
                                    {/* {console.log(`leads`, leads)} */}
                                    {visibleColumns.leadDetails && (
                                        <td className="px-4 py-2 relative">
                                            <div className="flex items-center  justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                                                                <img src="https://kit19.com/assets/custom/img/img_avatar.png" alt="img" className="w-10 h-10 rounded-full" />
                                                            </div>
                                                            {/* Followup Count Badge with Tooltip */}
                                                            <FollowupTooltip lead={lead}>
                                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getBadgeColor(lead.FollowupCount)} border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:brightness-110 transition-all shadow-md`}>
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
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span
                                                            className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-blue-600"
                                                            onClick={() => {
                                                                setSelectedLeadForDrawer(lead);
                                                                setIsDrawerOpen(true);
                                                            }}
                                                        >
                                                            {lead.PersonName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span title="Send Email">
                                                        <Mail
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-blue-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsMailModalOpen(true)
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Send WhatsApp">
                                                        <FaWhatsapp
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-green-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsWhatsAppModalOpen(true)
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Send SMS">
                                                        <MessageSquareMore
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-[#d154f4]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsSMSModalOpen(true)
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Add Note">
                                                        <NotebookPen
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-[#4eeba2]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsAddNotesModal(true)
                                                            }}
                                                        />
                                                    </span>
                                                    {/* {console.log(`lead`, lead)} */}
                                                    <span title="Delete">
                                                        <Trash2
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteConfirmModal({ show: true, leadId: lead.ID });
                                                            }}
                                                        />
                                                    </span>
                                                    <span
                                                        id={`row-action-icon-${lead.ID}`}
                                                        ref={el => rowMenuAnchorRefs.current[lead.ID] = el}
                                                        className="cursor-pointer"
                                                        title="More Actions"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setRowMenu(rowMenu.show && rowMenu.rowId === lead.ID ? { show: false, rowId: null } : { show: true, rowId: lead.ID });
                                                        }}
                                                    >
                                                        <MoreVertical className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                                                    </span>
                                                </div>
                                                {/* Row action menu dropdown */}
                                                <RowActionMenu
                                                    show={rowMenu.show && rowMenu.rowId === lead.ID}
                                                    anchorRef={{ current: rowMenuAnchorRefs.current[lead.ID] }}
                                                    onClose={() => setRowMenu({ show: false, rowId: null })}
                                                    menuId={`row-action-menu-${lead.ID}`}
                                                    onAction={action => {
                                                        setRowMenu({ show: false, rowId: null });
                                                        if (action === 'addFollowUp') {
                                                            setIsAddLeadModal(true)
                                                        } else if (action === 'merge') {
                                                            setIsMergeLeadOpen(true)
                                                        } else if (action === 'edit') {
                                                            setIsEditLeadModal(true)
                                                        } else if (action === 'addTask') {
                                                            setIsAddTaskModal(true)
                                                        } else if (action === 'addDeal') {
                                                            setIsAddDealModal(true)
                                                        } else if (action === 'delete') {
                                                            // Handle delete action
                                                        } else if (action === 'physical') {
                                                            setIsAddPhysicalAppointmentModal(true)
                                                        } else if (action === 'sendVoice') {
                                                            setIsSendVoiceModal(true)
                                                        } else if (action === 'uploadDoc') {
                                                            setIsUploadDataModal(true)
                                                        } else if (action === 'appointment') {
                                                            setIsAddAppointmentModal(true)
                                                        } else if (action === 'meeting') {
                                                            setIsCreateMeetingModal(true)
                                                        } else if (action === 'webform') {
                                                            setIsWebFormModal(true)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {/* {console.log(`leads`, lead)} */}
                                    {visibleColumns.mobileNo && (
                                        <td className="px-4 py-2">
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowCallWidget(true);
                                                    setCallStatus('Requesting');
                                                    setCallTimer('00:00:00');
                                                }}
                                                className="flex cursor-pointer hover:text-[#088b7e] items-center gap-1 text-blue-600 font-medium"
                                            >
                                                <span>{lead.MobileNo ? lead.MobileNo : '-'}</span>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.emailId && (
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-3 text-xs">
                                                {lead.EmailID && (
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate max-w-50">{lead.EmailID ? lead.EmailID : '-'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.creationDetails && (
                                        <td className="px-4 py-2">
                                            <div className="text-xs">
                                                <div className="mb-1">
                                                    {/* <span className="font-semibold text-gray-700">Date</span> */}
                                                    <span className="ml-2 text-gray-600">{lead.CreatedOn ? lead.CreatedOn : '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.source && (
                                        <td className="px-4 py-2 text-sm text-gray-700">{lead.SourceName || '-'}</td>
                                    )}
                                    {/* {console.log(`visibleColumns`, visibleColumns)} */}
                                    {visibleColumns.FollowupStatus && <td className="px-4 py-2 text-sm text-gray-700">{lead.FollowupStatus || '-'}</td>}
                                    {visibleColumns.LastFollowupedOn && <td className="px-4 py-2 text-sm text-gray-700">{lead.LastFollowupedOn || '-'}</td>}
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="8">
                                    <div className="flex items-center justify-center h-[30vh] w-full bg-[#ffffff]">
                                        <img src={nodata} alt="nodata" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            {/* Floating Pagination */}
            <div className="fixed bottom-6 -right-[8rem] transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-50">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page, index) => (
                        page === '...' ? (
                            <span
                                key={`ellipsis-${index}`}
                                ref={el => ellipsisRefs.current[index] = el}
                                className="px-2 text-gray-500 cursor-pointer relative"
                                onClick={() => setShowPagePopup(showPagePopup === index ? null : index)}
                            >
                                ...
                                {showPagePopup === index && (
                                    <div
                                        id="page-popup-box"
                                        style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '50px', maxHeight: '100px', overflowY: 'auto', padding: 0 }}
                                        className="bg-white border border-gray-300 rounded shadow-lg flex flex-col"
                                    >
                                        {getAllPageNumbers().map(pageNum => (
                                            <button
                                                key={pageNum}
                                                onMouseDown={e => e.preventDefault()}
                                                onClick={() => {
                                                    setShowPagePopup(null);
                                                    setTimeout(() => handlePageChange(pageNum), 0);
                                                }}
                                                className={`w-full h-8 text-center rounded text-sm font-medium transition ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                style={{ minWidth: '32px', padding: 0 }}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Lead Details Drawer */}
            <LeadDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                lead={selectedLeadForDrawer}
            />

            {/* Schedule Call Modal */}
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

            {/* Call Widget Sticky Popup */}
            {showCallWidget && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999]">
                    {/* Header */}
                    <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Call Widget (Kit19 80)</h3>
                        <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-blue-600 rounded">
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowCallWidget(false)}
                                className="p-2 h-[30px] w-[30px] flex items-center hover:bg-blue-600 rounded-[50%]"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {/* Three dots menu */}
                        <div className="flex justify-end mb-4 relative">
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setShowCallWidgetMenu(!showCallWidgetMenu)}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown menu with icons */}
                            {showCallWidgetMenu && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex gap-3 z-10">
                                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                        <FileText className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                                        <FaWhatsapp className="w-6 h-6 text-green-600" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profile Images */}
                        <div className="flex items-center justify-center gap-8 mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://i.pinimg.com/736x/23/34/fc/2334fcc0c89347797e568bb1d070cb37.jpg"
                                            alt="User 1"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 mb-2">
                                    <svg viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                        <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://i.pinimg.com/736x/23/34/fc/2334fcc0c89347797e568bb1d070cb37.jpg"
                                            alt="User 2"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status and Timer */}
                        <div className="text-center mb-6">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">{callStatus}</h4>
                            <p className="text-2xl font-mono text-gray-600">{callTimer}</p>
                        </div>

                        {/* Call Disconnected Message */}
                        <div className="bg-gray-700 text-white px-4 py-3 rounded text-center">
                            <span className="text-sm">Call Disconnected ? </span>
                            <button className="text-blue-400 hover:text-blue-300 font-medium">
                                Click to report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirmModal.show}
                onClose={() => setDeleteConfirmModal({ show: false, leadId: null })}
                title="Delete Lead"
                size="sm"
                showCloseButton={false}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmModal({ show: false, leadId: null })}
                        >
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                alert(`Confirmed deletion (no handler wired). Lead ID: ${deleteConfirmModal.leadId}`);
                                setDeleteConfirmModal({ show: false, leadId: null });
                            }}
                        >
                            Yes
                        </Button>
                    </>
                }
            >
                <p className="text-gray-700">
                    Are you sure you want to delete Lead Id: <strong>{deleteConfirmModal.leadId}</strong>?
                </p>
            </Modal>

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

            <PopUpModal
                isOpen={isAddLeadModal}
                onClose={() => setIsAddLeadModal(false)}
                title="Add Lead"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddLeadModal(false)}
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
                <AddFollowupForm selectedCount={leads} />
            </PopUpModal>


            <PopUpModal
                isOpen={isCreateMeetingModal}
                onClose={() => setIsCreateMeetingModal(false)}
                title="Create Meeting"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsCreateMeetingModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => { }}
                        >
                            Create Meeting
                        </Button>
                    </div>
                }
            >
                <CreateMeetingForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddAppointmentModal}
                onClose={() => setIsAddAppointmentModal(false)}
                title="Add Appointment"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddAppointmentModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => { }}
                        >
                            Create Meeting
                        </Button>
                    </div>
                }
            >
                <AddAppointment />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddPhysicalAppointmentModal}
                onClose={() => setIsAddPhysicalAppointmentModal(false)}
                title="Add Physical Appointment"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddPhysicalAppointmentModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => { }}
                        >
                            Create Meeting
                        </Button>
                    </div>
                }
            >
                <AddPhysicalAppointmentForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isSendVoiceModal}
                onClose={() => setIsSendVoiceModal(false)}
                title="Send Voice"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsSendVoiceModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => { }}
                        >
                            Create Meeting
                        </Button>
                    </div>
                }
            >
                <SendVoiceForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddNotesModal}
                onClose={() => setIsAddNotesModal(false)}
                title="Add Note"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddNotesModal(false)}
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
                <AddNotes />
            </PopUpModal>

            <PopUpModal
                isOpen={isUploadDataModal}
                onClose={() => setIsUploadDataModal(false)}
                title="Upload Data"
                size="lg"
                footer={
                    <div className="flex justify-end w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsUploadDataModal(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                }
            >
                <UploadData />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddTaskModal}
                onClose={() => setIsAddTaskModal(false)}
                title="Add Task"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddTaskModal(false)}
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
                <AddTask />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddDealModal}
                onClose={() => setIsAddDealModal(false)}
                title="Add Deal"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddDealModal(false)}
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
                <AddDeal />
            </PopUpModal>

            <PopUpModal
                isOpen={isWebFormModal}
                onClose={() => setIsWebFormModal(false)}
                title="Add WebForm"
                size="sm"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsWebFormModal(false)}
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
                <WebForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isEditLeadModal}
                onClose={() => setIsEditLeadModal(false)}
                title="Edit Lead"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditLeadModal(false)}
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
                <EditLeadForm lead={leads} onClose={() => setIsEditLeadModal(false)} onSubmit={(updatedLead) => {
                    // Handle the updated lead data here
                    console.log('Updated Lead:', updatedLead);
                    setIsEditLeadModal(false);
                }} />
            </PopUpModal>

            <PopUpModal
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                title="WhatsApp Message"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsWhatsAppModalOpen(false)}
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
                <WhatsAppForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isMailModalOpen}
                onClose={() => setIsMailModalOpen(false)}
                title="Mail Message"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsMailModalOpen(false)}
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
                <MailForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isSMSModalOpen}
                onClose={() => setIsSMSModalOpen(false)}
                title="SMS Message"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsSMSModalOpen(false)}
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
                <SMSForm />
            </PopUpModal>

            <MergeLead
                isOpen={isMergeLeadOpen}
                onClose={() => setIsMergeLeadOpen(false)}
                page={'lead'}
                enquiryData={leads}
            />


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
                <AddFollowupForm selectedCount={selectedLeads?.length + 1}/>
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
                <SendSMS selectedCount={selectedLeads?.length + 1}/>
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
                <SendMail selectedCount={selectedLeads?.length + 1}/>
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
                <VoiceBroadCast selectedCount={selectedLeads?.length + 1}/>
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
                <UpdateForm selectedCount={selectedLeads?.length + 1}/>
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
                <AddTaskForm selectedCount={selectedLeads?.length + 1}/>
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
                <AddAppointmentForm selectedCount={selectedLeads?.length + 1}/>
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
                <MarkettingSequence selectedCount={selectedLeads?.length + 1}/>
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
                <SendInternationalSMS/>
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

export default LeadTable;
