import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AppointmentPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const [showPageSelect, setShowPageSelect] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPageSelect(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4, 5];
  };

  const getAllPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="fixed bottom-0 right-0 bg-white rounded-[10px] px-4 py-2 shadow z-10">
      <div className="flex items-center justify-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            <span className="hidden sm:inline">Previous</span>
          </div>
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-7 h-7 rounded-md border text-xs font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Ellipsis with Dropdown */}
        {totalPages > 5 && (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowPageSelect(!showPageSelect)}
                className="w-7 h-7 rounded-md border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                •••
              </button>

              {/* Page Selection Dropdown */}
              {showPageSelect && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-1 max-h-40 overflow-y-auto min-w-[40px]">
                  <div className="grid grid-cols-1 gap-0.5">
                    {getAllPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          handlePageChange(page);
                          setShowPageSelect(false);
                        }}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`w-7 h-7 rounded-md border text-xs font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md border border-gray-300 text-gray-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default AppointmentPagination;
