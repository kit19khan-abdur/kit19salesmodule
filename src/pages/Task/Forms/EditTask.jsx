import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Phone, MapPin } from 'lucide-react';

const EditTask = ({ task }) => {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        taskType: task?.taskType || 'service',
        dueDate: task?.dueDate || '',
        relatedTo: task?.relatedTo || '',
        owner: task?.owner || '',
        collaborators: task?.collaborators || [],
        markAsCompleted: task?.status === 'completed' || false,
        outcome: task?.outcome || '',
        remarks: task?.remarks || '',
        sendNotification: false
    });

    const [showCollaboratorDropdown, setShowCollaboratorDropdown] = useState(false);
    const [showRelatedToDropdown, setShowRelatedToDropdown] = useState(false);
    const [relatedToSearch, setRelatedToSearch] = useState(task?.relatedTo || '');
    const collaboratorRef = useRef(null);
    const relatedToRef = useRef(null);

    // Available leads for Related To field
    const availableLeads = [
        { value: 'test', name: 'test', phone: '+91-7474757878', hasLocation: true },
        { value: 'testlead', name: 'testlead', phone: '+91-745484648', hasLocation: true },
        { value: 'testooo', name: 'testooo', phone: '+91-7427665680', hasLocation: false },
        { value: 'test123444', name: 'test123444', phone: '+91-9988745694', hasLocation: false },
    ];

    // Available collaborators list
    const availableCollaborators = [
        { value: 'kmukesh343', label: 'kmukesh343 (Mukesh Kumar)' },
        { value: '34594-Mohit.cheema', label: '34594-Mohit.cheema (Mohit Cheema)' },
        { value: '34594-Manish.Singh', label: '34594-Manish.Singh (Surjit kaur)' },
        { value: '34594-Rachit.Kumar', label: '34594-Rachit.Kumar (naseem khan)' },
        { value: '34594-Perumal.R', label: '34594-Perumal.R (Animesh Shukla)' },
    ];

    // Filter leads based on search
    const filteredLeads = availableLeads.filter(lead => 
        lead.name.toLowerCase().includes(relatedToSearch.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (collaboratorRef.current && !collaboratorRef.current.contains(e.target)) {
                setShowCollaboratorDropdown(false);
            }
            if (relatedToRef.current && !relatedToRef.current.contains(e.target)) {
                setShowRelatedToDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const taskTypes = [
        { value: 'service', label: 'service' },
        { value: 'call', label: 'call' },
        { value: 'meeting', label: 'meeting' },
        { value: 'follow-up', label: 'follow-up' },
        { value: 'other', label: 'other' }
    ];

    const owners = [
        { value: 'kmukesh343', label: 'kmukesh343 (Mukesh Kumar)' },
        { value: 'admin', label: 'admin (Admin User)' },
        { value: 'sales', label: 'sales (Sales Team)' }
    ];

    const outcomes = [
        { value: '', label: '--- Select Outcome ---' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'rescheduled', label: 'Rescheduled' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleCollaborator = (collaborator) => {
        setFormData(prev => {
            const isSelected = prev.collaborators.includes(collaborator.value);
            return {
                ...prev,
                collaborators: isSelected
                    ? prev.collaborators.filter(c => c !== collaborator.value)
                    : [...prev.collaborators, collaborator.value]
            };
        });
    };

    const removeCollaborator = (collaboratorValue) => {
        setFormData(prev => ({
            ...prev,
            collaborators: prev.collaborators.filter(c => c !== collaboratorValue)
        }));
    };

    const getCollaboratorLabel = (value) => {
        const collab = availableCollaborators.find(c => c.value === value);
        return collab ? collab.label : value;
    };

    return (
        <div className="space-y-5">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Create Task Test - 2026-01-28 15:29:07"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <div className="relative">
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="This is a task creation test for Create Task Test - 2026-01-28 15:29:07"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 resize-y"
                    /></div>
            </div>

            {/* Task Type, Due Date, Related To - 3 columns */}
            <div className="grid grid-cols-3 gap-4">
                {/* Task Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task Type
                    </label>
                    <select
                        name="taskType"
                        value={formData.taskType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 bg-white"
                    >
                        {taskTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {/* Due Date and Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date and Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                        />
                    </div>
                </div>

                {/* Related To */}
                <div className="relative" ref={relatedToRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Related To
                    </label>
                    <input
                        type="text"
                        value={relatedToSearch}
                        onChange={(e) => {
                            setRelatedToSearch(e.target.value);
                            setShowRelatedToDropdown(true);
                        }}
                        onFocus={() => setShowRelatedToDropdown(true)}
                        placeholder="Search leads..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">(From Lead Section)</p>
                    
                    {/* Related To Dropdown */}
                    {showRelatedToDropdown && filteredLeads.length > 0 && (
                        <div className="absolute top-[68px] left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-[250px] overflow-y-auto">
                            {filteredLeads.map((lead) => (
                                <div
                                    key={lead.value}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, relatedTo: lead.value }));
                                        setRelatedToSearch(lead.name);
                                        setShowRelatedToDropdown(false);
                                    }}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    {/* Lead Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                                        <div className="flex items-center text-nowrap gap-1 text-xs text-gray-500">
                                            {lead.phone && (
                                                <>
                                                    <Phone className="w-3 h-3" />
                                                    <span className='text-nowrap'>{lead.phone}</span>
                                                </>
                                            )}
                                            {lead.hasLocation && (
                                                <MapPin className="w-3 h-3 ml-1 text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Owner and Collaborators - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
                {/* Owner */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner
                    </label>
                    <select
                        name="owner"
                        value={formData.owner}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 bg-white"
                    >
                        {owners.map(owner => (
                            <option key={owner.value} value={owner.value}>{owner.label}</option>
                        ))}
                    </select>
                </div>

                {/* Collaborators */}
                <div className="relative" ref={collaboratorRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collaborators
                    </label>
                    <div 
                        onClick={() => setShowCollaboratorDropdown(!showCollaboratorDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent min-h-[42px] flex flex-wrap gap-2 items-center cursor-pointer bg-white"
                    >
                        {formData.collaborators.map((collaborator, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700"
                            >
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCollaborator(collaborator);
                                    }}
                                />
                                {getCollaboratorLabel(collaborator)}
                            </span>
                        ))}
                        {formData.collaborators.length === 0 && (
                            <span className="text-gray-400 text-sm">Select collaborators...</span>
                        )}
                    </div>
                    
                    {/* Dropdown */}
                    {showCollaboratorDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
                            {availableCollaborators.map((collaborator) => {
                                const isSelected = formData.collaborators.includes(collaborator.value);
                                return (
                                    <div
                                        key={collaborator.value}
                                        onClick={() => toggleCollaborator(collaborator)}
                                        className={`px-4 py-2 cursor-pointer text-sm ${
                                            isSelected 
                                                ? 'bg-indigo-500 text-white' 
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {collaborator.label}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Mark as Completed */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="markAsCompleted"
                    id="markAsCompleted"
                    checked={formData.markAsCompleted}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="markAsCompleted" className="text-sm font-medium text-gray-700">
                    Mark as Completed
                </label>
            </div>

            {/* Outcomes */}
           {formData.markAsCompleted &&( <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outcomes
                </label>
                <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 bg-white"
                >
                    {outcomes.map(outcome => (
                        <option key={outcome.value} value={outcome.value}>{outcome.label}</option>
                    ))}
                </select>
            </div>)}

            {/* Remarks */}
            {formData.markAsCompleted &&(<div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                </label>
                <div className="relative">
                    <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="about the task..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 resize-y"
                    /></div>
            </div>)}

            {/* Send Notification */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="sendNotification"
                    id="sendNotification"
                    checked={formData.sendNotification}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sendNotification" className="text-sm font-medium text-gray-700">
                    Send Notification
                </label>
                <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                        Send notification to owner and collaborators
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTask;
