import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import ConversionRow from './ConversionRow';
import { tableColumns } from '../constants';

const ConversionTable = ({ conversions, onSort, sortConfig }) => {
    const handleSort = (column) => {
        if (!column.sortable) return;
        
        const newDirection = 
            sortConfig.key === column.key && sortConfig.direction === 'asc' 
                ? 'desc' 
                : 'asc';
        
        onSort({ key: column.key, direction: newDirection });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                            <th className="px-4 py-4 text-left">
                                {/* Expand column */}
                            </th>
                            {tableColumns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-4 py-4 text-left ${
                                        column.sortable ? 'cursor-pointer select-none' : ''
                                    }`}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {column.label}
                                        {column.sortable && (
                                            <ArrowUpDown className={`w-3.5 h-3.5 ${
                                                sortConfig.key === column.key 
                                                    ? 'text-indigo-600' 
                                                    : 'text-gray-400'
                                            }`} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {conversions.length > 0 ? (
                            conversions.map((conversion, index) => (
                                <ConversionRow
                                    key={conversion.id}
                                    conversion={conversion}
                                    index={index}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="px-4 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No conversions found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConversionTable;
