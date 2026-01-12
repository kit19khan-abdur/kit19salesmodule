import React, { useState } from 'react';
import RichTextEditor from '../../../components/common/RichTextEditor';
import { Send } from 'lucide-react';

const SendMassSMS = ({ selectedCount = 0 }) => {
    const [formData, setFormData] = useState({
        mobile1: true,
        mobile2: false,
        mobile3: false,
        sender: 'Abhi01(Transactional : 15007)(Abhishek Kumar)',
        senderId: 'KITAPP',
        template: '',
        message: '',
        isUnicode: false,
        trackUrl: false,
        trackSMS: false,
        onSchedule: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div>
            {/* Info Message */}
            <div className="mb-4 pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                    No template has been created for given senderid. For creation{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                        Click here !
                    </a>
                </p>
            </div>

            {/* Mobile Number Selection */}
            <div className="mb-4 flex items-center gap-6">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="mobile1"
                        checked={formData.mobile1}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mobile1</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="mobile2"
                        checked={formData.mobile2}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mobile2</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="mobile3"
                        checked={formData.mobile3}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mobile3</span>
                </label>
            </div>

            {/* Sender Dropdown */}
            <div className="mb-4">
                <select
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Abhi01(Transactional : 15007)(Abhishek Kumar)</option>
                </select>
            </div>

            {/* Sender ID Dropdown */}
            <div className="mb-4">
                <select
                    name="senderId"
                    value={formData.senderId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>KITAPP</option>
                </select>
            </div>

            {/* Template Dropdown */}
            <div className="mb-4">
                <select
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Template</option>
                </select>
            </div>

            {/* Message Textarea */}
            <div className="mb-4">
                <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows="5"
                />
            </div>

            {/* IsUnicode Checkbox */}
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="isUnicode"
                        checked={formData.isUnicode}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">IsUnicode</span>
                </label>
            </div>

            {/* Track Url and Track SMS */}
            <div className="mb-4 flex items-center gap-6">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="trackUrl"
                        checked={formData.trackUrl}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Track Url</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="trackSMS"
                        checked={formData.trackSMS}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-blue-600 flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        Track SMS
                    </span>
                </label>
            </div>

            {/* On Schedule Date And Time */}
            <div className="flex items-center justify-between">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="onSchedule"
                        checked={formData.onSchedule}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Schedule Date And Time</span>
                </label>
            </div>
        </div>
    );
};

export default SendMassSMS;
