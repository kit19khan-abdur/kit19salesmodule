import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const CustomSearch = ({ onClose, onSubmit }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFields, setSelectedFields] = useState([
        'Lead.AmountPaid',
        'Lead.AssignedTo'
    ]);

    const allFields = [
        'Lead.AmountPaid',
        'Lead.AssignedTo',
        'Lead.CampaignName',
        'Lead.City',
        'Lead.CompanyName',
        'Lead.Country',
        'Lead.CreatedBy',
        'Lead.CreatedDate',
        'Lead.Description',
        'Lead.Email',
        'Lead.FirstName',
        'Lead.LastName',
        'Lead.LeadSource',
        'Lead.LeadStatus',
        'Lead.Mobile',
        'Lead.ModifiedBy',
        'Lead.ModifiedDate',
        'Lead.Owner',
        'Lead.Phone',
        'Lead.PostalCode',
        'Lead.Product',
        'Lead.Rating',
        'Lead.State',
        'Lead.Street',
        'Lead.Title',
        'Lead.Website'
    ];

    const filteredFields = allFields.filter(field =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleField = (field) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(selectedFields);
        }
    };

    const handleSaveSetting = () => {
        console.log('Saving settings:', selectedFields);
        // Save settings logic here
    };

    return (
        <div className="bg-white rounded-lg w-full max-w-md">
            {/* Header */}
            {/* <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Custom Download</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div> */}

            {/* Search Field */}
            <div className="px-6 pt-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search fields..."
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Checkbox List */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                    {filteredFields.map((field, index) => (
                        <label
                            key={index}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => handleToggleField(field)}
                                className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700">{field}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Form Actions */}
            <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-between items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSaveSetting}
                        className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    >
                        Save Setting
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                    >
                        Download
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomSearch;
