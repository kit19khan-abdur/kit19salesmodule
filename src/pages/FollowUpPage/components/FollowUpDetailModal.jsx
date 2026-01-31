import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, MapPin, MessageSquare } from 'lucide-react';
import { followUpStatusConfig } from '../constants';

const FollowUpDetailModal = ({ followUp, isOpen, onClose }) => {
    if (!followUp) return null;

    const statusConfig = followUpStatusConfig[followUp.status];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                            style={{ maxHeight: '90vh' }}
                        >
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                                            <statusConfig.icon className={`w-6 h-6 ${statusConfig.color}`} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Follow-up Details</h2>
                                            <p className={`text-sm font-medium ${statusConfig.text}`}>{statusConfig.label}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                {/* Related To Section */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden ring-4 ring-blue-100">
                                            <img 
                                                src={followUp.avatar} 
                                                alt={followUp.relatedTo}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {followUp.badge !== undefined && (
                                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                                {followUp.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Related To:</p>
                                        <p className="text-xl font-bold text-blue-600">{followUp.relatedTo}</p>
                                        <p className="text-sm text-gray-500 mt-1">Lead ID: {followUp.relatedTo}</p>
                                    </div>
                                </div>

                                {/* Follow-up Type */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-gray-900">{followUp.followUpType}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Scheduled follow-up activity for lead engagement
                                    </p>
                                </div>

                                {/* Two Column Info Grid */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6">
                                    {/* Due Date */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <label className="text-sm font-semibold text-gray-600">Due Date:</label>
                                        </div>
                                        <p className="text-gray-900 font-medium">{formatDate(followUp.dueDate)}</p>
                                    </div>

                                    {/* Due Time */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <label className="text-sm font-semibold text-gray-600">Due Time:</label>
                                        </div>
                                        <p className="text-gray-900 font-medium">{followUp.dueTime}</p>
                                    </div>

                                    {/* Created Date */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <label className="text-sm font-semibold text-gray-600">Created Date:</label>
                                        </div>
                                        <p className="text-gray-900">{formatDate(followUp.createdDate)}</p>
                                    </div>

                                    {/* Created Time */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <label className="text-sm font-semibold text-gray-600">Created Time:</label>
                                        </div>
                                        <p className="text-gray-900">{followUp.createdTime}</p>
                                    </div>

                                    {/* Contact Number */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <label className="text-sm font-semibold text-gray-600">Contact Number:</label>
                                        </div>
                                        <p className="text-gray-900 font-medium text-lg">{followUp.contactNo}</p>
                                    </div>

                                    {/* Assigned To */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <label className="text-sm font-semibold text-gray-600">Assigned To:</label>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden ring-2 ring-blue-100">
                                                <img 
                                                    src={followUp.avatar} 
                                                    alt={followUp.assignedTo}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-blue-600 font-semibold">{followUp.assignedTo}</p>
                                                <p className="text-xs text-gray-500">Sales Representative</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="col-span-2">
                                        <label className="text-sm font-semibold text-gray-600 mb-2 block">Current Status:</label>
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border-2`}>
                                            <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                                            <span className={`font-bold ${statusConfig.text}`}>{statusConfig.label}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Timeline</h3>
                                    <div className="space-y-3">
                                        <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold text-blue-600">Follow-up created</span> for lead {followUp.relatedTo}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{formatDate(followUp.createdDate)} at {followUp.createdTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700">
                                                    Assigned to <span className="font-semibold">{followUp.assignedTo}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Lead was assigned to the sales representative</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="border-t border-gray-200 pt-6 mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Comments & Notes</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                                        No comments yet
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FollowUpDetailModal;
