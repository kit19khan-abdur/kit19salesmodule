import React, { useState } from 'react';
import { Grid3x3 } from 'lucide-react';
import { RxDropdownMenu } from "react-icons/rx";

const SendMassMailForm = ({ selectedCount = 0 }) => {
    const [formData, setFormData] = useState({
        email1: true,
        email2: false,
        email3: false,
        sender: 'Abhi01(Transactional : 6610)(Abhishek Kumar)',
        fromEmail: 'abhshek.kumar@Support.appmails.in.net',
        replyToEmail: 'abhshek.kumar@Support.appmails.in.net',
        mailMode: 'template', // 'template' or 'compose'
        subject: '',
        template: '',
        composeContent: '',
        onSchedule: false
    });

    const templates = [
        '-- None --',
        'mailtempbirthday ( Enquiry )',
        'MailTemp123 ( Enquiry )',
        'jas ( Enquiry )',
        'TTQQ ( Enquiry )',
        'best123 ( Enquiry )'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleModeChange = (mode) => {
        setFormData(prev => ({
            ...prev,
            mailMode: mode
        }));
    };

    return (
        <div>
            {/* Sender Dropdown */}
            <div className="mb-4">
                <select
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option>Abhi01(Transactional : 6610)(Abhishek Kumar)</option>
                </select>
            </div>

            {/* From Email Dropdown */}
            <div className="mb-4">
                <select
                    name="fromEmail"
                    value={formData.fromEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option>abhshek.kumar@Support.appmails.in.net</option>
                </select>
            </div>

            {/* Reply To Email Dropdown */}
            <div className="mb-6">
                <select
                    name="replyToEmail"
                    value={formData.replyToEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option>abhshek.kumar@Support.appmails.in.net</option>
                </select>
            </div>

            {/* Radio Buttons - Select Template / Compose Mail */}
            <div className="mb-6 flex items-center justify-center gap-16 py-4">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="radio"
                            name="mailMode"
                            checked={formData.mailMode === 'template'}
                            onChange={() => handleModeChange('template')}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        Select Template
                    </span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="radio"
                            name="mailMode"
                            checked={formData.mailMode === 'compose'}
                            onChange={() => handleModeChange('compose')}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        Compose Mail
                    </span>
                </label>
            </div>

            {/* Subject Field */}
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        type="button"
                        className="p-2.5 border border-gray-300 rounded hover:bg-gray-50 transition"
                        title="Insert Template Variables"
                    >
                        <RxDropdownMenu className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Conditional Rendering based on mailMode */}
            {formData.mailMode === 'template' ? (
                /* Template Selection */
                <div className="mb-4">
                    <div className="mb-2">
                        <span className="text-sm text-gray-700">or Select Template : </span>
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Click To View
                        </a>
                    </div>
                    <select
                        name="template"
                        value={formData.template}
                        onChange={handleChange}
                        size={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        {templates.map((template, index) => (
                            <option key={index} value={template}>
                                {template}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                /* Compose Mail Textarea */
                <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">Compose Your Message:</label>
                    <textarea
                        name="composeContent"
                        value={formData.composeContent}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    />
                </div>
            )}

            {/* On Schedule Date And Time */}
            <div className="flex items-center mt-6">
                <input
                    type="checkbox"
                    name="onSchedule"
                    checked={formData.onSchedule}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">On Schedule Date And Time</label>
            </div>
        </div>
    );
};

export default SendMassMailForm;
