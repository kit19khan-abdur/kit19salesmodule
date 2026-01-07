import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, ChevronDown, ChevronUp, Plus, MapPin, ChevronRight, MoreVertical, FileText, Mic, EllipsisVertical, NotebookPen, CloudUpload, BookCheck, CalendarCheck, Video, ListChevronsDownUp, Undo2, ChevronLeftCircle } from 'lucide-react';
import { GoGitBranch } from "react-icons/go";
import { FaWhatsapp, FaRegMoneyBillAlt } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaUsersGear } from "react-icons/fa6";
import { SiJfrogpipelines } from "react-icons/si";
import { GrDocumentConfig } from "react-icons/gr";
import nodata from '../../../assets/nodata.gif';
import PopUpModal from '../../../components/PopUpModal/PopUpModal';
import Button from '../../../components/common/Button';
import AddFollowupForm from '../../../components/LeadForm/AddFollowupForm';
import CreateMeetingForm from '../../../components/LeadForm/CreateMeetingForm';
import AddAppointment from '../../../components/LeadForm/AddAppointment';
import AddPhysicalAppointmentForm from '../../../components/LeadForm/AddPhysicalAppointmentForm';


const LeadDetails = ({ lead, isLeftCollapsed }) => {
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('activities');
    const [activities, setActivities] = useState([]);
    const [callLogs, setCallLogs] = useState([]);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);
    const [isContactOptionsCollapsed, setIsContactOptionsCollapsed] = useState(false);
    const [showCallWidget, setShowCallWidget] = useState(false);
    const [callStatus, setCallStatus] = useState('Requesting');
    const [callTimer, setCallTimer] = useState('00:00:00');
    const callIntervalRef = useRef(null);
    const [isAddLeadModal, setIsAddLeadModal] = useState(false);
    const [isCreateMeetingModal, setIsCreateMeetingModal] = useState(false);
    const [isAddPhysicalAppointmentModal, setIsAddPhysicalAppointmentModal] = useState(false);
    const [isAddAppointmentModal, setIsAddAppointmentModal] = useState(false);
    const [isSendVoiceModal, setIsSendVoiceModal] = useState(false);
    const moreDropdownRef = useRef(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [tabsOrder, setTabsOrder] = useState([]);
    const [moreTabsOrder, setMoreTabsOrder] = useState([]);
    const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, tab: null, source: null });
    const MAX_MAIN_TABS = 7;

    // Default tabs
    const defaultTabs = ['Activities', 'Calls', 'FollowUp', 'Document', 'Notes', 'Task', 'Appointment'];
    const defaultMoreTabs = ['Chat', 'Webform', 'Pipeline', 'WaChat Log', 'Meeting'];

    // Load tabs order from localStorage on mount
    useEffect(() => {
        const savedOrder = localStorage.getItem('leadDetailTabsOrder');
        const savedMoreOrder = localStorage.getItem('leadDetailMoreTabsOrder');
        
        if (savedOrder) {
            try {
                setTabsOrder(JSON.parse(savedOrder));
            } catch (error) {
                setTabsOrder(defaultTabs);
            }
        } else {
            setTabsOrder(defaultTabs);
        }

        if (savedMoreOrder) {
            try {
                setMoreTabsOrder(JSON.parse(savedMoreOrder));
            } catch (error) {
                setMoreTabsOrder(defaultMoreTabs);
            }
        } else {
            setMoreTabsOrder(defaultMoreTabs);
        }
    }, []);

    // Mock activities
    const mockActivities = [
        { EventName: 'Outbound call made', UserLogin: 'John Doe', EventDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), EventType: 'https://kit19.com/assets/custom/img/LeadActivityIMG/Call.png' },
        { EventName: 'Note added: Follow up required', UserLogin: 'Sarah Smith', EventDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), EventType: 'https://kit19.com/assets/custom/img/LeadActivityIMG/Note.png' },
    ];

    useEffect(() => {
        setActivities(mockActivities);
    }, [lead]);

    // Drag and drop handlers
    const handleDragStart = (e, tab, source = 'main') => {
        setDraggedItem({ tab, source });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropTab, dropSource = 'main') => {
        e.preventDefault();
        if (!draggedItem || (draggedItem.tab === dropTab && draggedItem.source === dropSource)) return;

        const dragSource = draggedItem.source;
        const dragTab = draggedItem.tab;

        // Handle different drag/drop scenarios
        if (dragSource === 'main' && dropSource === 'main') {
            // Both in main tabs - reorder
            const newOrder = [...tabsOrder];
            const dragIndex = newOrder.indexOf(dragTab);
            const dropIndex = newOrder.indexOf(dropTab);
            newOrder.splice(dragIndex, 1);
            newOrder.splice(dropIndex, 0, dragTab);
            setTabsOrder(newOrder);
            localStorage.setItem('leadDetailTabsOrder', JSON.stringify(newOrder));
        } else if (dragSource === 'main' && dropSource === 'more') {
            // From main to more dropdown
            const newMainOrder = tabsOrder.filter(t => t !== dragTab);
            const newMoreOrder = [...moreTabsOrder];
            const dropIndex = newMoreOrder.indexOf(dropTab);
            newMoreOrder.splice(dropIndex, 0, dragTab);
            setTabsOrder(newMainOrder);
            setMoreTabsOrder(newMoreOrder);
            localStorage.setItem('leadDetailTabsOrder', JSON.stringify(newMainOrder));
            localStorage.setItem('leadDetailMoreTabsOrder', JSON.stringify(newMoreOrder));
        } else if (dragSource === 'more' && dropSource === 'main') {
            // From more dropdown to main - check limit
            if (tabsOrder.length >= MAX_MAIN_TABS) {
                alert(`You can only have maximum ${MAX_MAIN_TABS} tabs in the main tab bar`);
                setDraggedItem(null);
                return;
            }
            const newMoreOrder = moreTabsOrder.filter(t => t !== dragTab);
            const newMainOrder = [...tabsOrder];
            const dropIndex = newMainOrder.indexOf(dropTab);
            newMainOrder.splice(dropIndex, 0, dragTab);
            setTabsOrder(newMainOrder);
            setMoreTabsOrder(newMoreOrder);
            localStorage.setItem('leadDetailTabsOrder', JSON.stringify(newMainOrder));
            localStorage.setItem('leadDetailMoreTabsOrder', JSON.stringify(newMoreOrder));
        } else if (dragSource === 'more' && dropSource === 'more') {
            // Both in more dropdown - reorder
            const newOrder = [...moreTabsOrder];
            const dragIndex = newOrder.indexOf(dragTab);
            const dropIndex = newOrder.indexOf(dropTab);
            newOrder.splice(dragIndex, 1);
            newOrder.splice(dropIndex, 0, dragTab);
            setMoreTabsOrder(newOrder);
            localStorage.setItem('leadDetailMoreTabsOrder', JSON.stringify(newOrder));
        }

        setDraggedItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleContextMenu = (e, tab, source) => {
        e.preventDefault();
        setContextMenu({
            show: true,
            x: e.clientX,
            y: e.clientY,
            tab,
            source
        });
    };

    const moveToDropdown = (tab) => {
        const newMainOrder = tabsOrder.filter(t => t !== tab);
        const newMoreOrder = [...moreTabsOrder, tab];
        setTabsOrder(newMainOrder);
        setMoreTabsOrder(newMoreOrder);
        localStorage.setItem('leadDetailTabsOrder', JSON.stringify(newMainOrder));
        localStorage.setItem('leadDetailMoreTabsOrder', JSON.stringify(newMoreOrder));
        setContextMenu({ show: false, x: 0, y: 0, tab: null, source: null });
    };

    const moveToMainTabs = (tab) => {
        if (tabsOrder.length >= MAX_MAIN_TABS) {
            alert(`You can only have maximum ${MAX_MAIN_TABS} tabs in the main tab bar`);
            setContextMenu({ show: false, x: 0, y: 0, tab: null, source: null });
            return;
        }
        const newMoreOrder = moreTabsOrder.filter(t => t !== tab);
        const newMainOrder = [...tabsOrder, tab];
        setTabsOrder(newMainOrder);
        setMoreTabsOrder(newMoreOrder);
        localStorage.setItem('leadDetailTabsOrder', JSON.stringify(newMainOrder));
        localStorage.setItem('leadDetailMoreTabsOrder', JSON.stringify(newMoreOrder));
        setContextMenu({ show: false, x: 0, y: 0, tab: null, source: null });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Don't close if clicking inside context menu
            const contextMenuElement = document.getElementById('context-menu');
            if (contextMenuElement && contextMenuElement.contains(event.target)) {
                return;
            }
            
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
                setShowMoreDropdown(false);
            }
            // Close context menu when clicking anywhere
            if (contextMenu.show) {
                setContextMenu({ show: false, x: 0, y: 0, tab: null, source: null });
            }
        };

        if (showMoreDropdown || contextMenu.show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMoreDropdown, contextMenu.show]);

    // Call timer effect
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

    const resolveUrl = (url) => {
        if (!url) return 'https://kit19.com/assets/custom/img/LeadActivityIMG/Default.png';
        if (url.startsWith('http')) return url;
        return `https://kit19.com${url}`;
    };

    if (!lead) {
        return (
            <div className="flex items-center justify-center h-full bg-[#ffffff]">
                <img src={nodata} alt="nodata" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className={`mx-2 transition-all duration-300`}>
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                        <img
                            src={lead.Image || 'https://docs.kit19.com/default/person.png'}
                            alt={lead.PersonName}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                e.target.src = 'https://docs.kit19.com/default/person.png';
                            }}
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{lead.PersonName}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex cursor-pointer hover:text-[#088b7e] items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {lead.CsvMobileNo}
                                        </span>
                                        {lead.CsvEmailId && (
                                            <span className="flex cursor-pointer hover:text-[#088b7e] items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {lead.CsvEmailId}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[24px]" style={{ alignItems: 'flex-end' }}>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${lead.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-600 text-white'}`}>
                                        {lead.IsOpen ? 'Open' : 'Closed'}
                                    </div>
                                    <div className="text-sm text-gray-500">{lead.CreatedDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`grid gap-6 transition-all duration-300 ${isRightCollapsed ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {/* Main Content - 2 columns */}
                    <div className={`space-y-6 transition-all duration-300 ${isRightCollapsed ? 'col-span-1' : 'col-span-2'}`}>
                        {/* Primary Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Lead Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Phone</label>
                                    <p onClick={() => setShowCallWidget(true)} className="text-gray-900 cursor-pointer hover:text-[#088b7e] font-medium">{lead.CsvMobileNo || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="text-gray-900 font-medium">{lead.CsvEmailId || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Lead ID</label>
                                    <p className="text-gray-900 font-medium">{lead.LeadId}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Created Date</label>
                                    <p className="text-gray-900 font-medium">{lead.CreatedDate}</p>
                                </div>
                            </div>

                            {/* Show More Details */}
                            <button
                                onClick={() => setShowMoreDetails(!showMoreDetails)}
                                className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                {showMoreDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {showMoreDetails ? 'Show Less' : 'Show More Details'}
                            </button>

                            {showMoreDetails && (
                                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-500">Source</label>
                                        <p className="text-gray-900 text-sm">{lead.Source || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Type</label>
                                        <p className="text-gray-900 text-sm">{lead.Type || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Section */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="border-b border-gray-200">
                                <div className={`flex px-6 items-center transition-all duration-300 ${isRightCollapsed ? 'justify-between w-full' : 'gap-6'}`}>
                                    {tabsOrder.map(tab => (
                                        <button
                                            key={tab}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, tab, 'main')}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, tab, 'main')}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => setActiveTab(tab.toLowerCase())}
                                            onContextMenu={(e) => handleContextMenu(e, tab, 'main')}
                                            className={`py-4 text-sm font-medium capitalize border-b-2 transition cursor-move ${activeTab === tab.toLowerCase()
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                } ${isRightCollapsed ? 'flex-1' : ''} ${draggedItem?.tab === tab && draggedItem?.source === 'main' ? 'opacity-50' : ''}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                    <div className="relative" ref={moreDropdownRef}>
                                        <button
                                            onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                                            className="py-4 px-2 text-gray-600 hover:text-gray-900 transition"
                                            title="More"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                        {/* <button
                                            onClick={() => {
                                                localStorage.removeItem('leadDetailTabsOrder');
                                                localStorage.removeItem('leadDetailMoreTabsOrder');
                                                setTabsOrder(defaultTabs);
                                                setMoreTabsOrder(defaultMoreTabs);
                                            }}
                                            className="py-4 px-2 text-gray-600 hover:text-gray-900 transition"
                                            title="Reset"
                                        >
                                            <Undo2  className="w-5 h-5" />
                                        </button> */}
                                        {showMoreDropdown && (
                                            <div className="absolute right-2 top-[60%] mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-y-auto">
                                                {moreTabsOrder.map((item) => (
                                                    <div
                                                        key={item}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, item, 'more')}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, item, 'more')}
                                                        onDragEnd={handleDragEnd}
                                                        onClick={() => { setActiveTab(item.toLowerCase()); setShowMoreDropdown(false); }}
                                                        onContextMenu={(e) => handleContextMenu(e, item, 'more')}
                                                        className={`w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0 cursor-move ${draggedItem?.tab === item && draggedItem?.source === 'more' ? 'opacity-50' : ''}`}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Context Menu */}
                                {contextMenu.show && (
                                    <div
                                        id="context-menu"
                                        className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] py-1 min-w-[160px]"
                                        style={{
                                            left: `${contextMenu.x}px`,
                                            top: `${contextMenu.y}px`
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {contextMenu.source === 'main' ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    moveToDropdown(contextMenu.tab);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                Move to More Menu
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    moveToMainTabs(contextMenu.tab);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={tabsOrder.length >= MAX_MAIN_TABS}
                                            >
                                                Move to Main Tabs {tabsOrder.length >= MAX_MAIN_TABS && '(Full)'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="p-6 max-h-[300px] h-[300px] overflow-y-auto">
                                <div className="space-y-4">
                                    {activities.length === 0 ? (
                                        <div className="flex items-center justify-center py-6">
                                            <p className="text-gray-500">No activities found</p>
                                        </div>
                                    ) : (
                                        activities.map((activity, idx) => {
                                            const avatar = resolveUrl(activity.EventType);
                                            const time = activity.EventDate ? new Date(activity.EventDate).toLocaleString() : '';
                                            return (
                                                <div key={idx} className="flex gap-3">
                                                    <img src={avatar} alt={activity.UserLogin} className="w-8 h-8 object-cover flex-shrink-0" onError={(e) => e.target.src = 'https://docs.kit19.com/default/person.png'} />
                                                    <div className="flex-1">
                                                        <p className="text-gray-900 font-medium">{activity.EventName}</p>
                                                        <p className="text-sm text-gray-500">{activity.UserLogin} • {time}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className={`space-y-4 transition-all duration-300 relative ${isRightCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'}`}>
                        {/* Contact Options Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Options</h3>
                                <button
                                    onClick={() => setIsContactOptionsCollapsed(!isContactOptionsCollapsed)}
                                    className="p-1 hover:bg-gray-200 rounded transition"
                                    title={isContactOptionsCollapsed ? "Expand" : "Collapse"}
                                >
                                    {isContactOptionsCollapsed ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronUp className="w-4 h-4 text-gray-600" />}
                                </button>
                            </div>
                            {!isContactOptionsCollapsed && (
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => setShowCallWidget(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>Call</span>
                                    </button>
                                    <button
                                        onClick={() => setIsWhatsAppModalOpen(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium"
                                    >
                                        <FaWhatsapp className="w-4 h-4" />
                                        <span>WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={() => setIsMailModalOpen(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs font-medium"
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span>Email</span>
                                    </button>
                                    <button
                                        onClick={() => setIsSMSModalOpen(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs font-medium"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span>SMS</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-800">Quick Actions</h3>
                                <button
                                    onClick={() => setIsRightCollapsed(true)}
                                    className="p-1 hover:bg-gray-200 rounded transition"
                                    title="Collapse"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[280px] overflow-y-auto">
                                <button
                                    onClick={() => setIsAddLeadModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <GoGitBranch className="w-4 h-4" />
                                    Add Or Merge Leads
                                </button>
                                <button
                                    onClick={() => setIsCreateMeetingModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <Video className="w-4 h-4" />
                                    Create Meeting
                                </button>
                                <button
                                    onClick={() => setIsAddAppointmentModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <CalendarCheck className="w-4 h-4" />
                                    Add Appointment
                                </button>
                                <button
                                    onClick={() => setIsAddPhysicalAppointmentModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <FaUsersGear className="w-4 h-4" />
                                    Add Physical Appointment
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <Mic className="w-4 h-4" />
                                    Send Voice
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <NotebookPen className="w-4 h-4" />
                                    Add Note
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <CloudUpload className="w-4 h-4" />
                                    Upload Document
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <BookCheck className="w-4 h-4" />
                                    Add Task
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <SiJfrogpipelines className="w-4 h-4" />
                                    Add Deal
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <FaRegMoneyBillAlt className="w-4 h-4" />
                                    Add Tax Setting
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <GrDocumentConfig className="w-4 h-4" />
                                    Add Quotation
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <HiOutlineDocumentText className="w-4 h-4" />
                                    Add Invoice
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                                >
                                    <ListChevronsDownUp className="w-4 h-4" />
                                    Webform
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Floating Expand Button when Right Sidebar is Collapsed */}
                    {isRightCollapsed && (
                        <button
                            onClick={() => setIsRightCollapsed(false)}
                            className="fixed  text-gray-600 rounded-full shadow-lg transition z-10"
                            style={{
                                right: '11px',
                                top: '30%',
                                transform: 'translateY(-50%)',
                                padding: '8px'
                            }}
                            title="Expand Quick Actions"
                        >
                            <ChevronLeftCircle className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
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
                            onClick={() => {}}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddFollowupForm selectedCount={lead} />
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


        </div>
    );
};

export default LeadDetails;
