import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Wand2, MapPin } from 'lucide-react';

const AddNewTask = ({ onClose, onSubmit }) => {
    const generateTitle = () => {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        return `NewTask_${timestamp}`;
    };

    const [formData, setFormData] = useState({
        title: generateTitle(),
        description: '',
        taskType: 'Facebook Chat',
        dueDateTime: '28 Jan 2026 18:07:12',
        relatedTo: '',
        owner: 'kmukesh343 (Mukesh Kumar)',
        collaborators: [],
        sendNotification: true
    });

    const [relatedToSearch, setRelatedToSearch] = useState('');
    const [showRelatedDropdown, setShowRelatedDropdown] = useState(false);
    const [showCollaboratorsDropdown, setShowCollaboratorsDropdown] = useState(false);
    const relatedToRef = useRef(null);
    const collaboratorsRef = useRef(null);

    // Sample data for Related To
    const relatedToOptions = [
        { id: 1, name: 'tessstinggggg', phone: '+91-8565452545', avatar: null },
        { id: 2, name: 'test', phone: '+91-7474757878', avatar: null },
        { id: 3, name: 'testlead', phone: '', avatar: null },
        { id: 4, name: 'testooo', phone: '+91-7427656680', avatar: null },
        { id: 5, name: 'John Doe', phone: '+91-9876543210', avatar: null },
        { id: 6, name: 'Jane Smith', phone: '+91-8765432109', avatar: null }
    ];

    // Sample data for Collaborators
    const collaboratorOptions = [
        { id: 1, name: '34594-Mohit.cheema (Mohit Cheema)' },
        { id: 2, name: '34594-Manish.Singh (Surjit kaur)' },
        { id: 3, name: '34594-Rachit.Kumar (naseem khan)' },
        { id: 4, name: '34594-Perumal.R (Animesh Shukla)' },
        { id: 5, name: '34594-Aakash.Jain (Aakash Jain)' },
        { id: 6, name: 'kmukesh343 (Mukesh Kumar)' }
    ];

    const taskTypes = [
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

    const handleRelatedToSelect = (option) => {
        setRelatedToSearch(option.name);
        setFormData(prev => ({ ...prev, relatedTo: option.name }));
        setShowRelatedDropdown(false);
    };

    const toggleCollaborator = (collaborator) => {
        setFormData(prev => {
            const isSelected = prev.collaborators.includes(collaborator.name);
            return {
                ...prev,
                collaborators: isSelected
                    ? prev.collaborators.filter(c => c !== collaborator.name)
                    : [...prev.collaborators, collaborator.name]
            };
        });
    };

    // Filter related to options based on search
    const filteredRelatedTo = relatedToOptions.filter(option =>
        option.name.toLowerCase().includes(relatedToSearch.toLowerCase()) ||
        option.phone.includes(relatedToSearch)
    );

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (relatedToRef.current && !relatedToRef.current.contains(event.target)) {
                setShowRelatedDropdown(false);
            }
            if (collaboratorsRef.current && !collaboratorsRef.current.contains(event.target)) {
                setShowCollaboratorsDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                            placeholder="Start Typing the details about the task..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                {/* Task Type, Due Date, Related To - Three columns */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Task Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Task Type
                        </label>
                        <select
                            value={formData.taskType}
                            onChange={(e) => handleChange('taskType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5rem',
                                paddingRight: '2.5rem'
                            }}
                        >
                            {taskTypes.map((type, index) => (
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
                                className="w-full px-1 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            </div>
                    </div>

                    {/* Related To */}
                    <div ref={relatedToRef} className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Related To
                        </label>
                        <input
                            type="text"
                            value={relatedToSearch}
                            onChange={(e) => {
                                setRelatedToSearch(e.target.value);
                                setShowRelatedDropdown(true);
                            }}
                            onFocus={() => setShowRelatedDropdown(true)}
                            placeholder="Type Task name or Mobile or Company"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-red-600 mt-1">(From Lead Section)</p>

                        {/* Related To Dropdown */}
                        {showRelatedDropdown && filteredRelatedTo.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                {filteredRelatedTo.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => handleRelatedToSelect(option)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                            {option.name.charAt(0).toUpperCase()}
                                        </div>
                                        
                                        {/* Name and Phone */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-800 truncate">{option.name}</div>
                                            {option.phone && (
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{option.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                    <div ref={collaboratorsRef} className="relative">
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Collaborators
                        </label>
                        <div
                            onClick={() => setShowCollaboratorsDropdown(!showCollaboratorsDropdown)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {formData.collaborators.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {formData.collaborators.map((collab, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                        >
                                            {collab.split('(')[0].trim()}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400">Select collaborators</span>
                            )}
                        </div>

                        {/* Collaborators Dropdown */}
                        {showCollaboratorsDropdown && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 font-medium text-center">
                                    ---Select Collaborators---
                                </div>
                                
                                {/* Options List */}
                                <div className="max-h-64 overflow-y-auto">
                                    {collaboratorOptions.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => toggleCollaborator(option)}
                                            className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                                                formData.collaborators.includes(option.name)
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.collaborators.includes(option.name)}
                                                    onChange={() => {}}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm">{option.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

export default AddNewTask;
