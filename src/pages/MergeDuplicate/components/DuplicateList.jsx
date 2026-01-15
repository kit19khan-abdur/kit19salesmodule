import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DuplicateCard from './DuplicateCard';

/**
 * DuplicateList Component
 * Left panel showing list of duplicate groups with pagination
 */
const DuplicateList = ({ 
  duplicates, 
  selectedRecord, 
  onSelectRecord,
  currentPage,
  totalPages,
  onPageChange 
}) => (
  <div className="col-span-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-semibold text-gray-800">Duplicate Groups</h2>
        <p className="text-xs text-gray-500 mt-0.5">Select a group to view and merge</p>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-[calc(100vh-420px)] overflow-y-auto">
        {duplicates.map(record => (
          <DuplicateCard
            key={record.id}
            record={record}
            isSelected={selectedRecord?.id === record.id}
            onClick={() => onSelectRecord(record)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => onPageChange(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <FiChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Next
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default DuplicateList;
