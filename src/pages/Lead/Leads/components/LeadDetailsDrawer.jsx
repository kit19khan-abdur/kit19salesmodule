import React from 'react';
import { X, Phone, Mail, Calendar, User, Clock } from 'lucide-react';

const LeadDetailsDrawer = ({ isOpen, onClose, lead }) => {
    if (!lead) return null;

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
                className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded transition"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-73px)]">
                    {/* Profile Header */}
                    <div className="px-6 py-6 bg-gray-50">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{lead.PersonName}</h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    lead.IsOpen ? 'bg-green-100 text-green-700' : 'bg-gray-600 text-white'
                                }`}>
                                    {lead.IsOpen ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <img 
                                    src="https://kit19.com/assets/custom/img/img_avatar.png" 
                                    alt="avatar" 
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://docs.kit19.com/default/person.png';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        {/* Contact Information */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                                        <a href={`tel:${lead.MobileNo}`} className="text-sm font-medium text-blue-600 hover:underline">
                                            {lead.MobileNo || 'N/A'}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                        <a href={`mailto:${lead.EmailID}`} className="text-sm font-medium text-purple-600 hover:underline truncate block">
                                            {lead.EmailID || 'N/A'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lead Information */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Lead Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Enquiry ID</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-green-600" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{lead.ID || lead.LeadNo || '-'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Created</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <p className="text-sm font-semibold text-orange-600">{lead.CreatedOn?.split(' ')[0] || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Activities</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 font-medium">Lead created</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            by System • {lead.CreatedOn || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeadDetailsDrawer;
