import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConversionPagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-1 right-0 -translate-x-1/2 z-50"
            >
                <div className="bg-[#f5f5f5] border-[#d8d7d7] backdrop-blur-xl rounded-2xl border shadow-2xl shadow-indigo-500/20 px-6 py-4">
                    <div className="flex items-center gap-3">
                        {/* Page Info */}
                        <div className="text-sm text-gray-600 font-medium px-3">
                            <span className="text-indigo-600 font-bold">{currentPage}</span> / {totalPages}
                        </div>

                        <div className="w-px h-8 bg-gray-200" />

                        {/* First Page */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
                        >
                            <ChevronsLeft className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>

                        {/* Previous Page */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>

                        <div className="w-px h-8 bg-gray-200" />

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5">
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400 text-sm">
                                        •••
                                    </span>
                                ) : (
                                    <motion.button
                                        key={page}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onPageChange(page)}
                                        className={`min-w-[36px] h-[36px] rounded-xl text-sm font-semibold transition-all ${
                                            currentPage === page
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {page}
                                    </motion.button>
                                )
                            ))}
                        </div>

                        <div className="w-px h-8 bg-gray-200" />

                        {/* Next Page */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>

                        {/* Last Page */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
                        >
                            <ChevronsRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConversionPagination;
