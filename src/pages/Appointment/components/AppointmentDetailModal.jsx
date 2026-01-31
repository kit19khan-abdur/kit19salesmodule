import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, FileText, Tag, CheckCircle, MapPin, Mail, MessageCircle, Mic2, Notebook, Upload, ClipboardCheck, CalendarCheck, PercentCircle } from 'lucide-react';
import { TfiLayoutAccordionList } from "react-icons/tfi";
import { appointmentStatusConfig } from '../constants';

const AppointmentDetailModal = ({ appointment, isOpen, onClose }) => {
    if (!appointment) return null;

    const statusConfig = appointmentStatusConfig[appointment.status];

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
                            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
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
                                                src={appointment.avatar} 
                                                alt={appointment.relatedTo}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 mb-1">Related To:</p>
                                        <p className="text-xl font-bold text-gray-900">{appointment.relatedTo}</p>
                                    </div>
                                </div>

                                {/* Appointment Title */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{appointment.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{appointment.description}</p>
                                </div>

                                {/* Two Column Info Grid */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                    {/* Due Date */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Due Date:</label>
                                        <p className="text-gray-900">{appointment.dueDate || appointment.completedDate}</p>
                                    </div>

                                    {/* Due Time */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Due Time:</label>
                                        <p className="text-gray-900">{appointment.dueTime}</p>
                                    </div>

                                    {/* Location */}
                                    {appointment.location && (
                                        <div className="col-span-2">
                                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Location:</label>
                                            <p className="text-gray-900">{appointment.location}</p>
                                        </div>
                                    )}

                                    {/* Completed Date */}
                                    {appointment.completedDate && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Completed Date:</label>
                                            <p className="text-gray-900">{appointment.completedDate} {appointment.completedTime}</p>
                                        </div>
                                    )}

                                    {/* Outcomes */}
                                    {appointment.outcome && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Outcomes:</label>
                                            <p className="text-gray-900 capitalize">{appointment.outcome}</p>
                                        </div>
                                    )}

                                    {/* Owner */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Owner:</label>
                                        <p className="text-blue-600 font-medium">{appointment.owner}</p>
                                    </div>

                                    {/* Collaborators */}
                                    {appointment.collaborators && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Collaborators:</label>
                                            <p className="text-gray-900">{appointment.collaborators}</p>
                                        </div>
                                    )}

                                    {/* Created On */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Created On:</label>
                                        <p className="text-gray-900">{appointment.completedDate} {appointment.completedTime}</p>
                                    </div>

                                    {/* Created By */}
                                    <div className="col-span-2">
                                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Created By:</label>
                                        <p className="text-blue-600 font-medium">{appointment.owner}</p>
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
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={onClose}
                                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppointmentDetailModal;
