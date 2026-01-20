import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FollowupPagination = ({ currentPage, setCurrentPage, totalPages }) => {
    return (
        <>
            {/* Fixed Floating Pagination */}
            <div className="fixed bottom-[3px] -right-[22%] -translate-x-1/2 z-50">
                <div className="flex items-center gap-3 px-1 py-2 bg-[#f5f5f5] border-[#d8d7d7] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border">
                    {/* Previous Button */}
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border-1 border-dashed font-medium transition-all uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 bg-white text-[#00BFA6] border-[#00BFA6] hover:bg-[#00BFA6] hover:text-white shadow-md"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg border-2 border-dashed font-medium transition-all uppercase tracking-wider text-sm shadow-md ${currentPage === page
                                        ? 'bg-white text-[#00BFA6] border-[#00BFA6]'
                                        : 'bg-[#00BFA6] text-white border-[#00BFA6] hover:bg-white hover:text-[#00BFA6]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="px-1 text-gray-400 font-medium">•••</span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="min-w-[3.5rem] px-4 py-2 rounded-lg border-2 border-dashed font-medium transition-all uppercase tracking-wider text-sm shadow-md bg-[#00BFA6] text-white border-[#00BFA6] hover:bg-white hover:text-[#00BFA6]"
                        >
                            {totalPages.toLocaleString()}
                        </button>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border-2 border-dashed font-medium transition-all uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 bg-white text-[#00BFA6] border-[#00BFA6] hover:bg-[#00BFA6] hover:text-white shadow-md"
                    >
                        Next
                    </button>

                    {/* Page Info Badge */}
                    <div className="ml-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">
                            Page <span className="text-[#00BFA6] font-bold">{currentPage}</span> / {totalPages.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind floating pagination */}
            <div className="h-24" />
        </>
    );
};

export default FollowupPagination;
