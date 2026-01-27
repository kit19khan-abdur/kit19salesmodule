import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const MassUpdate = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        description: '',
        remarks: '',
        salesActivityType: 'Facebook Chat',
        dueDateTime: '28 Jan 2026 14:32:51',
        owner: '',
        collaborators: [],
        markAsCompleted: false,
        outcome: ''
    });

    const [showCollaborators, setShowCollaborators] = useState(false);

    const salesActivityTypes = [
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

    const collaboratorsList = [
        'Mukesh Kumar',
        'Aakash Jain',
        'Mohit Cheema',
        'Surjit kaur',
        'qaseem khan',
        'Rajesh Singh',
        'Priya Sharma',
        'Amit Verma'
    ];

    const outcomes = [
        'Successful',
        'Follow Up Required',
        'Not Interested',
        'Callback Requested',
        'Meeting Scheduled',
        'Information Sent',
        'Proposal Sent',
        'Deal Closed',
        'Lost to Competitor',
        'No Response'
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCollaboratorToggle = (collaborator) => {
        setFormData(prev => ({
            ...prev,
            collaborators: prev.collaborators.includes(collaborator)
                ? prev.collaborators.filter(c => c !== collaborator)
                : [...prev.collaborators, collaborator]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-white rounded-lg w-full max-w-2xl">
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Start Typing the details about the task."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Remarks */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Remarks
                    </label>
                    <textarea
                        value={formData.remarks}
                        onChange={(e) => handleChange('remarks', e.target.value)}
                        placeholder="about the task..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Sales Activity Type */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Sales Activity Type
                    </label>
                    <select
                        value={formData.salesActivityType}
                        onChange={(e) => handleChange('salesActivityType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {salesActivityTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Due Date and Time */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Due Date and Time<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            value={formData.dueDateTime}
                            onChange={(e) => handleChange('dueDateTime', e.target.value)}
                            className="w-full px-4 py-3  border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
                    </div>
                </div>

                {/* Owner */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Owner
                    </label>
                    <select
                        value={formData.owner}
                        onChange={(e) => handleChange('owner', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        <option value="">Nothing selected</option>
                        {owners.map((owner, index) => (
                            <option key={index} value={owner}>{owner}</option>
                        ))}
                    </select>
                </div>

                {/* Collaborators */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Collaborators
                    </label>
                    <div className="relative">
                        <div
                            onClick={() => setShowCollaborators(!showCollaborators)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between bg-white"
                        >
                            <span>
                                {formData.collaborators.length > 0 
                                    ? formData.collaborators.join(', ')
                                    : 'Nothing selected'}
                            </span>
                            <svg 
                                className={`w-5 h-5 text-gray-500 transition-transform ${showCollaborators ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {showCollaborators && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium text-center">
                                    ---Select Collaborators---
                                </div>
                                {collaboratorsList.map((collaborator, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.collaborators.includes(collaborator)}
                                            onChange={() => handleCollaboratorToggle(collaborator)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-sm text-gray-700">{collaborator}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mark as Completed */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="markCompleted"
                        checked={formData.markAsCompleted}
                        onChange={(e) => handleChange('markAsCompleted', e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="markCompleted" className="text-sm font-semibold text-gray-800 cursor-pointer">
                        Mark as Completed
                    </label>
                </div>

                {/* Outcome */}
                {formData.markAsCompleted && (<div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Outcome<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.outcome}
                        onChange={(e) => handleChange('outcome', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        <option value="">---Select Outcomes---</option>
                        {outcomes.map((outcome, index) => (
                            <option key={index} value={outcome}>{outcome}</option>
                        ))}
                    </select>
                </div>)}
            </form>
        </div>
    );
};

export default MassUpdate;
