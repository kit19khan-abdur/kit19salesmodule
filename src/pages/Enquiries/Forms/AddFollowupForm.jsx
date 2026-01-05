import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const AddFollowupForm = ({ selectedCount = 0 }) => {
    const [formData, setFormData] = useState({
        followupType: '',
        assignTo: 'Abhi01 (Abhishek Kumar)',
        nextStatusDate: new Date().toISOString().split('T')[0],
        nextStatusTime: '01:58 AM',
        conversionDate: new Date().toISOString().split('T')[0],
        conversionTime: '01:59 AM',
        amountPaid: '',
        remarks: '',
        products: '',
        reAssign: false,
        onSchedule: false
    });

    const followupTypes = [
        'Select FollowupStatus',
        'Call-Back',
        'Not-Interested',
        'Dead Lead',
        'Wrong Number',
        'Converted',
        'Call-Back_Converted',
        'New Product',
        'New Source',
        'New'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const renderFormFields = () => {
        switch (formData.followupType) {
            case 'Call-Back':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-500 text-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Abhi01 (Abhishek Kumar)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Date</label>
                            <input
                                type="date"
                                name="nextStatusDate"
                                value={formData.nextStatusDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="nextStatusTime"
                                    value={formData.nextStatusTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                placeholder="Enter product"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Followup Type :</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reAssign"
                                    checked={formData.reAssign}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Re-Assign</label>
                            </div>
                        </div>
                    </>
                );

            case 'Converted':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-500 text-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Abhi01 (Abhishek Kumar)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conversion Date</label>
                            <input
                                type="date"
                                name="conversionDate"
                                value={formData.conversionDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conversion Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="conversionTime"
                                    value={formData.conversionTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount paid</label>
                            <input
                                type="text"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                placeholder="Amount Paid"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                placeholder="Enter product"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Followup Type :</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reAssign"
                                    checked={formData.reAssign}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Re-Assign</label>
                            </div>
                        </div>
                    </>
                );

            case 'Dead Lead':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Remarks"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                );

            default:
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-500 text-white rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Abhi01 (Abhishek Kumar)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Date</label>
                            <input
                                type="date"
                                name="nextStatusDate"
                                value={formData.nextStatusDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="nextStatusTime"
                                    value={formData.nextStatusTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                placeholder="Enter product"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Followup Type :</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reAssign"
                                    checked={formData.reAssign}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Re-Assign</label>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div>
            {/* Info Banner - Show when mass action */}
            {selectedCount > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 mb-4 flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                        <strong>Info!</strong> You are about to perform a mass action on {selectedCount} selected record(s)
                    </p>
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Follow up</label>
                <select
                    name="followupType"
                    value={formData.followupType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {followupTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {renderFormFields()}

            {/* On Schedule Date And Time checkbox - Show for certain types */}
            {(formData.followupType === 'Call-Back' || formData.followupType === 'Converted') && (
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
            )}
        </div>
    );
};

export default AddFollowupForm;
