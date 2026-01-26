import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const AddTask = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: `NewTask_${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}${String(new Date().getSeconds()).padStart(2, '0')}`,
        description: '',
        remarks: '',
        activityType: 'Facebook Chat',
        dueDateTime: '',
        owner: '34594-Aakash.Jain (Aakash Jain)',
        collaborators: []
    });

    const [showCollaborators, setShowCollaborators] = useState(false);

    const activityTypes = [
        'Facebook Chat',
        'Phone Call',
        'Email',
        'Meeting',
        'Follow-up',
        'Presentation',
        'Demo'
    ];

    const owners = [
        '34594-Aakash.Jain (Aakash Jain)',
        'kmukesh343 (Mukesh Kumar)',
        '34594-Mohit.cheema (Mohit Cheema)',
        '34594-Manish.Singh (Surjit kaur)',
        '34594-Rachit Kumar (qaseem khan)'
    ];

    const collaboratorsList = [
        'kmukesh343 (Mukesh Kumar)',
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
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[100vh] overflow-y-auto">

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="NewTask_20260126214616"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks
                    </label>
                    <textarea
                        value={formData.remarks}
                        onChange={(e) => handleChange('remarks', e.target.value)}
                        placeholder="about the task..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Sales Activity Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-red-500">*</span> Sales Activity Type
                    </label>
                    <select
                        value={formData.activityType}
                        onChange={(e) => handleChange('activityType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {activityTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Due Date and Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date and Time<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.dueDateTime}
                            onChange={(e) => handleChange('dueDateTime', e.target.value)}
                            placeholder="27 Jan 2026 23:01"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded">
                                <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Owner */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-red-500">*</span> Owner
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collaborators
                    </label>
                    <div className="relative">
                        <div
                            onClick={() => setShowCollaborators(!showCollaborators)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between bg-white"
                        >
                            <span className="text-gray-400">
                                {formData.collaborators.length > 0 
                                    ? `${formData.collaborators.length} selected` 
                                    : 'Select collaborators'}
                            </span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>

                        {/* Collaborators Dropdown */}
                        {showCollaborators && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 font-medium sticky top-0">
                                    ---Select Collaborators---
                                </div>
                                {/* Options */}
                                <div className="py-1">
                                    {collaboratorsList.map((collaborator, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.collaborators.includes(collaborator)}
                                                onChange={() => handleCollaboratorToggle(collaborator)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{collaborator}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddTask;
