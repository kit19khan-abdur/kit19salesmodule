import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const EditFollowUp = ({ followUp, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        type: followUp?.followUpType || 'Call-Back',
        status: followUp?.status || 'scheduled',
        dueDate: followUp?.dueDate || '',
        dueTime: followUp?.dueTime || '',
        contactNo: followUp?.contactNo || '',
        relatedTo: followUp?.relatedTo || '',
        assignedTo: followUp?.assignedTo || '',
        remarks: ''
    });

    const typeOptions = [
        'Call-Back',
        'Email Follow-up',
        'Meeting',
        'Task',
        'Reminder'
    ];

    const statusOptions = [
        'scheduled',
        'dueToday',
        'overdue',
        'noFollowup'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Type <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>
                            {status === 'dueToday' ? 'Due Today' : status === 'noFollowup' ? 'No Follow-up' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        value={formData.dueTime}
                        onChange={(e) => handleChange('dueTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>

            {/* Contact No */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact No. <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.contactNo}
                    onChange={(e) => handleChange('contactNo', e.target.value)}
                    placeholder="+91 1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            {/* Related To */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related To
                </label>
                <input
                    type="text"
                    value={formData.relatedTo}
                    onChange={(e) => handleChange('relatedTo', e.target.value)}
                    placeholder="Lead/Contact ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Assigned To */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                </label>
                <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => handleChange('assignedTo', e.target.value)}
                    placeholder="User name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Remarks */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                </label>
                <textarea
                    value={formData.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    rows={4}
                    placeholder="Add any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
            </div>
        </form>
    );
};

export default EditFollowUp;
