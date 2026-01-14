import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const FollowupToolbar = ({ 
    activeFilter, 
    setActiveFilter, 
    viewMode, 
    setViewMode, 
    filteredCount, 
    totalRecords 
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                        activeFilter === 'all'
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                    All Follow-ups
                </button>
                <span className="text-sm text-gray-500">
                    Showing <strong className="text-gray-900">{filteredCount}</strong> of <strong className="text-gray-900">{totalRecords.toLocaleString()}</strong>
                </span>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                </button>
                <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
                            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FollowupToolbar;
