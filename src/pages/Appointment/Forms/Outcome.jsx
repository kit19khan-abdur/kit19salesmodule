import React, { useState } from 'react';

const Outcome = ({ task }) => {
    const [formData, setFormData] = useState({
        outcome: task?.outcome || '',
        remarks: task?.remarks || ''
    });

    const outcomes = [
        { value: '', label: '--- Select Outcome ---' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'rescheduled', label: 'Rescheduled' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'on-hold', label: 'On Hold' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="space-y-5">
            {/* Outcome */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outcome
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
            </div>

            {/* Remarks */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                </label>
                <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Remarks goes here."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 resize-y"
                />
            </div>
        </div>
    );
};

export default Outcome;
