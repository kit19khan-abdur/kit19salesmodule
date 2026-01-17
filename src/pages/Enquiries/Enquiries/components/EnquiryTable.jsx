import React, { useState, useRef, useEffect } from 'react';
import { Search, RefreshCw, Filter, MoreVertical, Table, LayoutGrid, Phone, Mail, FileText, Upload, Download, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, List, Calendar, Copy, Trash2, UserMinus, UserX, Pin, ArrowUp, ArrowDown, MessageSquareMore, Plus } from 'lucide-react';
import ColumnHeaderMenu from './ColumnHeaderMenu';
import { TfiLayoutColumn3 } from "react-icons/tfi";
import EnquiryFilterPanel from '../EnquiryFilterPanel';
import Modal from '../../../../components/common/Modal';
import PopUpModal from '../../../../components/PopUpModal/PopUpModal';
import Button from '../../../../components/common/Button';
import AddFollowupForm from '../../Forms/AddFollowupForm';
import SendMassSMS from '../../Forms/SendMassSMS';
import SendMassMailForm from '../../Forms/SendMassMailForm';
import MassUpdateEnquiry from '../../Forms/MassUpdateEnquiry';
import MarketingSequence from '../../Forms/MarketingSequence';
import InternalSMSForm from '../../Forms/InternalSMSForm';
import AddCallList from '../../Forms/AddCallList';
import AddTag from '../../Forms/AddTag';
import RemoveTag from '../../Forms/RemoveTag';
import ImportData from '../../../../components/ImportData/ImportData';
import SendMailForm from '../../../../components/EnquiriesForms/SendMailForm';
import SendSMSForm from '../../../../components/EnquiriesForms/SendSMSForm';
import SendVoiceForm from '../../../../components/EnquiriesForms/SendVoiceForm';
import { GoGitBranch } from "react-icons/go";
import { FaWhatsapp } from 'react-icons/fa';
import CreateMeetingForm from '../../../../components/EnquiriesForms/CreateMeetingForm';
import AddAppointmentForm from '../../../../components/EnquiriesForms/AddAppointmentForm';
import nodata from '../../../../assets/nodata.gif';
import WhatsAppForm from '../../../../components/EnquiriesForms/WhatsAppForm';
import MergeLead from '../../../../components/LeadForm/MergeLead';
import EnquiryRowActionMenu from '../../../../components/EnquiryRowActionMenu';
import EditEnquiryForm from '../../../../components/EnquiriesForms/EditEnquiryForm';
import AddEnquiryForm from '../../../../components/EnquiriesForms/AddEnquiryForm';

const EnquiryTable = ({
    enquiries,
    selectedLead,
    onSelectEnquiry,
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
    setEnquiries,
    onPageChange,
    currentPage: externalCurrentPage
}) => {
    const [showToolbarMenu, setShowToolbarMenu] = useState(false);
    const [rowMenu, setRowMenu] = useState({ show: false, rowId: null });
    const rowMenuAnchorRefs = useRef({});
    const [showPagePopup, setShowPagePopup] = useState(null); // null or index of ellipsis
    const ellipsisRefs = useRef([]);
    const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
    const [selectedEnquiries, setSelectedEnquiries] = useState([]);
    const [showMassOperation, setShowMassOperation] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState('');
    const [currentPage, setCurrentPage] = useState(externalCurrentPage || 1);
    const [selectAllEnquiries, setSelectAllEnquiries] = useState(false);
    const [showColumnSearch, setShowColumnSearch] = useState(false);
    const [showFunnelFilter, setShowFunnelFilter] = useState(false);
    const [headerMenu, setHeaderMenu] = useState({ show: false, col: null });
    const headerIconRefs = useRef({});
    const [visibleColumns, setVisibleColumns] = useState({
        enquiryDetails: true,
        mobileNo: true,
        emailId: true,
        creationDetails: true,
        source: true,
        status: true,
        type: true
    });
    const toolbarMenuRef = useRef(null);
    const massOperationRef = useRef(null);
    const columnSearchRef = useRef(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [filters, setFilters] = useState({});
    const [pinnedColumn, setPinnedColumn] = useState(null);
    const [isAddLeadModal, setIsAddLeadModal] = useState(false);
    const [isSendSMSModal, setIsSendSMSModal] = useState(false);
    const [isSendMailModal, setIsSendMailModal] = useState(false);
    const [isMassUpdateModal, setIsMassUpdateModal] = useState(false);
    const [isMarketingSequenceModal, setIsMarketingSequenceModal] = useState(false);
    const [isInternationalSMSModal, setIsInternationalSMSModal] = useState(false);
    const [isAddCallListModal, setIsAddCallListModal] = useState(false);
    const [isAddTagModal, setIsAddTagModal] = useState(false);
    const [isRemoveTagModal, setIsRemoveTagModal] = useState(false);
    const [isImportDataModal, setIsImportDataModal] = useState(false);
    const [isSendIndividualMailModal, setIsSendIndividualMailModal] = useState(false);
    const [isSendIndividualSMSModal, setIsSendIndividualSMSModal] = useState(false);
    const [isSendVoiceModal, setIsSendVoiceModal] = useState(false);
    const [showCallWidget, setShowCallWidget] = useState(false);
    const [showCallWidgetMenu, setShowCallWidgetMenu] = useState(false);
    const [callStatus, setCallStatus] = useState('Requesting');
    const [callTimer, setCallTimer] = useState('00:00:00');
    const [isCreateMeetingModal, setIsCreateMeetingModal] = useState(false);
    const callIntervalRef = useRef(null);
    const [isAddPhysicalAppointmentModal, setIsAddPhysicalAppointmentModal] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, enquiryId: null });
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isMergeLeadOpen, setIsMergeLeadOpen] = useState(false);
    const [isEditEnquiryModal, setIsEditEnquiryModal] = useState(false);
    const [selectedEnquiryForEdit, setSelectedEnquiryForEdit] = useState(null);
    const [isAddEnquiryModal, setIsAddEnquiryModal] = useState(false);
    const totalPages = Math.ceil(totalRecord / itemsPerPage);

    // Start/stop call timer when call widget is shown/hidden
    useEffect(() => {
        if (showCallWidget) {
            // reset and start
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
            // stop and reset
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

    // Sync external currentPage with internal state
    useEffect(() => {
        if (externalCurrentPage && externalCurrentPage !== currentPage) {
            setCurrentPage(externalCurrentPage);
        }
    }, [externalCurrentPage]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!rowMenu.show) return;
            const menu = document.getElementById(`row-action-menu-${rowMenu.rowId}`);
            const icon = document.getElementById(`row-action-icon-${rowMenu.rowId}`);
            if (menu && !menu.contains(event.target) && icon && !icon.contains(event.target)) {
                setRowMenu({ show: false, rowId: null });
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [rowMenu]);

    // Close dropdowns and page popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check toolbar menu
            if (toolbarMenuRef.current && !toolbarMenuRef.current.contains(event.target)) {
                setShowToolbarMenu(false);
            }
            // Check mass operation menu
            if (massOperationRef.current && !massOperationRef.current.contains(event.target)) {
                setShowMassOperation(false);
            }
            // Check column search menu
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

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPagePopup]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEnquiries(enquiries.map(enq => enq.EnquiryId));
            setSelectAllEnquiries(false); // Uncheck "Apply on All" when selecting current page
        } else {
            setSelectedEnquiries([]);
            setSelectAllEnquiries(false);
        }
    };

    const handleSelectAllEnquiries = (e) => {
        if (e.target.checked) {
            setSelectAllEnquiries(true);
            // Select all on current page as well
            setSelectedEnquiries(enquiries.map(enq => enq.EnquiryId));
        } else {
            setSelectAllEnquiries(false);
            setSelectedEnquiries([]);
        }
    };

    const handleSelectEnquiry = (enquiryId) => {
        setSelectedEnquiries(prev => {
            if (prev.includes(enquiryId)) {
                return prev.filter(id => id !== enquiryId);
            } else {
                return [...prev, enquiryId];
            }
        });
    };

    const handleMassOperation = (operation) => {
        setSelectedOperation(operation);
        setShowMassOperation(false);
        // TODO: Implement mass operation logic here
        console.log(`Performing ${operation} on`, selectedEnquiries);
    };

    const handleColumnToggle = (columnKey) => {
        // Prevent unchecking required columns
        if ((columnKey === 'enquiryDetails' || columnKey === 'mobileNo') && visibleColumns[columnKey]) {
            return;
        }

        // Check if trying to select and already at max limit
        const currentSelectedCount = Object.values(visibleColumns).filter(Boolean).length;
        if (!visibleColumns[columnKey] && currentSelectedCount >= 20) {
            return;
        }

        setVisibleColumns(prev => ({
            ...prev,
            [columnKey]: !prev[columnKey]
        }));
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Generate pagination numbers with ellipsis
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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            if (onPageChange) {
                onPageChange(page);
            }
        }
    };


    const processedEnquiries = React.useMemo(() => {
        let data = [...enquiries];

        // FILTER
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                data = data.filter(item => {
                    const value = item[key];
                    // Handle boolean values (like IsOpen)
                    if (typeof value === 'boolean') {
                        const searchLower = filters[key].toLowerCase();
                        return (value && (searchLower.includes('open') || searchLower.includes('true'))) ||
                            (!value && (searchLower.includes('lead') || searchLower.includes('false')));
                    }
                    // Handle other values
                    return String(value ?? '')
                        .toLowerCase()
                        .includes(filters[key].toLowerCase());
                });
            }
        });

        // SORT
        if (sortConfig.key) {
            data.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal == null) return 1;
                if (bVal == null) return -1;

                // Handle boolean sorting
                if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
                    return sortConfig.direction === 'asc'
                        ? (aVal === bVal ? 0 : aVal ? -1 : 1)
                        : (aVal === bVal ? 0 : aVal ? 1 : -1);
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [enquiries, filters, sortConfig]);

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
        if (key === 'enquiryDetails' || key === 'mobileNo') {
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


    const handleCancelLeadModal = () => {
        setIsAddLeadModal(false);
    }

    const handleCancelSMSModal = () => {
        setIsSendSMSModal(false);
    }

    const handleCancelMailModal = () => {
        setIsSendMailModal(false);
    }


    const handleSaveLead = () => {
        alert('Followup added successfully!');
    }

    const handleSendSMS = () => {
        alert('SMS sent successfully!');
        setIsSendSMSModal(false);
    }

    const handleSendMail = () => {
        alert('Mail sent successfully!');
        setIsSendMailModal(false);
    }

    const handleCancelUpdateModal = () => {
        setIsMassUpdateModal(false);
    }

    const handleMassUpdate = (data) => {
        console.log('Mass update data:', data);
        alert('Enquiries updated successfully!');
        setIsMassUpdateModal(false);
    }

    const handleCancelSequenceModal = () => {
        setIsMarketingSequenceModal(false);
    }

    const handleSaveSequence = (data) => {
        console.log('Marketing sequence data:', data);
        alert('Enquiries added to sequence successfully!');
        setIsMarketingSequenceModal(false);
    }

    const handleCancelInternationalSMSModal = () => {
        setIsInternationalSMSModal(false);
    }

    const handleSendInternationalSMS = (data) => {
        console.log('International SMS data:', data);
        alert('International SMS sent successfully!');
        setIsInternationalSMSModal(false);
    }

    const handleCancelCallListModal = () => {
        setIsAddCallListModal(false);
    }

    const handleSaveCallList = (data) => {
        console.log('Add call list data:', data);
        alert('Enquiries added to call list successfully!');
        setIsAddCallListModal(false);
    }

    const handleCancelTagModal = () => {
        setIsAddTagModal(false);
    }

    const handleSaveTag = (data) => {
        console.log('Add tag data:', data);
        alert('Tag added successfully!');
        setIsRemoveTagModal(false);
    }
    const handleCancelRemoveTagModal = () => {
        setIsRemoveTagModal(false);
    }

    const handleSaveRemoveTag = (data) => {
        console.log('Remove tag data:', data);
        alert('Tag removed successfully!');
        setIsRemoveTagModal(false);
    }

    const handleCancelImportDataModal = () => {
        setIsImportDataModal(false);
    }

    const handleImportData = (data) => {
        console.log('Import data:', data);
        alert('Data imported successfully!');
        setIsImportDataModal(false);
    }

    const handleCancelIndividualMail = () => {
        setIsSendIndividualMailModal(false);
    }

    const handleSendIndividualMail = (data) => {
        console.log('Send individual mail data:', data);
        alert('Mail sent successfully!');
        setIsSendIndividualMailModal(false);
    }

    const handleCancelIndividualSMS = () => {
        setIsSendIndividualSMSModal(false);
    }

    const handleSendIndividualSMS = (data) => {
        console.log('Send individual SMS data:', data);
        alert('SMS sent successfully!');
        setIsSendIndividualSMSModal(false);
    }

    const handleCancelVoice = () => {
        setIsSendVoiceModal(false);
    }

    const handleSendVoice = (data) => {
        console.log('Send voice data:', data);
        alert('Voice message sent successfully!');
        setIsSendVoiceModal(false);
    }

    // Helper for all page numbers
    const getAllPageNumbers = () => Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="relative flex flex-col bg-white h-full w-full">
            {/* Floating left filter icon (matches screenshot position) */}
            <button
                id="enquiries-filter-toggle"
                title="Filters"
                onClick={() => setShowFunnelFilter(true)}
                className="absolute -left-[12px] top-[50%] z-50 p-2 rounded-md bg-green-50 border border-green-100 text-green-600 hover:bg-green-100 shadow"
            >
                <Filter className="w-5 h-5" />
            </button>
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">Enquiries</h2>
                        <div className="flex items-center gap-2 flex-1">
                            {/* Mass Operation Buttons - Show when enquiries are selected */}
                            {selectedEnquiries.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => setIsAddLeadModal(true)}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                                    >
                                        Add Lead
                                    </button>
                                    <button
                                        onClick={() => setIsSendSMSModal(true)}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                                    >
                                        Send SMS
                                    </button>
                                    <button
                                        onClick={() => setIsSendMailModal(true)}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                                    >
                                        Send Mail
                                    </button>
                                    <button
                                        onClick={() => setIsMassUpdateModal(true)}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-1"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setIsMarketingSequenceModal(true)}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                                    >
                                        Marketing Sequence
                                    </button>
                                    <button
                                        onClick={() => setIsInternationalSMSModal(true)}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                                    >
                                        Send InternationalSMS
                                    </button>

                                    <div className="relative" ref={massOperationRef}>
                                        <button
                                            onClick={() => setShowMassOperation(!showMassOperation)}
                                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition flex items-center gap-1"
                                        >
                                            More actions
                                            {showMassOperation ? (<ChevronUp className="w-4 h-4" />) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                        {showMassOperation && (
                                            <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                                                <button
                                                    onClick={() => {
                                                        setIsAddCallListModal(true);
                                                        setShowMassOperation(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Add Call List
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsAddTagModal(true);
                                                        setShowMassOperation(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Add Tag
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsRemoveTagModal(true);
                                                        setShowMassOperation(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Remove Tag
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Search Box - Show on left when no selection */
                                !isSearchCollapsed ? (
                                    <div className="w-[540px] relative flex items-center">
                                        <Search
                                            className="absolute right-[2rem] cursor-pointer top-2.5 w-4 h-4 text-gray-400 z-40"
                                            onClick={() => onSearch()}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Search enquiries..."
                                            value={searchText}
                                            onChange={(e) => onSearchChange(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                            className="flex-1 pl-2 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() => setIsSearchCollapsed(true)}
                                            className="px-1 py-[11px] hover:bg-gray-100 rounded-r transition"
                                            title="Collapse Search"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchCollapsed(false)}
                                        className="p-2 hover:bg-gray-100 rounded transition"
                                        title="Expand Search"
                                    >
                                        <Search className="w-4 h-4 text-gray-600" />
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 whitespace-nowrap">{enquiries.length} of {totalRecord}</span>
                        {/* Show selection count and delete when items are selected */}
                        {selectedEnquiries.length > 0 ? (
                            <>
                                
                                    <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 text-sm text-gray-700 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectAllEnquiries}
                                            onChange={handleSelectAllEnquiries}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label className="cursor-pointer select-none">
                                            Apply on all <span className="font-semibold">{totalRecord}</span> enquiries
                                        </label>
                                    </div>
                                <button
                                    onClick={() => alert('Mass Delete action triggered')}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded hover:bg-red-50 transition"
                                    title="Delete selected"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedEnquiries([]);
                                        setSelectAllEnquiries(false);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded transition"
                                    title="Cancel selection"
                                >
                                    ✕
                                </button>
                            </>
                        ) : (
                            <div className="flex">
                                {/* View Toggle */}
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

                                {/* More menu with dropdown */}
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
                                    <span title='Add Enquiry'>
                                    <button
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                                        onClick={() => {
                                           setIsAddEnquiryModal(true);
                                            setShowToolbarMenu(false);
                                        }}
                                    >
                                        <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    </span>
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
                                                    onChange={(e) => setItemsPerPage(e.target.value)}
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

                                    {/* Column Search Dropdown - Positioned near toolbar */}
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
                                                    onClick={() => handleColumnToggle('enquiryDetails')}
                                                    disabled
                                                    className="w-full px-4 py-2.5 text-left text-sm text-white bg-blue-400 transition flex items-center justify-between cursor-not-allowed opacity-75"
                                                >
                                                    <span>Enquiry Details</span>
                                                    {visibleColumns.enquiryDetails && (
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
                                                    <span className="flex items-center gap-2">
                                                        Email ID
                                                        {!visibleColumns.emailId && <span className="text-xs text-gray-400">(hidden)</span>}
                                                    </span>
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
                                                    <span className="flex items-center gap-2">
                                                        Creation Details
                                                        {!visibleColumns.creationDetails && <span className="text-xs text-gray-400">(hidden)</span>}
                                                    </span>
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
                                                    <span className="flex items-center gap-2">
                                                        Source
                                                        {!visibleColumns.source && <span className="text-xs text-gray-400">(hidden)</span>}
                                                    </span>
                                                    {visibleColumns.source && (
                                                        <span className="text-white">✓</span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleColumnToggle('status')}
                                                    className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.status
                                                        ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        Status
                                                        {!visibleColumns.status && <span className="text-xs text-gray-400">(hidden)</span>}
                                                    </span>
                                                    {visibleColumns.status && (
                                                        <span className="text-white">✓</span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleColumnToggle('type')}
                                                    className={`w-full px-4 py-2.5 text-left text-sm transition flex items-center justify-between ${visibleColumns.type
                                                        ? 'text-white bg-blue-400 hover:bg-blue-500'
                                                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        Type
                                                        {!visibleColumns.type && <span className="text-xs text-gray-400">(hidden)</span>}
                                                    </span>
                                                    {visibleColumns.type && (
                                                        <span className="text-white">✓</span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sorting Controls */}
            <div className="px-6 py-2 border-b border-gray-200 flex items-center justify-start bg-gray-50">
                <div className="text-sm text-gray-600">
                    Showing Records: <strong>All Enquiries</strong>
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
                                    checked={selectedEnquiries.length === enquiries.length && enquiries.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            {visibleColumns.enquiryDetails && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'enquiryDetails' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'PersonName' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Enquiry Details
                                        {pinnedColumn === 'enquiryDetails' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'PersonName' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['enquiryDetails'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'enquiryDetails' ? { show: false, col: null } : { show: true, col: 'enquiryDetails' }); }}>
                                        {headerMenu.show && headerMenu.col === 'enquiryDetails' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'enquiryDetails'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['enquiryDetails'] }}
                                        onSortAsc={() => handleSortAsc('PersonName')}
                                        onSortDesc={() => handleSortDesc('PersonName')}
                                        onPin={() => handlePinColumn('enquiryDetails')}
                                        onHide={() => handleHideColumn('enquiryDetails')}
                                        onFilter={(value) => handleFilterColumn('PersonName', value)}
                                        canHide={false}
                                    />
                                </th>
                            )}
                            {visibleColumns.mobileNo && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'mobileNo' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'CsvMobileNo' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Mobile No
                                        {pinnedColumn === 'mobileNo' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'CsvMobileNo' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['mobileNo'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'mobileNo' ? { show: false, col: null } : { show: true, col: 'mobileNo' }); }}>
                                        {headerMenu.show && headerMenu.col === 'mobileNo' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'mobileNo'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['mobileNo'] }}
                                        onSortAsc={() => handleSortAsc('CsvMobileNo')}
                                        onSortDesc={() => handleSortDesc('CsvMobileNo')}
                                        onPin={() => handlePinColumn('mobileNo')}
                                        onHide={() => handleHideColumn('mobileNo')}
                                        onFilter={(value) => handleFilterColumn('CsvMobileNo', value)}
                                        canHide={false}
                                    />
                                </th>
                            )}
                            {visibleColumns.emailId && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'emailId' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'CsvEmailId' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Email ID
                                        {pinnedColumn === 'emailId' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'CsvEmailId' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['emailId'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'emailId' ? { show: false, col: null } : { show: true, col: 'emailId' }); }}>
                                        {headerMenu.show && headerMenu.col === 'emailId' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'emailId'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['emailId'] }}
                                        onSortAsc={() => handleSortAsc('CsvEmailId')}
                                        onSortDesc={() => handleSortDesc('CsvEmailId')}
                                        onPin={() => handlePinColumn('emailId')}
                                        onHide={() => handleHideColumn('emailId')}
                                        onFilter={(value) => handleFilterColumn('CsvEmailId', value)}
                                    />
                                </th>
                            )}
                            {visibleColumns.creationDetails && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'creationDetails' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'CreatedDate' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Creation Details
                                        {pinnedColumn === 'creationDetails' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'CreatedDate' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['creationDetails'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'creationDetails' ? { show: false, col: null } : { show: true, col: 'creationDetails' }); }}>
                                        {headerMenu.show && headerMenu.col === 'creationDetails' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
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
                                    />
                                </th>
                            )}
                            {visibleColumns.source && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'source' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'Source' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Source
                                        {pinnedColumn === 'source' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'Source' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['source'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'source' ? { show: false, col: null } : { show: true, col: 'source' }); }}>
                                        {headerMenu.show && headerMenu.col === 'source' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'source'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['source'] }}
                                        onSortAsc={() => handleSortAsc('Source')}
                                        onSortDesc={() => handleSortDesc('Source')}
                                        onPin={() => handlePinColumn('source')}
                                        onHide={() => handleHideColumn('source')}
                                        onFilter={(value) => handleFilterColumn('Source', value)}
                                    />
                                </th>
                            )}
                            {visibleColumns.status && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'status' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'IsOpen' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Status
                                        {pinnedColumn === 'status' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'IsOpen' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['status'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'status' ? { show: false, col: null } : { show: true, col: 'status' }); }}>
                                        {headerMenu.show && headerMenu.col === 'status' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'status'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['status'] }}
                                        onSortAsc={() => handleSortAsc('IsOpen')}
                                        onSortDesc={() => handleSortDesc('IsOpen')}
                                        onPin={() => handlePinColumn('status')}
                                        onHide={() => handleHideColumn('status')}
                                        onFilter={(value) => handleFilterColumn('IsOpen', value)}
                                    />
                                </th>
                            )}
                            {visibleColumns.type && (
                                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider relative group ${pinnedColumn === 'type' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} ${sortConfig.key === 'Type' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-1">
                                        Type
                                        {pinnedColumn === 'type' && <Pin className="w-3 h-3 text-blue-600" />}
                                        {sortConfig.key === 'Type' && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-3 h-3 text-blue-600" />
                                                : <ArrowDown className="w-3 h-3 text-blue-600" />
                                        )}
                                    </div>
                                    <span ref={el => headerIconRefs.current['type'] = el} className="inline-block ml-1 align-middle cursor-pointer" onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu.show && headerMenu.col === 'type' ? { show: false, col: null } : { show: true, col: 'type' }); }}>
                                        {headerMenu.show && headerMenu.col === 'type' ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />}
                                    </span>
                                    <ColumnHeaderMenu
                                        show={headerMenu.show && headerMenu.col === 'type'}
                                        onClose={() => setHeaderMenu({ show: false, col: null })}
                                        anchorRef={{ current: headerIconRefs.current['type'] }}
                                        onSortAsc={() => handleSortAsc('Type')}
                                        onSortDesc={() => handleSortDesc('Type')}
                                        onPin={() => handlePinColumn('type')}
                                        onHide={() => handleHideColumn('type')}
                                        onFilter={(value) => handleFilterColumn('Type', value)}
                                    />
                                </th>
                            )}
                        </tr>
                    </thead>
                    {processedEnquiries?.length > 0 ? (
                        <tbody className="bg-white divide-y divide-gray-200">
                            {processedEnquiries.map((enquiry) => (
                                <tr
                                    key={enquiry.EnquiryId}
                                    className={`transition hover:bg-gray-50 group ${selectedLead === enquiry.EnquiryId ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                            checked={selectedEnquiries.includes(enquiry.EnquiryId)}
                                            onChange={() => handleSelectEnquiry(enquiry.EnquiryId)}
                                        />
                                    </td>
                                    {visibleColumns.enquiryDetails && (
                                        <td className="px-4 py-2 relative">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div
                                                        className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
                                                        onClick={(e) => { e.stopPropagation(); onSelectEnquiry(enquiry); }}
                                                    >
                                                        <img src="https://kit19.com/assets/custom/img/img_avatar.png" alt="img" className="w-10 h-10 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900 text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelectEnquiry(enquiry); }}>{enquiry.PersonName}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* Show all icons horizontally as in screenshot */}
                                                <span title="Send Email">
                                                    <Mail
                                                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsSendIndividualMailModal(true);
                                                        }}
                                                    />
                                                </span>
                                                <span title="Add to Lead">
                                                    <GoGitBranch
                                                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#840ab9]"
                                                        onClick={() => {
                                                            if (!enquiry.IsOpen) {
                                                                setIsMergeLeadOpen(true);
                                                            } else {
                                                                setIsAddLeadModal(true)
                                                            }
                                                        }}
                                                    />
                                                </span>
                                                <span title="Send WhatsApp">
                                                    <FaWhatsapp
                                                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#25D366]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsWhatsAppModalOpen(true);
                                                        }}
                                                    />
                                                </span>
                                                <span title="Send SMS">
                                                    <MessageSquareMore
                                                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsSendIndividualSMSModal(true);
                                                        }}
                                                    />
                                                </span>
                                                {/* <Copy className="w-5 h-5 text-gray-400 cursor-pointer" /> */}
                                                <span title="Delete">
                                                    <Trash2
                                                        className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#f00]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirmModal({ show: true, enquiryId: enquiry.EnquiryId });
                                                        }}
                                                    />
                                                </span>
                                                <span
                                                    id={`row-action-icon-${enquiry.EnquiryId}`}
                                                    ref={el => rowMenuAnchorRefs.current[enquiry.EnquiryId] = el}
                                                    className="cursor-pointer"
                                                    title="More Actions"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setRowMenu(rowMenu.show && rowMenu.rowId === enquiry.EnquiryId ? { show: false, rowId: null } : { show: true, rowId: enquiry.EnquiryId });
                                                    }}
                                                >
                                                    <MoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-700" />
                                                </span>
                                            </div>
                                            {/* Row action menu dropdown */}
                                            <EnquiryRowActionMenu
                                                show={rowMenu.show && rowMenu.rowId === enquiry.EnquiryId}
                                                anchorRef={{ current: rowMenuAnchorRefs.current[enquiry.EnquiryId] }}
                                                onClose={() => setRowMenu({ show: false, rowId: null })}
                                                menuId={`row-action-menu-${enquiry.EnquiryId}`}
                                                onAction={action => {
                                                    setRowMenu({ show: false, rowId: null });
                                                    if (action === 'edit') {
                                                        setSelectedEnquiryForEdit(enquiry);
                                                        setIsEditEnquiryModal(true);
                                                    } else if (action === 'sendVoice') {
                                                        setIsSendVoiceModal(true);
                                                    } else if (action === 'meeting') {
                                                        setIsCreateMeetingModal(true)
                                                    } else if (action === 'appointment') {
                                                        setIsAddPhysicalAppointmentModal(true)
                                                    } else {
                                                        alert(`Action: ${action} for ${enquiry.PersonName} and Id ${enquiry.EnquiryId}`);
                                                    }
                                                }}
                                            />
                                        </td>
                                    )}
                                    {visibleColumns.mobileNo && (
                                        <td className='px-4'>
                                            <div className="flex cursor-pointer hover:text-green-600 items-center gap-1 text-blue-600 font-medium">
                                                {/* <Phone className="w-3 h-3" /> */}
                                                <span onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowCallWidget(true);
                                                    setCallStatus('Requesting');
                                                    setCallTimer('00:00:00');
                                                }}
                                                >{enquiry.CsvMobileNo}</span>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.emailId && (
                                        <td className='px-4'>
                                            <div className="flex items-center gap-3 text-xs">

                                                {enquiry.CsvEmailId && (
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate max-w-50">{enquiry.CsvEmailId}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.creationDetails && (
                                        <td className="px-4">
                                            <div className="text-xs">
                                                <div className="mb-1">
                                                    <span className="font-semibold text-gray-700">Date</span>
                                                    <span className="ml-2 text-gray-600">{enquiry.CreatedDate}</span>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.source && (
                                        <td className="px-4 text-sm text-gray-700">{enquiry.Source || '-'}</td>
                                    )}
                                    {visibleColumns.status && (
                                        <td className="px-4">
                                            <span className={`inline-block px-2 rounded-full text-xs font-medium ${enquiry.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-600 text-white'
                                                }`}>
                                                {enquiry.IsOpen ? 'Open' : 'Lead'}
                                            </span>
                                        </td>
                                    )}
                                    {visibleColumns.type && (
                                        <td className="px-4 text-sm text-gray-700">{enquiry.Type || '-'}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <div className="flex items-center justify-center h-[30vh] w-full bg-[#ffffff]">
                            <img src={nodata} alt="nodata" />
                        </div>
                    )}
                </table>
            </div>

            {/* Floating Pagination */}
            <div className="fixed bottom-6 -right-20 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 z-50">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    title="Previous"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page, index) => (
                        page === '...'
                            ? (
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
                                            {getAllPageNumbers().map(page => (
                                                <button
                                                    key={page}
                                                    onMouseDown={e => e.preventDefault()}
                                                    onClick={() => {
                                                        setShowPagePopup(null);
                                                        setTimeout(() => handlePageChange(page), 0);
                                                    }}
                                                    className={`w-full h-8 text-center rounded text-sm font-medium transition ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    style={{ minWidth: '32px', padding: 0 }}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </span>
                            )
                            : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    title="Next"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            <EnquiryFilterPanel
                show={showFunnelFilter}
                onClose={() => setShowFunnelFilter(false)}
                initialFilters={filters}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                    setShowFunnelFilter(false);
                }}
            />

            {/* ------------------------------------------- Start PopUpModal----------------------------------- */}

            <PopUpModal
                isOpen={isAddLeadModal}
                onClose={handleCancelLeadModal}
                title="Add Lead"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelLeadModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSaveLead}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddFollowupForm selectedCount={selectedEnquiries.length} />
            </PopUpModal>

            <PopUpModal
                isOpen={isSendSMSModal}
                onClose={handleCancelSMSModal}
                title="Send SMS To Mass"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelSMSModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSendSMS}
                        >
                            Send SMS
                        </Button>
                    </div>
                }
            >
                <SendMassSMS selectedCount={selectedEnquiries.length} />
            </PopUpModal>

            <PopUpModal
                isOpen={isSendMailModal}
                onClose={handleCancelMailModal}
                title="Send Mail To Mass"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelMailModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSendMail}
                        >
                            Send Mail
                        </Button>
                    </div>
                }
            >
                <SendMassMailForm selectedCount={selectedEnquiries.length} />
            </PopUpModal>

            <PopUpModal
                isOpen={isMassUpdateModal}
                onClose={handleCancelUpdateModal}
                title="Mass Update Enquiry"
                size="lg"
            >
                <MassUpdateEnquiry onClose={handleCancelUpdateModal} onSubmit={handleMassUpdate} />
            </PopUpModal>

            <PopUpModal
                isOpen={isMarketingSequenceModal}
                onClose={handleCancelSequenceModal}
                title="Marketing Sequence"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelSequenceModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={() => { }}
                        >
                            Save Sequence
                        </Button>
                    </div>
                }
            >
                <MarketingSequence onClose={handleCancelSequenceModal} onSubmit={handleSaveSequence} />
            </PopUpModal>

            <PopUpModal
                isOpen={isInternationalSMSModal}
                onClose={handleCancelInternationalSMSModal}
                title="InternationalSend SMS To Mass"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelInternationalSMSModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSendInternationalSMS}
                        >
                            Send SMS
                        </Button>
                    </div>
                }
            >
                <InternalSMSForm onClose={handleCancelInternationalSMSModal} onSubmit={handleSendInternationalSMS} />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddCallListModal}
                onClose={handleCancelCallListModal}
                title="Add To Call List"
                size="md"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelCallListModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSaveCallList}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddCallList onClose={handleCancelCallListModal} onSubmit={handleSaveCallList} />
            </PopUpModal>

            <PopUpModal
                isOpen={isAddTagModal}
                onClose={handleCancelTagModal}
                title="Add Tag To Mass"
                size="md"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelTagModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSaveTag}
                        >
                            Add Tag
                        </Button>
                    </div>
                }
            >
                <AddTag onClose={handleCancelTagModal} onSubmit={handleSaveTag} />
            </PopUpModal>

            <PopUpModal
                isOpen={isRemoveTagModal}
                onClose={handleCancelRemoveTagModal}
                title="Remove Tag To Mass"
                size="md"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelRemoveTagModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSaveRemoveTag}
                        >
                            Remove Tag
                        </Button>
                    </div>
                }
            >
                <RemoveTag onClose={handleCancelRemoveTagModal} onSubmit={handleSaveRemoveTag} />
            </PopUpModal>

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

            <PopUpModal
                isOpen={isSendIndividualMailModal}
                onClose={handleCancelIndividualMail}
                title="Send Mail"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelIndividualMail}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSendIndividualMail}
                        >
                            Send Mail
                        </Button>
                    </div>
                }
            >
                <SendMailForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isSendIndividualSMSModal}
                onClose={handleCancelIndividualSMS}
                title="Send SMS"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelIndividualSMS}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSendIndividualSMS}
                        >
                            Send SMS
                        </Button>
                    </div>
                }
            >
                <SendSMSForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isSendVoiceModal}
                onClose={handleCancelVoice}
                title="Send Voice Message"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelVoice}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            onClick={handleSendVoice}
                        >
                            Send Voice
                        </Button>
                    </div>
                }
            >
                <SendVoiceForm />
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
                <AddAppointmentForm />
            </PopUpModal>

            <PopUpModal
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                title="Send WhatsApp Message"
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
                            variant='outline'
                            onClick={() => { }}
                        >
                            Send
                        </Button>
                    </div>
                }
            >
                <WhatsAppForm />
            </PopUpModal>

                  {/* Add Enquiry Modal */}
      <PopUpModal
        isOpen={isAddEnquiryModal}
        onClose={() => setIsAddEnquiryModal(false)}
        title="Add Enquiry"
        size="xl"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={() => setIsAddEnquiryModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                console.log('Save enquiry');
                setIsAddEnquiryModal(false);
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddEnquiryForm
          onClose={() => setIsAddEnquiryModal(false)}
          onSubmit={(data) => {
            console.log('Enquiry data:', data);
            setIsAddEnquiryModal(false);
          }}
        />
      </PopUpModal>

            <MergeLead
                isOpen={isMergeLeadOpen}
                onClose={() => setIsMergeLeadOpen(false)}
                page={'enquiry'}
                enquiryData={enquiries}
            />

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

            {/* ------------------------------------------- End PopUpModal----------------------------------- */}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirmModal.show}
                onClose={() => setDeleteConfirmModal({ show: false, enquiryId: null })}
                title="Delete Enquiry"
                size="sm"
                showCloseButton={false}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirmModal({ show: false, enquiryId: null })}
                        >
                            No
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                alert(`Confirmed deletion (no handler wired). Enquiry ID: ${deleteConfirmModal.enquiryId}`);
                                setDeleteConfirmModal({ show: false, enquiryId: null });
                            }}
                        >
                            Yes
                        </Button>
                    </>
                }
            >
                <p className="text-gray-700">
                    Are you sure you want to delete Enquiry Id: <strong>{deleteConfirmModal.enquiryId}</strong>?
                </p>
            </Modal>

            {/* Edit Enquiry Modal */}
            <PopUpModal
                isOpen={isEditEnquiryModal}
                onClose={() => {
                    setIsEditEnquiryModal(false);
                    setSelectedEnquiryForEdit(null);
                }}
                title="Edit Details"
                size="xl"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditEnquiryModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                console.log('Update enquiry');
                                setIsEditEnquiryModal(false);
                            }}
                        >
                            Update
                        </Button>
                    </div>
                }
            >
                <EditEnquiryForm
                    enquiry={selectedEnquiryForEdit}
                    onClose={() => {
                        setIsEditEnquiryModal(false);
                        setSelectedEnquiryForEdit(null);
                    }}
                    onSubmit={(data) => {
                        console.log('Updated data:', data);
                        setIsEditEnquiryModal(false);
                        setSelectedEnquiryForEdit(null);
                    }}
                />
            </PopUpModal>
        </div>
    );
};

export default EnquiryTable;
