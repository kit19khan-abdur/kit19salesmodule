import React from 'react';
import { Search, Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const SegmentationHeader = ({ 
    searchQuery, 
    setSearchQuery,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    statusFilter,
    setStatusFilter,
    totalEntries,
    showingStart,
    showingEnd,
    onCreateSegment
}) => {
    return (
        <div className="mb-6">
            {/* Page Title */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#02ba71] to-[#02ba5e] bg-clip-text text-transparent">
                        Criteria List
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and organize your segmentation criteria</p>
                </div>
                
                {/* Create New Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCreateSegment}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Create New
                </motion.button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    {/* Search Input */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-2">Search Name</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search criteria..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* From Date */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-2">From Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* To Date */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-2">To Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    value="all"
                                    checked={statusFilter === 'all'}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                    All
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    value="active"
                                    checked={statusFilter === 'active'}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                    Active
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="statusFilter"
                                    value="inactive"
                                    checked={statusFilter === 'inactive'}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                    Inactive
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-1">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center"
                        >
                            <Search className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{showingStart}</span> to{' '}
                        <span className="font-semibold text-gray-900">{showingEnd}</span> of{' '}
                        <span className="font-semibold text-gray-900">{totalEntries}</span> criteria
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SegmentationHeader;
