import React from 'react';
import { X, Phone, Mail, Calendar, User } from 'lucide-react';

const LeadDetailsDrawer = ({ isOpen, onClose, lead }) => {
    if (!lead) return null;

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-80px)] p-6">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">
                            {getInitials(lead.PersonName)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{lead.PersonName}</h3>
                        <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            lead.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-600 text-white'
                        }`}>
                            {lead.IsOpen ? 'Open' : 'Closed'}
                        </span>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Phone</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <a href={`tel:${lead.CsvMobileNo}`} className="text-blue-600 font-medium hover:underline">
                                        {lead.CsvMobileNo}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Email</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <a href={`mailto:${lead.CsvEmailId}`} className="text-purple-600 font-medium hover:underline break-all">
                                        {lead.CsvEmailId}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Lead ID</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium">{lead.LeadId || 'LD-2024-0001'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Created Date</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium">{lead.CreatedDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-6 space-y-3">
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-500 uppercase">Source</span>
                                <span className="text-sm text-gray-900 font-medium">{lead.Source || '-'}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-500 uppercase">Type</span>
                                <span className="text-sm text-gray-900 font-medium">{lead.Type || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                        <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                            Edit Lead
                        </button>
                        <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                            Convert to Client
                        </button>
                        <button className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                            View Full Details
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeadDetailsDrawer;
