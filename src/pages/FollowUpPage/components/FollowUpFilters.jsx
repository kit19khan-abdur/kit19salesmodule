import React from 'react';
import { followUpStatusConfig } from '../constants';

const FollowUpFilters = ({ filters, setFilters }) => {
    const handleFilterChange = (filterKey) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    const handleShowAll = () => {
        const allSelected = filters.overdue && filters.dueToday && filters.scheduled && filters.noFollowup;
        setFilters({
            overdue: !allSelected,
            dueToday: !allSelected,
            scheduled: !allSelected,
            noFollowup: !allSelected
        });
    };

    return (
        <div className="flex items-center gap-6">
            {/* Overdue Filter */}
            <label className="flex items-center gap-2 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={filters.overdue}
                    onChange={() => handleFilterChange('overdue')}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    filters.overdue ? 'text-gray-900' : 'text-gray-500'
                }`}>
                    <followUpStatusConfig.overdue.icon className={`w-5 h-5 ${followUpStatusConfig.overdue.color}`} />
                    Overdue
                </span>
            </label>

            {/* Due Today Filter */}
            <label className="flex items-center gap-2 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={filters.dueToday}
                    onChange={() => handleFilterChange('dueToday')}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    filters.dueToday ? 'text-gray-900' : 'text-gray-500'
                }`}>
                    <followUpStatusConfig.dueToday.icon className={`w-5 h-5 ${followUpStatusConfig.dueToday.color}`} />
                    Due Today
                </span>
            </label>

            {/* Scheduled Filter */}
            <label className="flex items-center gap-2 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={filters.scheduled}
                    onChange={() => handleFilterChange('scheduled')}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    filters.scheduled ? 'text-gray-900' : 'text-gray-500'
                }`}>
                    <followUpStatusConfig.scheduled.icon className={`w-5 h-5 ${followUpStatusConfig.scheduled.color}`} />
                    Scheduled
                </span>
            </label>

            {/* No Followup Filter */}
            <label className="flex items-center gap-2 cursor-pointer group">
                <input
                    type="checkbox"
                    checked={filters.noFollowup}
                    onChange={() => handleFilterChange('noFollowup')}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                />
                <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    filters.noFollowup ? 'text-gray-900' : 'text-gray-500'
                }`}>
                    <followUpStatusConfig.noFollowup.icon className={`w-5 h-5 ${followUpStatusConfig.noFollowup.color}`} />
                    No Followup
                </span>
            </label>

            {/* Show All */}
            <button
                onClick={handleShowAll}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
                {(filters.overdue && filters.dueToday && filters.scheduled && filters.noFollowup) ? 'Hide All' : 'Show All'}
            </button>
        </div>
    );
};

export default FollowUpFilters;
