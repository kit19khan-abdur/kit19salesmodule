import React, { useState } from 'react';
import { FileText } from 'lucide-react';

const WhatsAppForm = () => {
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [message, setMessage] = useState('');

    const mobileNumbers = ['8990005555', '9876543210', '8765432109'];

    const templates = [
        { id: 1, name: 'Welcome Message', type: 'Enquiry' },
        { id: 2, name: 'Follow Up', type: 'Enquiry' },
        { id: 3, name: 'Product Information', type: 'Lead' },
        { id: 4, name: 'Appointment Reminder', type: 'Follow-up' }
    ];

    const handleNumberToggle = (number) => {
        setSelectedNumbers(prev =>
            prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number]
        );
    };

    const handleSelectAll = () => {
        if (selectedNumbers.length === mobileNumbers.length) {
            setSelectedNumbers([]);
        } else {
            setSelectedNumbers([...mobileNumbers]);
        }
    };

    return (
        <div className="w-full max-h-[600px] overflow-y-auto px-1">
            {/* Choose Mobile Numbers */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Choose Mobile Numbers</h3>
                    <button
                        onClick={handleSelectAll}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {selectedNumbers.length === mobileNumbers.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                <div className="space-y-2">
                    {mobileNumbers.map((number, index) => (
                        <label
                            key={index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedNumbers.includes(number)}
                                onChange={() => handleNumberToggle(number)}
                                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{number}</span>
                        </label>
                    ))}
                </div>
                {selectedNumbers.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                        {selectedNumbers.length} number{selectedNumbers.length > 1 ? 's' : ''} selected
                    </p>
                )}
            </div>

            {/* Template Selection */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Template
                </label>
                <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                    <option value="">--Select Template--</option>
                    {templates.map((template) => (
                        <option key={template.id} value={template.name}>
                            {template.name} ({template.type})
                        </option>
                    ))}
                </select>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Template Preview
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-700">
                            Hello! This is a preview of the <strong>{selectedTemplate}</strong> template.
                            Your personalized message will appear here.
                        </p>
                    </div>
                </div>
            )}

            {/* Message Variables */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Variables
                </label>
                <div className="flex flex-wrap gap-2">
                    {['{{Name}}', '{{Phone}}', '{{Email}}', '{{Company}}'].map((variable) => (
                        <button
                            key={variable}
                            onClick={() => setMessage(message + variable)}
                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition"
                        >
                            {variable}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default WhatsAppForm;
