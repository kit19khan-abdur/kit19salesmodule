import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === 1
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
            >
                1
            </button>

            <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === 2
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
            >
                2
            </button>

            <button
                onClick={() => setCurrentPage(3)}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentPage === 3
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
            >
                3
            </button>

            <span className="px-3 py-2 text-gray-500">...</span>

            <button
                onClick={() => setCurrentPage(5704)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
                5,704
            </button>

            <button
                onClick={() => setCurrentPage(Math.min(5704, currentPage + 1))}
                disabled={currentPage === 5704}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
                Next
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
