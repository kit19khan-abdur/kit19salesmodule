import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, X, Filter, TrendingUp, Cloud, Cog, FunnelPlus, Plus, CloudDownload, HardDriveUpload, HardDriveUploadIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskHeader = ({ searchQuery, setSearchQuery, totalTasks }) => {
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setShowSettings(false);
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
                                className={`flex items-center gap-2 px-3 py-3 rounded-full transition-all font-medium ${
                                    showSettings 
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
                                                {/* Close */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setShowSettings(false)}
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
                                                    onClick={() => setShowSettings(false)}
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
                                                    onClick={() => setShowSettings(false)}
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
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TaskHeader;
