import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FollowupPagination = ({ currentPage, setCurrentPage, totalPages }) => {
    const [showPagePopup, setShowPagePopup] = useState(false);
    const ellipsisRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showPagePopup) {
                const popupBox = document.getElementById('page-popup-box');
                const ellipsisElement = ellipsisRef.current;
                
                if (popupBox && !popupBox.contains(event.target) && 
                    ellipsisElement && !ellipsisElement.contains(event.target)) {
                    setShowPagePopup(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showPagePopup]);

    const getAllPageNumbers = () => {
        const allPages = [];
        for (let i = 1; i <= totalPages; i++) {
            allPages.push(i);
        }
        return allPages;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getVisiblePages = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        // If we have 5 or fewer pages, show all
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }
        
        // Otherwise show first 5 pages
        for (let i = 1; i <= maxVisiblePages; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <>
            {/* Fixed Floating Pagination */}
            <div className="fixed bottom-[3px] -right-[10%] -translate-x-1/2 z-50">
                <div className="flex items-center gap-3 px-2 py-2 bg-[#f5f5f5] border-[#d8d7d7] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 border">
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
                        {getVisiblePages().map(page => (
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
                        
                        {totalPages > 5 && (
                            <>
                                <span 
                                    ref={ellipsisRef}
                                    className="px-1 text-gray-400 font-medium cursor-pointer relative"
                                    onClick={() => setShowPagePopup(!showPagePopup)}
                                >
                                    •••
                                    {showPagePopup && (
                                        <div
                                            id="page-popup-box"
                                            style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '50px', maxHeight: '150px', overflowY: 'auto', padding: 0 }}
                                            className="bg-white border border-gray-300 rounded shadow-lg flex flex-col"
                                        >
                                            {getAllPageNumbers().map(pageNum => (
                                                <button
                                                    key={pageNum}
                                                    onMouseDown={e => e.preventDefault()}
                                                    onClick={() => {
                                                        setShowPagePopup(false);
                                                        setTimeout(() => handlePageChange(pageNum), 0);
                                                    }}
                                                    className={`w-full h-8 text-center rounded text-sm font-medium transition ${currentPage === pageNum
                                                        ? 'bg-[#00BFA6] text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    style={{ minWidth: '32px', padding: 0 }}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`min-w-[3.5rem] px-4 py-2 rounded-lg border-2 border-dashed font-medium transition-all uppercase tracking-wider text-sm shadow-md ${currentPage === totalPages
                                        ? 'bg-white text-[#00BFA6] border-[#00BFA6]'
                                        : 'bg-[#00BFA6] text-white border-[#00BFA6] hover:bg-white hover:text-[#00BFA6]'
                                    }`}
                                >
                                    {totalPages.toLocaleString()}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border-1 border-dashed font-medium transition-all uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 bg-white text-[#00BFA6] border-[#00BFA6] hover:bg-[#00BFA6] hover:text-white shadow-md"
                    >
                        Next
                    </button>

                    {/* Page Info Badge */}
                    {/* <div className="ml-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">
                            Page <span className="text-[#00BFA6] font-bold">{currentPage}</span> / {totalPages.toLocaleString()}
                        </span>
                    </div> */}
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind floating pagination */}
            <div className="h-24" />
        </>
    );
};

export default FollowupPagination;
