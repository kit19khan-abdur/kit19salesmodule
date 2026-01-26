import React from 'react';
import { Search, Settings } from 'lucide-react';

const AppointmentHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments by title, location, or related to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-500 transition-all"
          />
        </div>

        {/* Settings Button */}
        <button className="ml-4 p-2.5 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AppointmentHeader;
