import React from 'react';
import { taskStatusConfig } from '../constants';

const TaskFilters = ({ filters, setFilters, totalCounts }) => {
    const handleFilterChange = (filterKey) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    const handleShowAll = () => {
        const allSelected = filters.open && filters.overdue && filters.completed;
        setFilters({
            open: !allSelected,
            overdue: !allSelected,
            completed: !allSelected
        });
    };

    return (
        <div className="px-8 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-6">
                {/* Open Filter */}
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.open}
                        onChange={() => handleFilterChange('open')}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                    />
                    <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                        filters.open ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                        <taskStatusConfig.open.icon className={`w-5 h-5 ${taskStatusConfig.open.color}`} />
                        Open
                    </span>
                </label>

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
                        <taskStatusConfig.overdue.icon className={`w-5 h-5 ${taskStatusConfig.overdue.color}`} />
                        Overdue
                    </span>
                </label>

                {/* Completed Filter */}
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={filters.completed}
                        onChange={() => handleFilterChange('completed')}
                        className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                    />
                    <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                        filters.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                        <taskStatusConfig.completed.icon className={`w-5 h-5 ${taskStatusConfig.completed.color}`} />
                        Completed
                    </span>
                </label>

                {/* Show All */}
                <button
                    onClick={handleShowAll}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    Show All
                </button>
            </div>
        </div>
    );
};

export default TaskFilters;
