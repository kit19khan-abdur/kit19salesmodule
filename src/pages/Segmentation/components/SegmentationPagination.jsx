import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SegmentationPagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);
        
        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="mt-6 flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
            <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalPages}</span>
                </p>
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border transition-all ${
                        currentPage === 1
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                    <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] h-10 rounded-xl font-medium text-sm transition-all ${
                            currentPage === page
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        {page}
                    </motion.button>
                ))}

                {/* Next Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border transition-all ${
                        currentPage === totalPages
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    );
};

export default SegmentationPagination;
