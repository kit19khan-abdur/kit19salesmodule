import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MessageSquare, Calendar, ChevronDown, ChevronUp, Plus, Clock, User, MapPin, TrendingUp, ChevronRight, ChevronLeft, MoreVertical, FileText, Mic2, Mic, ChevronLeftCircle, SquarePen, Edit } from 'lucide-react';
import { GoGitBranch } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import nodata from '../../../assets/nodata.gif';
import { getCallLogt, getEnquiryActivities, getPhysiscalAppointmentWidgetList } from '../../../utils/enquiry';
import PopUpModal from '../../../components/PopUpModal/PopUpModal';
import Button from '../../../components/common/Button';
import MailForm from '../Forms/MailForm';
import SMSForm from '../Forms/SMSForm';
import WhatsAppForm from '../../../components/EnquiriesForms/WhatsAppForm';
import AddFollowupForm from '../Forms/AddFollowupForm';
import CreateMeetingForm from '../../../components/EnquiriesForms/CreateMeetingForm';
import { FaUsersGear } from "react-icons/fa6";
import AddAppointmentForm from '../../../components/EnquiriesForms/AddAppointmentForm';
import SendVoiceForm from '../../../components/EnquiriesForms/SendVoiceForm';
import MergeLead from '../../../components/LeadForm/MergeLead';
import EditEnquiryForm from '../../../components/EnquiriesForms/EditEnquiryForm';

const EnquiryDetails = ({ enquiry, isLeftCollapsed }) => {
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('activities');
    const [activities, setActivities] = useState([]);
    const [callLogs, setCallLogs] = useState([]);
    const [showAllTabs, setShowAllTabs] = useState(false);
    const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
    const [isMailModalOpen, setIsMailModalOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [noteError, setNoteError] = useState('');
    const [isRightCollapsed, setIsRightCollapsed] = useState(false);
    const [isContactOptionsCollapsed, setIsContactOptionsCollapsed] = useState(false);
    const [showCallWidget, setShowCallWidget] = useState(false);
    const [showCallWidgetMenu, setShowCallWidgetMenu] = useState(false);
    const [callStatus, setCallStatus] = useState('Requesting');
    const [callTimer, setCallTimer] = useState('00:00:00');
    const callIntervalRef = useRef(null);
    const [isAddLeadModal, setIsAddLeadModal] = useState(false);
    const [isCreateMeetingModal, setIsCreateMeetingModal] = useState(false);
    const [isAddPhysicalAppointmentModal, setIsAddPhysicalAppointmentModal] = useState(false);
    const [isSendVoiceModal, setIsSendVoiceModal] = useState(false);
    const [isMergeLeadOpen, setIsMergeLeadOpen] = useState(false);
    const [isEditEnquiryModal, setIsEditEnquiryModal] = useState(false);
    const [draggedTab, setDraggedTab] = useState(null);

    // Initialize tabs order from localStorage or use default
    const defaultTabs = ['activities', 'calls', 'Whatsapp Chat Log', 'meetings', 'Physical Appointments', 'chat', 'webform'];
    const [tabsOrder, setTabsOrder] = useState(() => {
        const savedOrder = localStorage.getItem('enquiryTabsOrder');
        return savedOrder ? JSON.parse(savedOrder) : defaultTabs;
    });

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

    // Save tabs order to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('enquiryTabsOrder', JSON.stringify(tabsOrder));
    }, [tabsOrder]);

    // Drag and drop handlers
    const handleDragStart = (e, tab) => {
        setDraggedTab(tab);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetTab) => {
        e.preventDefault();

        if (!draggedTab || draggedTab === targetTab) return;

        const newOrder = [...tabsOrder];
        const draggedIndex = newOrder.indexOf(draggedTab);
        const targetIndex = newOrder.indexOf(targetTab);

        // Remove dragged item and insert at target position
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedTab);

        setTabsOrder(newOrder);
        setDraggedTab(null);
    };

    const handleDragEnd = () => {
        setDraggedTab(null);
    };

    const resolveUrl = (url) => {
        if (!url) return 'https://kit19.com/assets/custom/img/LeadActivityIMG/Whatsapp.png';
        if (url.startsWith('http')) return url;
        // prepend host if relative path
        return `https:/kit19.com${url}`;
    }

    const fetchPAWidgetList = async () => {
        try {
            const response = await getPhysiscalAppointmentWidgetList(enquiry.EnquiryId, "Enquiry");
            console.log(`response of PA`, response)
        } catch (error) {
            console.error('fetchPAWidgetList error:', error);
        }
    }


    const fetchActivities = async () => {
        const payload = {
            EnquiryID: enquiry.EnquiryId,
            Start: 0,
            Limit: 10
        }
        try {
            const response = await getEnquiryActivities(payload)
            console.log(`response`, response)
            setActivities(response?.d)
        } catch (error) {
            console.error('fetchActivities error:', error);
            setActivities([]);
        }
    }
    const fetchCallLog = async () => {
        try {
            const response = await getCallLogt("Enquiry", enquiry.EnquiryId, 0, 10)
            console.log(`response callog`, response)

            // Parse the stringified JSON from response.d
            if (response && response.d) {
                const parsedData = JSON.parse(response.d);
                setCallLogs(Array.isArray(parsedData) ? parsedData : []);
            } else {
                setCallLogs([]);
            }
        } catch (error) {
            console.error('fetchCallLog error:', error);
            setCallLogs([]);
        }
    }

    useEffect(() => {
        if (enquiry) {
            fetchActivities();
            //  fetchCallLog()
            //  fetchPAWidgetList()
        }
    }, [enquiry]);

    const handleSaveNote = () => {

    };

    const handleCancelMail = () => {
        setIsMailModalOpen(false);
    };
    const handleCancelSMS = () => {
        setIsSMSModalOpen(false);
    };
    const handleCancelWhatsApp = () => {
        setIsWhatsAppModalOpen(false);
    };

    // Fetch data when active tab changes
    useEffect(() => {
        if (!enquiry) return;

        if (activeTab === 'activities') {
            fetchActivities();
        } else if (activeTab === 'calls') {
            fetchCallLog();
        } else if (activeTab === 'Physical Appointments') {
            fetchPAWidgetList();
        }
        // Add more conditions for other tabs as needed
    }, [activeTab, enquiry]);

    if (!enquiry) {
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
                        {/* Profile Image */}
                        <img
                            src={enquiry.Image}
                            alt={enquiry.PersonName}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                e.target.src = 'https://docs.kit19.com/default/person.png';
                            }}
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{enquiry.PersonName}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCallWidget(true);
                                                setCallStatus('Requesting');
                                                setCallTimer('00:00:00');
                                            }}
                                            className="flex  cursor-pointer hover:text-[#088b7e] items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {enquiry.CsvMobileNo}
                                        </span>
                                        {enquiry.CsvEmailId && (
                                            <span className="flex  cursor-pointer hover:text-[#088b7e] items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {enquiry.CsvEmailId}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[24px]" style={{
                                    alignItems: 'flex-end'
                                }}>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${enquiry.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {enquiry.IsOpen ? 'Open' : 'Lead'}
                                    </div>
                                    <div className="text-sm text-gray-500">{enquiry.CreatedDate}</div>
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
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Enquiry Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Phone</label>
                                    <p
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCallWidget(true);
                                            setCallStatus('Requesting');
                                            setCallTimer('00:00:00');
                                        }}
                                        className="text-gray-900 cursor-pointer hover:text-[#088b7e] font-medium">{enquiry.CsvMobileNo || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="text-gray-900 font-medium">{enquiry.CsvEmailId || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Enquiry ID</label>
                                    <p className="text-gray-900 font-medium">{enquiry.EnquiryId}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Created Date</label>
                                    <p className="text-gray-900 font-medium">{enquiry.CreatedDate}</p>
                                </div>
                                {(enquiry.Latitude && enquiry.Longitude) && (
                                    <div>
                                        <label className="text-sm text-gray-500">Location</label>
                                        <p className="text-gray-900 font-medium flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {enquiry.Latitude}, {enquiry.Longitude}
                                        </p>
                                    </div>
                                )}
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
                                        <label className="text-sm text-gray-500">Person Name</label>
                                        <p className="text-gray-900 text-sm">{enquiry.PersonName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Mobile Number</label>
                                        <p
                                            className="text-gray-900  text-sm">{enquiry.CsvMobileNo}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Email</label>
                                        <p className="text-gray-900 text-sm">{enquiry.CsvEmailId || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Enquiry ID</label>
                                        <p className="text-gray-900 text-sm">{enquiry.EnquiryId}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Section */}
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="border-b border-gray-200">
                                <div className={`flex px-6 items-center transition-all duration-300 ${isRightCollapsed ? 'justify-between w-full' : 'gap-6'}`}>
                                    {(isRightCollapsed || showAllTabs ? tabsOrder : tabsOrder.slice(0, 4)).map(tab => (
                                        <button
                                            key={tab}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, tab)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, tab)}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => setActiveTab(tab)}
                                            className={`py-4 text-sm font-medium capitalize border-b-2 transition cursor-move ${activeTab === tab
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                                } ${isRightCollapsed ? 'flex-1' : ''} ${draggedTab === tab ? 'opacity-50' : ''
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                    {!isRightCollapsed && (
                                        <button
                                            onClick={() => setShowAllTabs(!showAllTabs)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
                                        >
                                            {showAllTabs ? 'Less' : 'More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 max-h-[200px] overflow-y-auto">
                                <div className="space-y-4">
                                    {/* Conditionally render based on active tab */}
                                    {activeTab === 'calls' ? (
                                        // Call Logs View
                                        callLogs.length === 0 ? (
                                            <div className="flex items-center justify-center py-6">
                                                <p className="text-gray-500">No call logs found</p>
                                            </div>
                                        ) : (
                                            callLogs.map((call, idx) => {
                                                const startTime = call.Callstarttime ? new Date(call.Callstarttime).toLocaleString() : '';
                                                const endTime = call.Callendtime ? new Date(call.Callendtime).toLocaleString() : '';
                                                const duration = call.Callstarttime && call.Callendtime
                                                    ? Math.round((new Date(call.Callendtime) - new Date(call.Callstarttime)) / 1000)
                                                    : 0;

                                                return (
                                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                                                        <div className="flex items-start gap-3">
                                                            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${call.Direction === 'Outgoing' ? 'bg-green-100' : 'bg-blue-100'
                                                                }`}>
                                                                <Phone className={`w-5 h-5 ${call.Direction === 'Outgoing' ? 'text-green-600' : 'text-blue-600'
                                                                    }`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{call.Customernumber}</p>
                                                                        <p className="text-sm text-gray-600">{call.AgentUserName}</p>
                                                                    </div>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${call.Direction === 'Outgoing'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-blue-100 text-blue-700'
                                                                        }`}>
                                                                        {call.Direction}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-500 space-y-1">
                                                                    <p>Start: {startTime}</p>
                                                                    <p>End: {endTime}</p>
                                                                    <p>Duration: {duration}s</p>
                                                                    {call.OutCome && <p>Outcome: {call.OutCome}</p>}
                                                                    {call.recordurl && (
                                                                        <div className="flex items-center gap-3">
                                                                            <audio
                                                                                controls
                                                                                className="h-8"
                                                                                src={resolveUrl(call.recordurl)}
                                                                            >
                                                                                Your browser does not support the audio element.
                                                                            </audio>
                                                                            <a
                                                                                href={resolveUrl(call.recordurl)}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-600 hover:underline text-sm"
                                                                            >
                                                                                Open in new tab
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
                                    ) : (
                                        // Activities View (default)
                                        activities.length === 0 ? (
                                            <div className="flex items-center justify-center py-6">
                                                <p className="text-gray-500">No activities found</p>
                                            </div>
                                        ) : (
                                            activities.map((activity, idx) => {
                                                const avatar = resolveUrl(activity.EventType || activity.AgentImage);
                                                const desc = activity.EventDescription || activity.EventName || '';
                                                const user = activity.UserLogin || activity.PersonName || '';
                                                const time = activity.EventDate ? new Date(activity.EventDate).toLocaleString() : '';
                                                return (
                                                    <div key={activity.HistoryID || idx} className="flex gap-3">
                                                        <img src={avatar} alt={user} className="w-8 h-8  object-cover flex-shrink-0" onError={(e) => e.target.src = 'https://docs.kit19.com/default/person.png'} />
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-gray-900 font-medium">{activity.EventName || activity.EventType}</p>
                                                            </div>
                                                            <p className="text-gray-900">{desc}</p>
                                                            <p className="text-sm text-gray-500">{user} • {time}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowCallWidget(true);
                                            setCallStatus('Requesting');
                                            setCallTimer('00:00:00');
                                        }}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium">
                                        <Phone className="w-4 h-4" />
                                        <span>Call</span>
                                    </button>
                                    <button
                                        onClick={() => setIsWhatsAppModalOpen(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium">
                                        <FaWhatsapp className="w-4 h-4" />
                                        <span>WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={() => setIsMailModalOpen(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs font-medium">
                                        <Mail className="w-4 h-4" />
                                        <span>Email</span>
                                    </button>
                                    <button
                                        onClick={() => setIsSMSModalOpen(true)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-xs font-medium">
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
                            <div className="space-y-2">
                                <button
                                    onClick={() => setIsEditEnquiryModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                                    <Edit className="w-4 h-4" />
                                    Edit All Fields
                                </button>
                                <button
                                    onClick={() => {
                                        // Only open if status is "Lead" (IsOpen is false)
                                        if (!enquiry.IsOpen) {
                                            setIsMergeLeadOpen(true);
                                        } else {
                                            setIsAddLeadModal(true);
                                        }
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                                    <GoGitBranch className="w-4 h-4" />
                                    Add Or Merge Leads
                                </button>
                                <button
                                    onClick={() => setIsCreateMeetingModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                                    <Calendar className="w-4 h-4" />
                                    Schedule Meeting
                                </button>
                                <button
                                    onClick={() => setIsAddPhysicalAppointmentModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                                    <FaUsersGear className="w-4 h-4" />
                                    Add Physical Appointment
                                </button>
                                <button
                                    onClick={() => setIsSendVoiceModal(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                                    <Mic className="w-4 h-4" />
                                    Send Voice
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Floating Expand Button when Right Sidebar is Collapsed */}
                    {isRightCollapsed && (
                        <button
                            onClick={() => setIsRightCollapsed(false)}
                            className="fixed  text-gray-600 rounded-full shadow-lg  transition z-10"
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

            {/* Add Mail Modal */}
            <PopUpModal
                isOpen={isMailModalOpen}
                onClose={handleCancelMail}
                title="Send Mail"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelMail}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='outline'
                            onClick={handleSaveNote}
                        >
                            Send
                        </Button>
                    </div>
                }
            >
                <MailForm />
            </PopUpModal>

            {/* Send SMS Modal */}
            <PopUpModal
                isOpen={isSMSModalOpen}
                onClose={handleCancelSMS}
                title="Send SMS"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelSMS}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='outline'
                            onClick={handleSaveNote}
                        >
                            Send
                        </Button>
                    </div>
                }
            >
                <SMSForm />
            </PopUpModal>

            {/* Send WhatsApp Modal */}
            <PopUpModal
                isOpen={isWhatsAppModalOpen}
                onClose={handleCancelWhatsApp}
                title="Send WhatsApp Message"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancelWhatsApp}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='outline'
                            onClick={handleSaveNote}
                        >
                            Send
                        </Button>
                    </div>
                }
            >
                <WhatsAppForm />
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
                <AddFollowupForm selectedCount={enquiry} />
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
                isOpen={isSendVoiceModal}
                onClose={() => setIsSendVoiceModal(false)}
                title="Send Voice Message"
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
                            Send Voice
                        </Button>
                    </div>
                }
            >
                <SendVoiceForm />
            </PopUpModal>

            {/* Merge Lead Drawer */}
            <MergeLead
                isOpen={isMergeLeadOpen}
                onClose={() => setIsMergeLeadOpen(false)}
                page={'enquiry'}
                enquiryData={enquiry}
            />

            {/* Edit Enquiry Modal */}
            <PopUpModal
                isOpen={isEditEnquiryModal}
                onClose={() => setIsEditEnquiryModal(false)}
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
                    enquiry={enquiry}
                    onClose={() => setIsEditEnquiryModal(false)}
                    onSubmit={(data) => {
                        console.log('Updated data:', data);
                        setIsEditEnquiryModal(false);
                    }}
                />
            </PopUpModal>

        </div>
    );
}

export default EnquiryDetails;
