import React from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ConversionHeader = ({ 
    searchQuery, 
    setSearchQuery, 
    conversionType, 
    setConversionType,
    onExport,
    totalEntries,
    showingStart,
    showingEnd
}) => {
    return (
        <div className="mb-6">
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#02ba71] to-[#02ba5e] bg-clip-text text-transparent">
                    Conversions
                </h1>
                <p className="text-gray-500 mt-1">Manage and track all your sales conversions</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-6 flex-wrap">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search By : Lead No, Name, Mobile, Email"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Conversion Type Radio */}
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="conversionType"
                                value="consolidated"
                                checked={conversionType === 'consolidated'}
                                onChange={(e) => setConversionType(e.target.value)}
                                className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                Consolidated conversions
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="conversionType"
                                value="individual"
                                checked={conversionType === 'individual'}
                                onChange={(e) => setConversionType(e.target.value)}
                                className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                Each individual conversion
                            </span>
                        </label>
                    </div>

                    {/* Export Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onExport}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </motion.button>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{showingStart}</span> to{' '}
                        <span className="font-semibold text-gray-900">{showingEnd}</span> of{' '}
                        <span className="font-semibold text-gray-900">{totalEntries}</span> entries
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConversionHeader;
