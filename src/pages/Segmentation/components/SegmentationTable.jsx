import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import SegmentationRow from './SegmentationRow';
import { tableColumns } from '../constants';

const SegmentationTable = ({
    segments,
    onSort,
    sortConfig,
    onView,
    onEdit,
    onDelete,
    onToggleStatus
}) => {
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
                            {tableColumns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left ${column.sortable ? 'cursor-pointer select-none' : ''
                                        }`}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {column.label}
                                        {column.sortable && (
                                            <ArrowUpDown className={`w-3.5 h-3.5 transition-colors ${sortConfig.key === column.key
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
                        {segments.length > 0 ? (
                            segments.map((segment, index) => (
                                <SegmentationRow
                                    key={segment.id}
                                    segment={segment}
                                    index={index}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggleStatus={onToggleStatus}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={tableColumns.length} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No criteria found</h3>
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

export default SegmentationTable;
