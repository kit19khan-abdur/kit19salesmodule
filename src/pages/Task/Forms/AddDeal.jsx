import React, { useState } from 'react';

const AddDeal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        dealValue: '',
        dealPipeline: 'solar',
        dealStage: 'Welcome Mail send',
        probability: '',
        salesOwner: 'kmukesh343 (Mukesh Kumar)',
        estimatedCloserDate: ''
    });

    const pipelines = [
        'solar',
        'Real Estate',
        'Insurance',
        'Software',
        'Services'
    ];

    const stages = [
        'Welcome Mail send',
        'Qualification',
        'Needs Analysis',
        'Proposal',
        'Negotiation',
        'Closed Won',
        'Closed Lost'
    ];

    const salesOwners = [
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        }
    };

    return (
        <div className="bg-white rounded-lg w-full max-w-2xl">
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Deal value */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Deal value <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.dealValue}
                        onChange={(e) => handleChange('dealValue', e.target.value)}
                        placeholder="Please Enter Value"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Deal pipeline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deal pipeline
                    </label>
                    <select
                        value={formData.dealPipeline}
                        onChange={(e) => handleChange('dealPipeline', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {pipelines.map((pipeline, index) => (
                            <option key={index} value={pipeline}>{pipeline}</option>
                        ))}
                    </select>
                </div>

                {/* Deal Stage */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deal Stage
                    </label>
                    <select
                        value={formData.dealStage}
                        onChange={(e) => handleChange('dealStage', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {stages.map((stage, index) => (
                            <option key={index} value={stage}>{stage}</option>
                        ))}
                    </select>
                </div>

                {/* Probability */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probability(%)<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.probability}
                        onChange={(e) => {
                            const value = e.target.value;

                            // allow only digits
                            if (!/^\d*$/.test(value)) return;

                            // empty is allowed (so user can delete)
                            if (value === "") {
                                handleChange("probability", "");
                                return;
                            }

                            const num = Number(value);

                            // block values greater than 100
                            if (num > 100) return;

                            handleChange("probability", value);
                        }}
                        onKeyDown={(e) => {
                            if (
                                !/[0-9]/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight" &&
                                e.key !== "Tab"
                            ) {
                                e.preventDefault();
                            }
                        }}
                        placeholder="Enter Probability"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />


                </div>

                {/* Sales owner */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sales owner
                    </label>
                    <select
                        value={formData.salesOwner}
                        onChange={(e) => handleChange('salesOwner', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.5rem',
                            paddingRight: '2.5rem'
                        }}
                    >
                        {salesOwners.map((owner, index) => (
                            <option key={index} value={owner}>{owner}</option>
                        ))}
                    </select>
                </div>

                {/* Estimated Closer Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Closer Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.estimatedCloserDate}
                        onChange={(e) => handleChange('estimatedCloserDate', e.target.value)}
                        placeholder="Closure Date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </form>
        </div>
    );
};

export default AddDeal;
