import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

const AppointmentToolbar = ({ viewMode, setViewMode, showAllButton, onShowAllClick }) => {
  return (
    <div className="flex items-center gap-4">
      {/* Show All / Remove All Button */}
      {showAllButton && (
        <button
          onClick={onShowAllClick}
          className="px-5 py-2.5 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all shadow-sm"
        >
          Show All Appointments
        </button>
      )}

      {/* View Mode Toggle */}
      <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'grid' 
              ? 'bg-purple-50 text-purple-500' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list' 
              ? 'bg-purple-50 text-purple-500' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AppointmentToolbar;
