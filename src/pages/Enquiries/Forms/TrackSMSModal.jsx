import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TrackSMSModal = ({ isOpen, onClose }) => {
    const [linkActions, setLinkActions] = useState([]);
    
    const [currentForm, setCurrentForm] = useState({
        details: '',
        domain: '',
        trackUrl: '',
        action: 'original',
        mobileNo: '',
        emailId: '',
        subject: '',
        body: '',
        whatsappNo: '',
        message: ''
    });

    const handleFormChange = (field, value) => {
        setCurrentForm(prev => ({ ...prev, [field]: value }));
    };

    const handleAddLink = () => {
        if (!currentForm.trackUrl) {
            alert('Track URL is required');
            return;
        }

        const newLink = {
            id: Date.now(),
            ...currentForm
        };

        setLinkActions([...linkActions, newLink]);
        
        // Reset form
        setCurrentForm({
            details: '',
            domain: '',
            trackUrl: '',
            action: 'original',
            mobileNo: '',
            emailId: '',
            subject: '',
            body: '',
            whatsappNo: '',
            message: ''
        });
    };

    const handleRemove = (id) => {
        setLinkActions(linkActions.filter(link => link.id !== id));
    };

    const handleSave = () => {
        console.log('Saving link actions:', linkActions);
        // Add your save logic here
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-xl font-bold text-gray-900">Track SMS Configuration</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4">
                        {/* Single Form */}
                        <div className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50">
                            {/* Details Input */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={currentForm.details}
                                    onChange={(e) => handleFormChange('details', e.target.value)}
                                    placeholder="Enter details (e.g., iukjgtj www.kit19.com)"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Domain */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                                <select
                                    value={currentForm.domain}
                                    onChange={(e) => handleFormChange('domain', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a Short Url</option>
                                    <option value="pel.im">pel.im</option>
                                    <option value="short.link">short.link</option>
                                    <option value="tiny.url">tiny.url</option>
                                </select>
                            </div>

                            {/* Track URL */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Track URL</label>
                                <input
                                    type="text"
                                    value={currentForm.trackUrl}
                                    onChange={(e) => handleFormChange('trackUrl', e.target.value)}
                                    placeholder="Url (Required)"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Select Action */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Action</label>
                                <select
                                    value={currentForm.action}
                                    onChange={(e) => handleFormChange('action', e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="original">Original Url</option>
                                    <option value="call">Click to Call</option>
                                    <option value="email">Click to Email</option>
                                    <option value="whatsapp">Click to WhatsApp</option>
                                </select>
                            </div>

                            {/* Conditional Fields Based on Action */}
                            {currentForm.action === 'call' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
                                    <input
                                        type="text"
                                        value={currentForm.mobileNo}
                                        onChange={(e) => handleFormChange('mobileNo', e.target.value)}
                                        placeholder="Mobile No to Call"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}

                            {currentForm.action === 'email' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Id</label>
                                        <input
                                            type="email"
                                            value={currentForm.emailId}
                                            onChange={(e) => handleFormChange('emailId', e.target.value)}
                                            placeholder="Email Id"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            value={currentForm.subject}
                                            onChange={(e) => handleFormChange('subject', e.target.value)}
                                            placeholder="Email Subject"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                                        <textarea
                                            value={currentForm.body}
                                            onChange={(e) => handleFormChange('body', e.target.value)}
                                            placeholder="Email Body"
                                            rows="4"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            {currentForm.action === 'whatsapp' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp No</label>
                                        <input
                                            type="text"
                                            value={currentForm.whatsappNo}
                                            onChange={(e) => handleFormChange('whatsappNo', e.target.value)}
                                            placeholder="WhatsApp No with country code"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea
                                            value={currentForm.message}
                                            onChange={(e) => handleFormChange('message', e.target.value)}
                                            placeholder="Text Message"
                                            rows="4"
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Add Button */}
                            <button
                                onClick={handleAddLink}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add Link Action
                            </button>
                        </div>

                        {/* Saved Actions Table - Only show when there's data */}
                        {linkActions.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Saved Link Actions</h3>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Details</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Link Action</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Url Link</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {linkActions.map((link) => (
                                                <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleRemove(link.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-900">{link.domain || '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="capitalize text-gray-900">
                                                            {link.action === 'call' ? 'Click to Call' :
                                                             link.action === 'email' ? 'Click to Email' :
                                                             link.action === 'whatsapp' ? 'Click to WhatsApp' :
                                                             'Original Url'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-900">{link.trackUrl || '-'}</td>
                                                    <td className="px-4 py-3 text-gray-900">
                                                        {link.action === 'call' ? link.mobileNo :
                                                         link.action === 'email' ? link.emailId :
                                                         link.action === 'whatsapp' ? link.whatsappNo :
                                                         '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TrackSMSModal;
