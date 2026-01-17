import React from 'react';
import { Phone, Calendar, Trash2, Edit2, Settings } from 'lucide-react';

const CallListTable = ({ contacts, onCallContact, onEditContact, onDeleteContact, onScheduleContact }) => {
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length === 1) return name.charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarColor = (index) => {
        const colors = [
            'bg-blue-100 text-blue-700 border-blue-200',
            'bg-purple-100 text-purple-700 border-purple-200',
            'bg-green-100 text-green-700 border-green-200',
            'bg-orange-100 text-orange-700 border-orange-200',
            'bg-pink-100 text-pink-700 border-pink-200',
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Schedule Time
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                CountryCode
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Amount Paid
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {contacts.length > 0 ? (
                            contacts.map((contact, index) => (
                                <tr
                                    key={contact.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Name Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${getAvatarColor(index)}`}>
                                                {getInitials(contact.name)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {contact.name || 'Unknown'}
                                                </p>
                                                {contact.email && (
                                                    <p className="text-xs text-gray-500">{contact.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Actions Column */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => onCallContact(contact)}
                                                className="p-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
                                                title="Call"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onScheduleContact(contact)}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                                                title="Schedule"
                                            >
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteContact(contact)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEditContact(contact)}
                                                className="p-2 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                                                title="More"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>

                                    {/* Schedule Time */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{contact.scheduleTime}</span>
                                    </td>

                                    {/* Country Code */}
                                    <td className="px-6 py-4">
                                        {contact.countryCode && (
                                            <span className="text-sm font-medium text-gray-900">
                                                {contact.countryCode}
                                            </span>
                                        )}
                                    </td>

                                    {/* Amount Paid */}
                                    <td className="px-6 py-4">
                                        {contact.amountPaid && (
                                            <span className="text-sm font-medium text-gray-900">
                                                {contact.amountPaid}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Phone className="w-12 h-12 text-gray-300 mb-3" />
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">No contacts found</h3>
                                        <p className="text-sm text-gray-500">Start by adding contacts to your call list</p>
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

export default CallListTable;
