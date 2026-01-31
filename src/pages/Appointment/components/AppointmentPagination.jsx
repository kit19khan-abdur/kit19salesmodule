import React from 'react';
import clsx from 'clsx';

const AppointmentPagination = ({ currentPage, totalPages, onPageChange, totalEntries, startEntry, endEntry }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="px-8 pb-6">
            <div className="flex items-center justify-between">
                {/* Left side - Entry count */}
                <div className="text-sm text-gray-600">
                    Showing {startEntry} to {endEntry} of {totalEntries.toLocaleString()} entries
                </div>

                {/* Right side - Pagination controls */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={clsx(
                            'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        )}
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={clsx(
                                    'min-w-[40px] px-3 py-2 rounded-lg font-medium text-sm transition-all',
                                    page === currentPage
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                )}
                            >
                                {page}
                            </button>
                        ))}
                        
                        {/* Show ellipsis and last page if needed */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                                <span className="px-2 text-gray-400">...</span>
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="min-w-[40px] px-3 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={clsx(
                            'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                            currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        )}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentPagination;
