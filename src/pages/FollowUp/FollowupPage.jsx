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
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    
    const itemsPerPage = 8;
    const totalRecords = 570373;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // Calculate stats
    const stats = {
        overdue: sampleFollowups.filter(f => f.status === 'overdue').length,
        dueToday: sampleFollowups.filter(f => f.status === 'dueToday').length,
        scheduled: sampleFollowups.filter(f => f.status === 'scheduled').length,
        noFollowup: sampleFollowups.filter(f => f.status === 'noFollowup').length,
    };

    // Filter followups based on active filter and search
    const filteredFollowups = sampleFollowups.filter(f => {
        const matchesFilter = activeFilter === 'all' || f.status === activeFilter;
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

    // Handle filter click
    const handleFilterClick = (key) => {
        setActiveFilter(activeFilter === key ? 'all' : key);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar Accent */}
            <div className="fixed left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-600 via-purple-600 to-fuchsia-600" />

            {/* Main Container */}
            <div className="pl-4">
                {/* Header */}
                <FollowupHeader 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                />

                {/* Content */}
                <main className="px-8 py-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-5 mb-8">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <StatCard
                                key={key}
                                config={config}
                                count={stats[key]}
                                isActive={activeFilter === key}
                                onClick={() => handleFilterClick(key)}
                            />
                        ))}
                    </div>

                    {/* Toolbar */}
                    <FollowupToolbar
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        filteredCount={filteredFollowups.length}
                        totalRecords={totalRecords}
                    />

                    {/* Cards Grid */}
                    <motion.div 
                        layout
                        className={viewMode === 'grid' ? 'grid grid-cols-4 gap-5' : 'space-y-4'}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredFollowups.map((followup) => (
                                <FollowupCard
                                    key={followup.id}
                                    followup={followup}
                                    onAction={handleAction}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
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
                </main>
            </div>
        </div>
    );
};

export default FollowUpPage;
