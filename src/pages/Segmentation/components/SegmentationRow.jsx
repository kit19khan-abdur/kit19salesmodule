import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';

const SegmentationRow = ({ segment, index, onView, onEdit, onDelete, onToggleStatus }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleStatus = async () => {
        setIsToggling(true);
        await onToggleStatus(segment.id);
        setTimeout(() => setIsToggling(false), 300);
    };

    const getCriteriaColor = (criteria) => {
        const colors = {
            'Lead': 'bg-blue-100 text-blue-700',
            'Enquiry': 'bg-purple-100 text-purple-700',
            'Conversion': 'bg-green-100 text-green-700',
            'All': 'bg-gray-100 text-gray-700'
        };
        return colors[criteria] || 'bg-gray-100 text-gray-700';
    };

    return (
        <motion.tr
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all group"
        >
            {/* Search Name */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {segment.searchName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{segment.searchName}</p>
                    </div>
                </div>
            </td>

            {/* Created On */}
            <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{segment.createdOn}</p>
            </td>

            {/* Criteria */}
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCriteriaColor(segment.criteria)}`}>
                    {segment.criteria}
                </span>
            </td>

            {/* Created By */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {segment.createdBy.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm text-gray-700">{segment.createdBy}</p>
                </div>
            </td>

            {/* Status Toggle */}
            <td className="px-6 py-4">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleStatus}
                    disabled={isToggling}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        segment.status === 'active' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                            : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                            segment.status === 'active' ? 'translate-x-[36px]' : 'translate-x-1'
                        }`}
                    />
                </motion.button>
                <p className={`text-xs font-semibold mt-1 ${
                    segment.status === 'active' ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                    {segment.status === 'active' ? 'Active' : 'Inactive'}
                </p>
            </td>

            {/* Count */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{segment.count.toLocaleString()}</span>
                </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {/* View Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView(segment)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </motion.button>

                    {/* Edit Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(segment)}
                        className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        title="Edit Criteria"
                    >
                        <Edit2 className="w-4 h-4" />
                    </motion.button>

                    {/* More Actions Menu */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </motion.button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20"
                                    >
                                        <button
                                            onClick={() => {
                                                onDelete(segment);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </td>
        </motion.tr>
    );
};

export default SegmentationRow;
