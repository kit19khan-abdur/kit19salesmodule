import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Search, Phone, Mail, FileText, LayoutGrid,
    List, RefreshCw, MoreVertical, ChevronLeft, ChevronRight,
    MessageSquare, Trash2, MessageSquareMore, ChevronDown, Spotlight,
    NotebookPen, CloudUpload, Filter, Upload, Download, ChevronUp,
    ArrowUp, ArrowDown, Pin
} from 'lucide-react';
import { GoGitBranch } from 'react-icons/go';
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
                            onClick={() => console.log('Add Lead', selectedLeads)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Add Lead
                        </button>
                        <button
                            onClick={() => console.log('Send SMS to', selectedLeads)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Send SMS
                        </button>
                        <button
                            onClick={() => console.log('Send Mail to', selectedLeads)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Send Mail
                        </button>
                        <button
                            onClick={() => console.log('Update', selectedLeads)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => console.log('Marketing Sequence', selectedLeads)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Marketing Sequence
                        </button>
                        <button
                            onClick={() => console.log('Send International SMS', selectedLeads)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Send InternationalSMS
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
                                            onClick={() => { console.log('Add Call List', selectedLeads); setShowMoreActions(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Add Call List
                                        </button>
                                        <button
                                            onClick={() => { console.log('Add Tag', selectedLeads); setShowMoreActions(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Add Tag
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

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            {selectedLeads.length} of {totalRecord}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedLeads.length} leads selected.
                        </span>
                        <button
                            onClick={() => console.log('Delete', selectedLeads)}
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
                                                                // Handle mail action
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Send WhatsApp">
                                                        <FaWhatsapp
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-green-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Handle WhatsApp action
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Send SMS">
                                                        <MessageSquareMore
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-[#d154f4]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Handle SMS action
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Add Note">
                                                        <NotebookPen
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-[#4eeba2]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Handle SMS action
                                                            }}
                                                        />
                                                    </span>
                                                    <span title="Delete">
                                                        <Trash2
                                                            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-red-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Handle delete action
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
                                                        if (action === 'edit') {
                                                            alert(`Edit lead: ${lead.PersonName}`);
                                                        } else if (action === 'sendVoice') {
                                                            alert(`Send voice to: ${lead.PersonName}`);
                                                        } else if (action === 'meeting') {
                                                            alert(`Create meeting with: ${lead.PersonName}`);
                                                        } else if (action === 'appointment') {
                                                            alert(`Add appointment for: ${lead.PersonName}`);
                                                        } else {
                                                            alert(`Action: ${action} for ${lead.PersonName}`);
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

export default LeadTable;
