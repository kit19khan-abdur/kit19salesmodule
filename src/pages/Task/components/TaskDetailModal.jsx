import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, Tag, CheckCircle, MapPin } from 'lucide-react';
import { taskStatusConfig } from '../constants';

const TaskDetailModal = ({ task, isOpen, onClose }) => {
    if (!task) return null;

    const statusConfig = taskStatusConfig[task.status];

    return (
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
                        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
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
                                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={task.avatar} 
                                            alt={task.relatedTo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 mb-1">Related To:</p>
                                    <p className="text-xl font-bold text-gray-900">{task.relatedTo}</p>
                                </div>
                            </div>

                            {/* Task Title */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{task.description}</p>
                            </div>

                            {/* Two Column Info Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                {/* Due Date */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Due Date:</label>
                                    <p className="text-gray-900">{task.dueDate || task.completedDate}</p>
                                </div>

                                {/* Completed Date */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Completed Date:</label>
                                    <p className="text-gray-900">{task.completedDate} {task.completedTime}</p>
                                </div>

                                {/* Outcomes */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Outcomes:</label>
                                    <p className="text-gray-900 capitalize">{task.outcome}</p>
                                </div>

                                {/* Owner */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Owner:</label>
                                    <p className="text-blue-600 font-medium">{task.owner}</p>
                                </div>

                                {/* Collaborators */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Collaborators:</label>
                                    <p className="text-gray-900">{task.collaborators || 'Mohit Cheema'}</p>
                                </div>

                                {/* Created On */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Created On:</label>
                                    <p className="text-gray-900">{task.completedDate} {task.completedTime}</p>
                                </div>

                                {/* Created By */}
                                <div className="col-span-2">
                                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Created By:</label>
                                    <p className="text-blue-600 font-medium">{task.owner}</p>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Comments</h3>
                                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                                    No comments yet
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle edit action
                                        onClose();
                                    }}
                                    className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    Edit Task
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailModal;
