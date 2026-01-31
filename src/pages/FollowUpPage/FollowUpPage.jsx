import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Filter, Plus, HardDriveUpload, CloudDownload, Table, Calendar } from 'lucide-react';
import { FunnelPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FollowUpFilters, FollowUpTable, FollowUpPagination, FollowUpCalendar, FollowUpDetailModal } from './components';
import { sampleFollowUps, ITEMS_PER_PAGE } from './constants';
import PopUpModal from '../../components/PopUpModal/PopUpModal';
import Button from '../../components/common/Button';
import FilterSearch from './Forms/FilterSearch';
import CustomSearch from './Forms/CustomSearch';
import EditFollowUp from './Forms/EditFollowUp';
import moneyBagIcon from '../../assets/moneybag.svg';
import salesFunnelIcon from '../../assets/salesfunnel.jpg';

const FollowUpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        overdue: true,
        dueToday: true,
        scheduled: true,
        noFollowup: true
    });
    const [selectedFollowUps, setSelectedFollowUps] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const menuRef = useRef(null);

    // Modal states
    const [showSearchFilterForm, setShowSearchFilterForm] = useState(false);
    const [showAddFollowUpForm, setShowAddFollowUpForm] = useState(false);
    const [showCustomDownloadForm, setShowCustomDownloadForm] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showEditFollowUpForm, setShowEditFollowUpForm] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedFollowUp, setSelectedFollowUp] = useState(null);

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

    // Settings options matching TaskHeader pattern
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

    // Filter and search followups
    const filteredFollowUps = useMemo(() => {
        return sampleFollowUps.filter(followUp => {
            // Apply status filters
            const statusMatch = filters[followUp.status];
            if (!statusMatch) return false;

            // Apply search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    followUp.followUpType.toLowerCase().includes(query) ||
                    followUp.relatedTo.toLowerCase().includes(query) ||
                    followUp.assignedTo.toLowerCase().includes(query) ||
                    followUp.contactNo.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [filters, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredFollowUps.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedFollowUps = filteredFollowUps.slice(startIndex, endIndex);

    const startEntry = filteredFollowUps.length > 0 ? startIndex + 1 : 0;
    const endEntry = Math.min(endIndex, filteredFollowUps.length);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle followup actions
    const handleFollowUpAction = (actionId, followUp) => {
        console.log('Action:', actionId, 'FollowUp:', followUp);

        if (actionId === 'view') {
            setSelectedFollowUp(followUp);
            setShowDetailModal(true);
        } else if (actionId === 'edit') {
            setSelectedFollowUp(followUp);
            setShowEditFollowUpForm(true);
        } else if (actionId === 'complete') {
            setSelectedFollowUp(followUp);
            // Handle completion logic
        } else if (actionId === 'comment') {
            setSelectedFollowUp(followUp);
            setShowCommentForm(true);
        }
        // Implement other action logic here
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container */}
            <div className="w-full">
                {/* Single Row Header: Filters | Search | Settings Menu + Gear */}
                <div className="px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Filters */}
                        <div className="flex items-center gap-2">
                            <FollowUpFilters
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>

                        {/* Right: Icons + View Toggle + Search + Settings Menu + Gear */}
                        <div className="flex items-center gap-3">
                            {/* Money Bag and Sales Funnel Icons - Show when settings menu is NOT open */}
                            {!showSettingsMenu && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors cursor-pointer">
                                            <img src={moneyBagIcon} alt="Money Bag" className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">0</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors cursor-pointer">
                                            <img src={salesFunnelIcon} alt="Sales Funnel" className="w-6 h-6 object-cover" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700">₹ 0</span>
                                    </div>
                                </>
                            )}

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'table'
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Table className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`p-2 rounded-md transition-all ${
                                        viewMode === 'calendar'
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <Calendar className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Search */}
                            {!showSettingsMenu && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search followups..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm"
                                    />
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            )}

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
                                                                    // Handle search action
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

                {/* FollowUp Table */}
                {viewMode === 'table' && (
                    <>
                        <FollowUpTable
                            followUps={paginatedFollowUps}
                            selectedFollowUps={selectedFollowUps}
                            setSelectedFollowUps={setSelectedFollowUps}
                            onFollowUpAction={handleFollowUpAction}
                        />

                        {/* Pagination */}
                        {filteredFollowUps.length > 0 && (
                            <FollowUpPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                totalEntries={filteredFollowUps.length}
                                startEntry={startEntry}
                                endEntry={endEntry}
                            />
                        )}
                    </>
                )}

                {/* Calendar View */}
                {viewMode === 'calendar' && (
                    <div className="p-8 h-[calc(100vh-120px)]">
                        <FollowUpCalendar
                            followUps={filteredFollowUps}
                            onFollowUpAction={handleFollowUpAction}
                        />
                    </div>
                )}

                {/* Empty State */}
                {filteredFollowUps.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No followups found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Filter Search Modal */}
            <PopUpModal
                isOpen={showSearchFilterForm}
                onClose={() => setShowSearchFilterForm(false)}
                title="Filter FollowUps"
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
                            Apply Filter
                        </Button>
                    </div>
                }
            >
                <FilterSearch />
            </PopUpModal>

            {/* Add FollowUp Modal */}
            <PopUpModal
                isOpen={showAddFollowUpForm}
                onClose={() => setShowAddFollowUpForm(false)}
                title="Add FollowUp"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddFollowUpForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddFollowUpForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <div className="p-4">
                    <p className="text-gray-600">Add FollowUp form will be implemented here</p>
                </div>
            </PopUpModal>

            {/* Edit FollowUp Modal */}
            <PopUpModal
                isOpen={showEditFollowUpForm}
                onClose={() => setShowEditFollowUpForm(false)}
                title="Edit FollowUp"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowEditFollowUpForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowEditFollowUpForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <EditFollowUp followUp={selectedFollowUp} />
            </PopUpModal>

            {/* Comment Modal */}
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
                <div className="p-4">
                    <p className="text-gray-600">Comment form will be implemented here</p>
                </div>
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

            {/* Follow-up Detail Modal */}
            <FollowUpDetailModal
                followUp={selectedFollowUp}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedFollowUp(null);
                }}
            />
        </div>
    );
};

export default FollowUpPage;
