import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

// Components
import {
    ConversionHeader,
    ConversionTable,
    ConversionPagination
} from './components';

// Constants
import { sampleConversions } from './constants';

const Conversion = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [conversionType, setConversionType] = useState('consolidated');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showFilters, setShowFilters] = useState(false);
    
    const itemsPerPage = 5;

    // Filter conversions based on search query
    const filteredConversions = useMemo(() => {
        return sampleConversions.filter(conversion => {
            const searchLower = searchQuery.toLowerCase();
            return (
                conversion.leadNo.toLowerCase().includes(searchLower) ||
                conversion.name.toLowerCase().includes(searchLower) ||
                conversion.mobile.toLowerCase().includes(searchLower) ||
                conversion.email.toLowerCase().includes(searchLower) ||
                conversion.companyName.toLowerCase().includes(searchLower)
            );
        });
    }, [searchQuery]);

    // Sort conversions
    const sortedConversions = useMemo(() => {
        let sorted = [...filteredConversions];
        
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
    }, [filteredConversions, sortConfig]);

    // Paginate conversions
    const paginatedConversions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedConversions.slice(startIndex, endIndex);
    }, [sortedConversions, currentPage]);

    const totalPages = Math.ceil(sortedConversions.length / itemsPerPage);
    const showingStart = sortedConversions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const showingEnd = Math.min(currentPage * itemsPerPage, sortedConversions.length);

    // Handle export
    const handleExport = () => {
        console.log('Export conversions', conversionType);
        // Implement export functionality here
        alert('Export functionality will be implemented here');
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
            {/* Sidebar Accent */}
            <div className="fixed left-0 -top-[4px] bottom-0 w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600" />

            {/* Main Container */}
            <div className="p-6 lg:p-8 pb-32">
                {/* Header */}
                <ConversionHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    conversionType={conversionType}
                    setConversionType={setConversionType}
                    onExport={handleExport}
                    totalEntries={sortedConversions.length}
                    showingStart={showingStart}
                    showingEnd={showingEnd}
                />

                {/* Stats Cards - Optional */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Conversions</p>
                                <p className="text-3xl font-bold text-gray-900">{sampleConversions.length}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {sampleConversions.reduce((sum, c) => sum + c.totalOrders, 0)}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
                                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{(sampleConversions.reduce((sum, c) => sum + c.totalBusiness, 0) / 100000).toFixed(1)}L
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{Math.round(
                                        sampleConversions.reduce((sum, c) => sum + c.totalBusiness, 0) / 
                                        sampleConversions.reduce((sum, c) => sum + c.totalOrders, 0)
                                    ).toLocaleString()}
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
                <ConversionTable
                    conversions={paginatedConversions}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <ConversionPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Conversion;
