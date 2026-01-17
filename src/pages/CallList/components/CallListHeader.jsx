import React from 'react';
import { Filter, Download, Upload, RefreshCw, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const CallListHeader = ({ 
    totalContacts, 
    currentPage, 
    totalPages, 
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    onToggleSidebar 
}) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Call List Manager
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and track your calls efficiently</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Filter"
                    >
                        <Filter className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Import"
                    >
                        <Upload className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                        title="Export"
                    >
                        <Download className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                        title="Refresh"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Stats and Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100">
                        <span className="text-sm text-gray-600">Total Contacts: </span>
                        <span className="text-sm font-bold text-blue-600">{totalContacts}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600">per page</span>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ← Previous
                    </button>
                    <div className="flex items-center gap-1">
                        <span className="px-3 py-1.5 text-sm text-gray-600">
                            Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                            <span className="font-semibold text-gray-900">{totalPages}</span>
                        </span>
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallListHeader;
