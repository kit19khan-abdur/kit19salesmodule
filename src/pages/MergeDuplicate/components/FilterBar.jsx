import React from 'react';
import { FiSearch, FiPhone, FiMail } from 'react-icons/fi';
import ToggleSwitch from './ToggleSwitch';

/**
 * FilterBar Component
 * Filter controls and search input
 */
const FilterBar = ({ 
  filterType, 
  onFilterTypeChange, 
  searchQuery, 
  onSearchChange,
  resultCount,
  totalCount 
}) => (
  <div className="px-8 pb-4">
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <ToggleSwitch
          options={[
            { value: 'mobile', label: 'Mobile', icon: FiPhone },
            { value: 'email', label: 'Email', icon: FiMail }
          ]}
          value={filterType}
          onChange={onFilterTypeChange}
        />
        
        <div className="h-8 w-px bg-gray-200" />
        
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search duplicates..."
            className="pl-10 pr-4 py-2.5 w-80 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Showing {resultCount} of {totalCount}</span>
      </div>
    </div>
  </div>
);

export default FilterBar;
