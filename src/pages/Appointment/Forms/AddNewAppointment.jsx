import React, { useState } from 'react';
import { Calendar, Wand2 } from 'lucide-react';

const AddNewAppointment = ({ onClose, onSubmit }) => {
    const generateTitle = () => {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        return `NewAppointment_${timestamp}`;
    };

    const [formData, setFormData] = useState({
        title: generateTitle(),
        description: '',
        appointmentType: 'Facebook Chat',
        dueDateTime: '28 Jan 2026 18:07:12',
        relatedTo: '',
        owner: 'kmukesh343 (Mukesh Kumar)',
        collaborators: '',
        sendNotification: true
    });

    const appointmentTypes = [
        'Facebook Chat',
        'Phone Call',
        'Email',
        'WhatsApp',
        'Meeting',
        'SMS',
        'Voice Call',
        'Video Call',
        'Follow Up',
        'Site Visit'
    ];

    const owners = [
        'kmukesh343 (Mukesh Kumar)',
        '34594-Aakash.Jain (Aakash Jain)',
        '34594-Mohit.cheema (Mohit Cheema)',
        '34594-Manish.Singh (Surjit kaur)',
        '34594-Rachit Kumar (qaseem khan)'
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-white rounded-lg w-full max-w-4xl">

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                        Description
                    </label>
                    <div className="relative">
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Start Typing the details about the appointment..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <button
                            type="button"
                            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Format text"
                        >
                            {/* <Wand2 className="w-5 h-5" /> */}
                        </button>
                    </div>
                </div>

                {/* Appointment Type, Due Date, Related To - Three columns */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Appointment Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Appointment Type
                        </label>
                        <select
                            value={formData.appointmentType}
                            onChange={(e) => handleChange('appointmentType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5rem',
                                paddingRight: '2.5rem'
                            }}
                        >
                            {appointmentTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Due Date and Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Due Date and Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={formData.dueDateTime}
                                onChange={(e) => handleChange('dueDateTime', e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" /> */}
                        </div>
                    </div>

                    {/* Related To */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Related To
                        </label>
                        <input
                            type="text"
                            value={formData.relatedTo}
                            onChange={(e) => handleChange('relatedTo', e.target.value)}
                            placeholder="Type Appointment name or Mobile or Company"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-red-600 mt-1">(From Lead Section)</p>
                    </div>
                </div>

                {/* Owner and Collaborators - Two columns */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Owner */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Owner
                        </label>
                        <select
                            value={formData.owner}
                            onChange={(e) => handleChange('owner', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5rem',
                                paddingRight: '2.5rem'
                            }}
                        >
                            {owners.map((owner, index) => (
                                <option key={index} value={owner}>{owner}</option>
                            ))}
                        </select>
                    </div>

                    {/* Collaborators */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Collaborators
                        </label>
                        <input
                            type="text"
                            value={formData.collaborators}
                            onChange={(e) => handleChange('collaborators', e.target.value)}
                            placeholder="Select collaborators"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Send Notification */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="sendNotification"
                        checked={formData.sendNotification}
                        onChange={(e) => handleChange('sendNotification', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sendNotification" className="text-sm font-medium text-gray-800 cursor-pointer">
                        Send Notification
                    </label>
                </div>
            </form>
        </div>
    );
};

export default AddNewAppointment;
