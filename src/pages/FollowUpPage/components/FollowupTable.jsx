import React, { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, Plus, Settings, ExternalLink, Eye, Edit, CheckCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots } from 'react-icons/fa';
import FollowUpActionMenu from './FollowUpActionMenu';
import { followUpStatusConfig } from '../constants';

const FollowUpTable = ({ followUps, selectedFollowUps, setSelectedFollowUps, onFollowUpAction }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [openSettingsMenuId, setOpenSettingsMenuId] = useState(null);
    const [hoveredProfileId, setHoveredProfileId] = useState(null);
    const settingsMenuRef = useRef(null);

    // Close settings menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target)) {
                setOpenSettingsMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectFollowUp = (followUpId) => {
        setSelectedFollowUps(prev => {
            if (prev.includes(followUpId)) {
                return prev.filter(id => id !== followUpId);
            } else {
                return [...prev, followUpId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFollowUps(followUps.map(followUp => followUp.id));
        } else {
            setSelectedFollowUps([]);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="px-8 py-6">
            {/* Mass Update Button - Shows when followups are selected */}
            <AnimatePresence>
                {selectedFollowUps.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg font-semibold">
                                    {selectedFollowUps.length}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {selectedFollowUps.length === 1 ? '1 followup selected' : `${selectedFollowUps.length} followups selected`}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Update multiple followups at once
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedFollowUps([])}
                                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    Clear Selection
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle mass update
                                        console.log('Mass update followups:', selectedFollowUps);
                                        setSelectedFollowUps([]);
                                    }}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    Mass Update
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedFollowUps.length === followUps.length && followUps.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-2 py-4 text-left text-sm font-semibold text-gray-900"></th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Follow-up</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created Details</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact No.</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Related to</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {followUps.map((followUp) => {
                                const statusConfig = followUpStatusConfig[followUp.status];
                                return (
                                    <tr key={followUp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedFollowUps.includes(followUp.id)}
                                                onChange={() => handleSelectFollowUp(followUp.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-2 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === followUp.id ? null : followUp.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <EllipsisVertical className="w-5 h-5 text-gray-400" />
                                                </button>
                                                <AnimatePresence>
                                                    {openMenuId === followUp.id && (
                                                        <FollowUpActionMenu
                                                            followUp={followUp}
                                                            onClose={() => setOpenMenuId(null)}
                                                            onAction={(action) => {
                                                                onFollowUpAction(action, followUp);
                                                                setOpenMenuId(null);
                                                            }}
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${statusConfig.bg} mt-1`}>
                                                    <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 mb-1">
                                                        {followUp.followUpType}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Due: <span className="font-medium text-gray-700">{formatDate(followUp.dueDate)} {followUp.dueTime}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">
                                                {formatDate(followUp.createdDate)} {followUp.createdTime}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{followUp.contactNo}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="relative"
                                                    onMouseEnter={() => setHoveredProfileId(followUp.id)}
                                                    onMouseLeave={() => setHoveredProfileId(null)}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer">
                                                        <img
                                                            src={followUp.avatar}
                                                            alt={followUp.relatedTo}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {followUp.badge !== undefined && (
                                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                            {followUp.badge}
                                                        </span>
                                                    )}

                                                    {/* Profile Detail Popup */}
                                                    <AnimatePresence>
                                                        {hoveredProfileId === followUp.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-400 overflow-hidden z-[100]"
                                                            >
                                                                {/* Header */}
                                                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="relative">
                                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden ring-2 ring-white">
                                                                                <img
                                                                                    src={followUp.avatar}
                                                                                    alt={followUp.relatedTo}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                            {followUp.badge !== undefined && (
                                                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                                                                    {followUp.badge}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <h4 className="font-bold text-blue-600 text-sm">{followUp.relatedTo}</h4>
                                                                                <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">Lead Details</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Lead Info */}
                                                                <div className="px-4 py-3 border-b border-gray-200">
                                                                    <p className="text-xs text-gray-600 mb-2">Followup created {formatDate(followUp.createdDate)}</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-600">Status:</span>
                                                                        <span className={`text-xs font-bold ${statusConfig.text}`}>{statusConfig.label}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Activity Timeline */}
                                                                <div className="px-4 py-3 max-h-48 overflow-y-auto">
                                                                    <div className="space-y-3">
                                                                        <div className="flex gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                                <span className="text-blue-600 font-bold text-xs">{followUp.badge || 0}</span>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-700">
                                                                                    <span className="text-green-600 font-semibold">↑</span> Followup created for {followUp.relatedTo}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Footer */}
                                                                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden ring-2 ring-white">
                                                                            <img
                                                                                src={followUp.avatar}
                                                                                alt={followUp.assignedTo}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-xs text-gray-500">Assigned To: <span className="font-semibold text-gray-900">{followUp.assignedTo}</span></p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">{followUp.relatedTo}</span>
                                                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                                    </div>
                                                    <p className="text-xs text-gray-500">Assigned To: {followUp.assignedTo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="relative" ref={openSettingsMenuId === followUp.id ? settingsMenuRef : null}>
                                                    <button
                                                        onClick={() => setOpenSettingsMenuId(openSettingsMenuId === followUp.id ? null : followUp.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Settings className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                    <AnimatePresence>
                                                        {openSettingsMenuId === followUp.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute -right-[50%] top-full mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-50"
                                                            >
                                                                {/* Menu Items */}
                                                                <div className="py-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            onFollowUpAction('view', followUp);
                                                                            setOpenSettingsMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                    >
                                                                        <Eye className="w-5 h-5 text-[#929191]" />
                                                                        <span className="font-medium text-[#929191]">View</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            onFollowUpAction('edit', followUp);
                                                                            setOpenSettingsMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                    >
                                                                        <Edit className="w-5 h-5 text-[#929191]" />
                                                                        <span className="font-medium text-[#929191]">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            onFollowUpAction('complete', followUp);
                                                                            setOpenSettingsMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                    >
                                                                        <CheckCircle className="w-5 h-5 text-[#929191]" />
                                                                        <span className="font-medium text-[#929191]">Mark As Completed</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            onFollowUpAction('comment', followUp);
                                                                            setOpenSettingsMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                    >
                                                                        <FaCommentDots className="w-5 h-5 text-[#929191]" />
                                                                        <span className="font-medium text-[#929191]">Comment</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            onFollowUpAction('delete', followUp);
                                                                            setOpenSettingsMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
                                                                    >
                                                                        <Trash2 className="w-5 h-5 text-red-700" />
                                                                        <span className="font-medium text-red-700">Remove</span>
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FollowUpTable;
