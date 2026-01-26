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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl border-2 border-dashed border-purple-500 text-purple-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 hover:text-white transition-all"
        >
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            PREVIOUS
          </div>
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-xl border-2 border-dashed font-medium transition-all ${
              currentPage === page
                ? 'bg-purple-500 border-purple-500 text-white'
                : 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
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
                className="w-10 h-10 rounded-xl border-2 border-dashed border-purple-500 text-purple-500 font-bold hover:bg-purple-500 hover:text-white transition-all"
              >
                •••
              </button>

              {/* Page Selection Dropdown */}
              {showPageSelect && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-xl p-2 max-h-64 overflow-y-auto min-w-[100px]">
                  <div className="grid grid-cols-5 gap-1">
                    {getAllPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          handlePageChange(page);
                          setShowPageSelect(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-purple-500 text-white'
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
              className={`w-10 h-10 rounded-xl border-2 border-dashed font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-purple-500 border-purple-500 text-white'
                  : 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
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
          className="px-4 py-2 rounded-xl border-2 border-dashed border-purple-500 text-purple-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 hover:text-white transition-all"
        >
          <div className="flex items-center gap-1">
            NEXT
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default AppointmentPagination;
