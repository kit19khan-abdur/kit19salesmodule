import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

// Components
import {
    SegmentationHeader,
    SegmentationTable,
    SegmentationPagination
} from './components';

// Constants
import { sampleSegments } from './constants';

const Segmentation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [segments, setSegments] = useState(sampleSegments);
    
    const itemsPerPage = 10;

    // Filter segments based on search query, date range, and status
    const filteredSegments = useMemo(() => {
        return segments.filter(segment => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                segment.searchName.toLowerCase().includes(searchLower) ||
                segment.criteria.toLowerCase().includes(searchLower) ||
                segment.createdBy.toLowerCase().includes(searchLower);
            
            const matchesStatus = 
                statusFilter === 'all' || segment.status === statusFilter;
            
            // Date filtering logic (if dates are set)
            let matchesDate = true;
            if (fromDate || toDate) {
                const segmentDate = new Date(segment.createdOn);
                if (fromDate) {
                    const from = new Date(fromDate);
                    matchesDate = matchesDate && segmentDate >= from;
                }
                if (toDate) {
                    const to = new Date(toDate);
                    matchesDate = matchesDate && segmentDate <= to;
                }
            }
            
            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [segments, searchQuery, statusFilter, fromDate, toDate]);

    // Sort segments
    const sortedSegments = useMemo(() => {
        let sorted = [...filteredSegments];
        
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                
                const aStr = String(aVal || '').toLowerCase();
                const bStr = String(bVal || '').toLowerCase();
                
                if (sortConfig.direction === 'asc') {
                    return aStr.localeCompare(bStr);
                } else {
                    return bStr.localeCompare(aStr);
                }
            });
        }
        
        return sorted;
    }, [filteredSegments, sortConfig]);

    // Paginate segments
    const paginatedSegments = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedSegments.slice(startIndex, endIndex);
    }, [sortedSegments, currentPage]);

    const totalPages = Math.ceil(sortedSegments.length / itemsPerPage);
    const showingStart = sortedSegments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const showingEnd = Math.min(currentPage * itemsPerPage, sortedSegments.length);

    // Handle create new segment
    const handleCreateSegment = () => {
        toast.success('Create new criteria functionality will be implemented here');
        console.log('Create new segment');
    };

    // Handle view segment
    const handleView = (segment) => {
        toast.success(`Viewing: ${segment.searchName}`);
        console.log('View segment:', segment);
    };

    // Handle edit segment
    const handleEdit = (segment) => {
        toast.success(`Editing: ${segment.searchName}`);
        console.log('Edit segment:', segment);
    };

    // Handle delete segment
    const handleDelete = (segment) => {
        if (window.confirm(`Are you sure you want to delete "${segment.searchName}"?`)) {
            setSegments(prev => prev.filter(s => s.id !== segment.id));
            toast.success('Criteria deleted successfully');
        }
    };

    // Handle toggle status
    const handleToggleStatus = async (segmentId) => {
        setSegments(prev => 
            prev.map(segment => 
                segment.id === segmentId 
                    ? { ...segment, status: segment.status === 'active' ? 'inactive' : 'active' }
                    : segment
            )
        );
        
        const updatedSegment = segments.find(s => s.id === segmentId);
        const newStatus = updatedSegment.status === 'active' ? 'inactive' : 'active';
        toast.success(`Status updated to ${newStatus}`);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle sort
    const handleSort = (config) => {
        setSortConfig(config);
        setCurrentPage(1); // Reset to first page when sorting
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
            {/* Toast Notifications */}
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Sidebar Accent */}
            <div className="fixed left-0 -top-[4px] bottom-0 w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600" />

            {/* Main Container */}
            <div className="p-6 lg:p-8 pb-32">
                {/* Header */}
                <SegmentationHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    totalEntries={sortedSegments.length}
                    showingStart={showingStart}
                    showingEnd={showingEnd}
                    onCreateSegment={handleCreateSegment}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Criteria</p>
                                <p className="text-3xl font-bold text-gray-900">{segments.length}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Active Criteria</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {segments.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Contacts</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {segments.reduce((sum, s) => sum + s.count, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Avg per Criteria</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {Math.round(segments.reduce((sum, s) => sum + s.count, 0) / segments.length).toLocaleString()}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Table */}
                <SegmentationTable
                    segments={paginatedSegments}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <SegmentationPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Segmentation;
