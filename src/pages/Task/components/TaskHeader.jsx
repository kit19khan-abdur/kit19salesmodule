import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, X, Filter, TrendingUp, Cloud, Cog, FunnelPlus, Plus, CloudDownload, HardDriveUpload, HardDriveUploadIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PopUpModal from '../../../components/PopUpModal/PopUpModal';
import Button from '../../../components/common/Button';
import FilterSearch from '../Forms/FilterSearch';
import AddNewTask from '../Forms/AddNewTask';
import CustomSearch from '../Forms/CustomSearch';

const TaskHeader = ({ searchQuery, setSearchQuery, totalTasks }) => {
    const [showSettings, setShowSettings] = useState(false);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All Leads');
    const [filterSearchQuery, setFilterSearchQuery] = useState('');
    const settingsRef = useRef(null);
    const filterPanelRef = useRef(null);

    const [showSearchFilterForm, setShowSearchFilterForm] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [showCustomDownloadForm, setShowCustomDownloadForm] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setShowSettings(false);
            }
            if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
                setShowFilterPanel(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tasks/Days
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage and track all your tasks
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-72 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        {/* Settings Button with Dropdown */}
                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`flex items-center gap-2 px-3 py-3 rounded-full transition-all font-medium ${showSettings
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                <Cog className={`w-5 h-5 ${showSettings ? 'rotate-90' : 'animate-spin'} transition-transform duration-300`} />
                            </button>

                            {/* Settings Dropdown Panel */}
                            <AnimatePresence>
                                {showSettings && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                                    >
                                        {/* Header */}
                                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">Quick Actions</h3>
                                                <button
                                                    onClick={() => setShowSettings(false)}
                                                    className="p-1.5 rounded-lg hover:bg-white/80 transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-5 gap-3">
                                                {/* FunnelPlus - Filter Panel */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setShowFilterPanel(!showFilterPanel);
                                                        setShowSettings(false);
                                                    }}
                                                    title='Add Filter'
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl  transition-colors group"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                                                        <FunnelPlus className="w-5 h-5 text-gray-700" />
                                                    </div>
                                                    {/* <span className="text-xs font-medium text-gray-700">Close</span> */}
                                                </motion.button>

                                                {/* Filter */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setShowSearchFilterForm(true);
                                                        setShowSettings(false)
                                                    }}
                                                    title='Add Filter'
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl  transition-colors group"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white border border-orange-200 flex items-center justify-center group-hover:border-orange-300 transition-colors">
                                                        <Filter className="w-5 h-5 text-orange-500" />
                                                    </div>
                                                    {/* <span className="text-xs font-medium text-gray-700">Filter</span> */}
                                                </motion.button>

                                                {/* Analytics */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setShowAddTaskForm(true);
                                                        setShowSettings(false)
                                                    }}
                                                    title='Add Task'
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl  transition-colors group"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white border border-teal-200 flex items-center justify-center group-hover:border-teal-300 transition-colors">
                                                        <Plus className="w-5 h-5 text-teal-500" />
                                                    </div>
                                                    {/* <span className="text-xs font-medium text-gray-700">Analytics</span> */}
                                                </motion.button>

                                                {/* Export */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setShowSettings(false)}
                                                    title='Export Data'
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl  transition-colors group"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white border border-blue-200 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                                                        <HardDriveUpload className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    {/* <span className="text-xs font-medium text-gray-700">Export</span> */}
                                                </motion.button>

                                                {/* Settings */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setShowCustomDownloadForm(true);
                                                        setShowSettings(false)
                                                    }}
                                                    title='Custom Download'
                                                    className="flex flex-col items-center gap-2 p-4 rounded-xl  transition-colors group"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                                                        <CloudDownload className="w-5 h-5 text-gray-700" />
                                                    </div>
                                                    {/* <span className="text-xs font-medium text-gray-700">Custom Download</span> */}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Filter Panel Dropdown */}
                        <div className="relative" ref={filterPanelRef}>
                            <AnimatePresence>
                                {showFilterPanel && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="fixed top-20 right-8 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                                    >
                                        {/* Header */}
                                        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-gray-900">Filter Tasks</h3>
                                                <button
                                                    onClick={() => setShowFilterPanel(false)}
                                                    className="p-1.5 rounded-lg hover:bg-white/80 transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Filter Options */}
                                        <div className="p-6 space-y-4">
                                            {/* Dropdown */}
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select Filter
                                                </label>
                                                <div className="flex items-center">
                                                    <select
                                                        value={selectedFilter}
                                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                                                        style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'right 0.75rem center',
                                                            backgroundSize: '1.5rem',
                                                            paddingRight: '2.5rem'
                                                        }}
                                                    >
                                                        <option value="All Leads">All Leads</option>
                                                        <option value="My Tasks">My Tasks</option>
                                                        <option value="Team Tasks">Team Tasks</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Overdue">Overdue</option>
                                                        <option value="Today">Today</option>
                                                        <option value="This Week">This Week</option>
                                                        <option value="This Month">This Month</option>
                                                    </select>
                                                    <button
                                                        onClick={() => {
                                                            // quick-search trigger (optional)
                                                            console.log('Quick search for', selectedFilter);
                                                        }}
                                                        aria-label="Search filter"
                                                        className="w-11 h-11 rounded-lg bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                                                    >
                                                        <Search className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

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

            <PopUpModal
                isOpen={showAddTaskForm}
                onClose={() => setShowAddTaskForm(false)}
                title="Add Task"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddTaskForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddTaskForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddNewTask />
            </PopUpModal>

            <PopUpModal
                isOpen={showCustomDownloadForm}
                onClose={() => setShowCustomDownloadForm(false)}
                title="Custom Download"
                size="md"
            >
                <CustomSearch />
            </PopUpModal>

        </header>
    );
};

export default TaskHeader;
