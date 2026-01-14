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
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="font-medium">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl font-semibold transition-all hover:scale-110 active:scale-95 ${
                                    currentPage === page
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/40'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="px-1 text-gray-400 font-medium">•••</span>
                        <button 
                            onClick={() => setCurrentPage(totalPages)}
                            className="min-w-[3.5rem] h-10 px-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-all hover:scale-105 active:scale-95"
                        >
                            {totalPages.toLocaleString()}
                        </button>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="font-medium">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Page Info Badge */}
                    <div className="ml-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">
                            Page <span className="text-violet-600 font-bold">{currentPage}</span> / {totalPages.toLocaleString()}
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
