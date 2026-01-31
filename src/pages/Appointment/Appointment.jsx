import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Table, Calendar, X, Filter, CloudUpload, Settings, Plus, HardDriveUpload, CloudDownload } from 'lucide-react';
import { FunnelPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppointmentHeader, AppointmentFilters, AppointmentTable, AppointmentPagination, AppointmentCalendar, AppointmentDetailModal } from './components';
import { sampleAppointments, ITEMS_PER_PAGE } from './constants';
import PopUpModal from '../../components/PopUpModal/PopUpModal';
import Button from '../../components/common/Button';
import FilterSearch from './Forms/FilterSearch';
import AddNewAppointment from './Forms/AddNewAppointment';
import CustomSearch from './Forms/CustomSearch';
import EditAppointment from './Forms/EditAppointment';
import Outcome from './Forms/Outcome';
import Comment from './Forms/Comment';

const Appointment = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        open: true,
        overdue: true,
        completed: true
    });
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const menuRef = useRef(null);

    const [showSearchFilterForm, setShowSearchFilterForm] = useState(false);
    const [showAddAppointmentForm, setShowAddAppointmentForm] = useState(false);
    const [showCustomDownloadForm, setShowCustomDownloadForm] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showEditAppointmentForm, setShowEditAppointmentForm] = useState(false);
    const [showOutcomesForm, setShowOutcomesForm] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowSettingsMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Settings options matching AppointmentHeader pattern
    const settingsOptions = [
        { 
            id: 'customFilter', 
            icon: FunnelPlus, 
            label: 'Custom Filter', 
            borderColor: 'border-gray-200 group-hover:border-gray-300',
            iconColor: 'text-gray-700',
            action: () => {
                setShowFilterPanel(!showFilterPanel);
            }
        },
        { 
            id: 'filter', 
            icon: Filter, 
            label: 'Filter', 
            borderColor: 'border-orange-200 group-hover:border-orange-300',
            iconColor: 'text-orange-500',
            action: () => {
                setShowSearchFilterForm(true);
                setShowSettingsMenu(false);
            }
        },
        { 
            id: 'addappointment', 
            icon: Plus, 
            label: 'Add Appointment', 
            borderColor: 'border-teal-200 group-hover:border-teal-300',
            iconColor: 'text-teal-500',
            action: () => {
                setShowAddAppointmentForm(true);
                setShowSettingsMenu(false);
            }
        },
        { 
            id: 'export', 
            icon: HardDriveUpload, 
            label: 'Export', 
            borderColor: 'border-blue-200 group-hover:border-blue-300',
            iconColor: 'text-blue-500',
            action: () => {
                setShowSettingsMenu(false);
            }
        },
        { 
            id: 'download', 
            icon: CloudDownload, 
            label: 'Custom Download', 
            borderColor: 'border-gray-200 group-hover:border-gray-300',
            iconColor: 'text-gray-700',
            action: () => {
                setShowCustomDownloadForm(true);
                setShowSettingsMenu(false);
            }
        },
    ];

    // Filter and search appointments
    const filteredAppointments = useMemo(() => {
        return sampleAppointments.filter(appointment => {
            // Apply status filters
            const statusMatch = filters[appointment.status];
            if (!statusMatch) return false;

            // Apply search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    appointment.title.toLowerCase().includes(query) ||
                    appointment.description.toLowerCase().includes(query) ||
                    appointment.relatedTo.toLowerCase().includes(query) ||
                    appointment.owner.toLowerCase().includes(query) ||
                    appointment.location?.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [filters, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    const startEntry = filteredAppointments.length > 0 ? startIndex + 1 : 0;
    const endEntry = Math.min(endIndex, filteredAppointments.length);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle appointment actions
    const handleAppointmentAction = (actionId, appointment) => {
        console.log('Action:', actionId, 'Appointment:', appointment);

        if (actionId === 'view') {
            setSelectedAppointment(appointment);
            setShowDetailModal(true);
        } else if (actionId === 'edit') {
            setSelectedAppointment(appointment);
            setShowEditAppointmentForm(true);
        } else if (actionId === 'markCompleted') {
            setSelectedAppointment(appointment);
            setShowOutcomesForm(true);
        } else if (actionId === 'comment') {
            setSelectedAppointment(appointment);
            setShowCommentForm(true);
        }
        // Implement other action logic here
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container */}
            <div className="w-full">
                {/* Single Row Header: Filters | View Toggle | Search | Gear */}
                <div className="px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Filters */}
                        <div className="flex items-center gap-2">
                            <AppointmentFilters
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>

                        {/* Right: View Toggle + Search + Settings Menu + Gear */}
                        <div className="flex items-center gap-3">
                            {/* Search */}
                            {!showSettingsMenu && (<div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>)}

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'table'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Table className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'calendar'
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Settings Menu Options - Show when menu is open */}
                            <AnimatePresence>
                                {showSettingsMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                        ref={menuRef}
                                    >
                                        {settingsOptions.map((option, index) => (
                                            <div key={option.id} className="relative">
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={option.action}
                                                    title={option.label}
                                                    className="flex flex-col items-center gap-2 p-2 rounded-xl transition-colors group"
                                                >
                                                    <div className={`w-10 h-10 rounded-full bg-white border ${option.borderColor} flex items-center justify-center transition-colors`}>
                                                        <option.icon className={`w-5 h-5 ${option.iconColor}`} />
                                                    </div>
                                                </motion.button>

                                                {/* FunnelPlus Dropdown */}
                                                {option.id === 'customFilter' && showFilterPanel && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 min-w-[200px]"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                                                defaultValue=""
                                                            >
                                                                <option value="" disabled>Select Segment</option>
                                                                <option value="all">All Segments</option>
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                                <option value="pending">Pending</option>
                                                            </select>
                                                            <button
                                                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                                onClick={() => {
                                                                    console.log('Search segment');
                                                                }}
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        {/* Arrow pointer */}
                                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Gear Icon */}
                            <button
                                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                className={`p-2.5 rounded-full transition-all ${showSettingsMenu
                                    ? 'bg-gray-200 text-gray-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                <Settings className={`w-5 h-5 ${showSettingsMenu ? '' : 'animate-spin'}`} style={{ animationDuration: '3s' }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appointment Table */}
                {viewMode === 'table' && (
                    <>
                        <AppointmentTable
                            appointments={paginatedAppointments}
                            selectedAppointments={selectedAppointments}
                            setSelectedAppointments={setSelectedAppointments}
                            onAppointmentAction={handleAppointmentAction}
                        />

                        {/* Pagination */}
                        {filteredAppointments.length > 0 && (
                            <AppointmentPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                totalEntries={filteredAppointments.length}
                                startEntry={startEntry}
                                endEntry={endEntry}
                            />
                        )}
                    </>
                )}

                {/* Calendar View */}
                {viewMode === 'calendar' && (
                    <div className="p-8 h-[calc(100vh-120px)]">
                        <AppointmentCalendar
                            appointments={filteredAppointments}
                            onAppointmentAction={handleAppointmentAction}
                        />
                    </div>
                )}

                {/* Empty State */}
                {filteredAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No appointments found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Appointment Detail Modal */}
                <AppointmentDetailModal
                    appointment={selectedAppointment}
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedAppointment(null);
                    }}
                />
            </div>

            {/* Filter Search Modal */}
            <PopUpModal
                isOpen={showSearchFilterForm}
                onClose={() => setShowSearchFilterForm(false)}
                title="Filter"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowSearchFilterForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowSearchFilterForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <FilterSearch />
            </PopUpModal>

            {/* Add Appointment Modal */}
            <PopUpModal
                isOpen={showAddAppointmentForm}
                onClose={() => setShowAddAppointmentForm(false)}
                title="Add Appointment"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddAppointmentForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddAppointmentForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddNewAppointment />
            </PopUpModal>

            {/* Edit Appointment Modal */}
            <PopUpModal
                isOpen={showEditAppointmentForm}
                onClose={() => setShowEditAppointmentForm(false)}
                title="Edit Appointment"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowEditAppointmentForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowEditAppointmentForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <EditAppointment />
            </PopUpModal>

            {/* Outcome Appointment Modal */}
            <PopUpModal
                isOpen={showOutcomesForm}
                onClose={() => setShowOutcomesForm(false)}
                title="Appointment Outcome"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowOutcomesForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowOutcomesForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <Outcome />
            </PopUpModal>

            {/* Comment Appointment Modal */}
            <PopUpModal
                isOpen={showCommentForm}
                onClose={() => setShowCommentForm(false)}
                title="Add Comment"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowCommentForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowCommentForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <Comment />
            </PopUpModal>

            {/* Custom Download Modal */}
            <PopUpModal
                isOpen={showCustomDownloadForm}
                onClose={() => setShowCustomDownloadForm(false)}
                title="Custom Download"
                size="md"
            >
                <CustomSearch />
            </PopUpModal>
        </div>
    );
};

export default Appointment;
