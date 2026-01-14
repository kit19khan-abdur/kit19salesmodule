import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import {
    StatCard,
    FollowupCard,
    FollowupHeader,
    FollowupToolbar,
    FollowupPagination
} from './components';

// Constants
import { statusConfig, sampleFollowups } from './constants';

// Main Component
const FollowUpPage = () => {
    const [activeFilters, setActiveFilters] = useState(['overdue', 'dueToday', 'scheduled', 'noFollowup']); // Array of active filters
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    
    const itemsPerPage = 8;
    const totalRecords = 57;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // Calculate stats
    const stats = {
        overdue: sampleFollowups.filter(f => f.status === 'overdue').length,
        dueToday: sampleFollowups.filter(f => f.status === 'dueToday').length,
        scheduled: sampleFollowups.filter(f => f.status === 'scheduled').length,
        noFollowup: sampleFollowups.filter(f => f.status === 'noFollowup').length,
    };

    // Filter followups based on active filters and search
    const filteredFollowups = sampleFollowups.filter(f => {
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(f.status);
        const matchesSearch = searchQuery === '' || 
            f.relatedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Handle action click
    const handleAction = (actionId, followup) => {
        console.log(`Action: ${actionId}`, followup);
        // Handle different actions here
    };

    // Handle filter click - toggle filter in array
    const handleFilterClick = (key) => {
        setActiveFilters(prev => {
            if (prev.includes(key)) {
                // Remove filter
                return prev.filter(f => f !== key);
            } else {
                // Add filter
                return [...prev, key];
            }
        });
    };

    // Check if all filters are active
    const allFiltersActive = activeFilters.length === 4;

    // Toggle all filters
    const handleAllFiltersClick = () => {
        if (allFiltersActive) {
            setActiveFilters([]);
        } else {
            setActiveFilters(['overdue', 'dueToday', 'scheduled', 'noFollowup']);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar Accent */}
            <div className="fixed left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600 via-purple-600 to-fuchsia-600" />

            {/* Main Container */}
            <div className="">
                {/* Header */}
                <FollowupHeader 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                />

                {/* Content */}
                <main className="py-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <StatCard
                                key={key}
                                config={config}
                                count={stats[key]}
                                isActive={activeFilters.includes(key)}
                                onClick={() => handleFilterClick(key)}
                            />
                        ))}
                    </div>

                    {/* Toolbar */}
                    <FollowupToolbar
                        activeFilters={activeFilters}
                        setActiveFilters={setActiveFilters}
                        allFiltersActive={allFiltersActive}
                        onAllFiltersClick={handleAllFiltersClick}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        filteredCount={filteredFollowups.length}
                        totalRecords={totalRecords}
                    />

                    {/* Cards Grid */}
                    {activeFilters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-6">
                                <svg className="w-12 h-12 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Filter Selected</h3>
                            <p className="text-gray-500 mb-6">Please select at least one filter to view follow-ups</p>
                            <button
                                onClick={handleAllFiltersClick}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                            >
                                Show All Follow-ups
                            </button>
                        </div>
                    ) : (
                        <>
                            <motion.div 
                                layout
                                className={viewMode === 'grid' ? 'grid grid-cols-4 gap-5' : 'flex flex-col gap-3'}
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredFollowups.map((followup) => (
                                        <FollowupCard
                                            key={followup.id}
                                            followup={followup}
                                            onAction={handleAction}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* Empty State - No Results */}
                            {filteredFollowups.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No follow-ups found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredFollowups.length > 0 && (
                                <FollowupPagination
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPages={totalPages}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default FollowUpPage;
