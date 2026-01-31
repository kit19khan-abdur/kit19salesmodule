import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSearch = ({ onClose, onSubmit }) => {
    const [selectedSetting, setSelectedSetting] = useState('');
    const [selectedFields, setSelectedFields] = useState([
        'FollowUp.Type',
        'FollowUp.Status'
    ]);

    // Saved settings
    const savedSettings = [
        'MyFirstFollowUp',
        'testRT',
        'ssssss',
        'FollowUpTemplate1',
        'FollowUpTemplate2'
    ];

    const allFields = [
        'FollowUp.Type',
        'FollowUp.Status',
        'FollowUp.DueDate',
        'FollowUp.ContactNo',
        'FollowUp.RelatedTo',
        'FollowUp.AssignedTo',
        'FollowUp.CreatedDate',
        'FollowUp.CreatedBy',
        'FollowUp.ModifiedDate',
        'FollowUp.ModifiedBy',
        'FollowUp.Remarks',
        'Lead.FirstName',
        'Lead.LastName',
        'Lead.Email',
        'Lead.Mobile',
        'Lead.City',
        'Lead.State',
        'Lead.Country',
        'Lead.LeadSource',
        'Lead.LeadStatus'
    ];

    const handleToggleField = (field) => {
        setSelectedFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    const handleSelectAll = () => {
        setSelectedFields(allFields);
    };

    const handleDeselectAll = () => {
        setSelectedFields([]);
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(selectedFields);
        }
    };

    return (
        <div className="space-y-4">
            {/* Dropdown for Saved Settings */}
            <div className="relative">
                <select
                    value={selectedSetting}
                    onChange={(e) => setSelectedSetting(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white cursor-pointer"
                >
                    <option value="">Select Save Setting</option>
                    {savedSettings.map((setting) => (
                        <option key={setting} value={setting}>
                            {setting}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Select/Deselect All */}
            <div className="flex gap-2">
                <button
                    onClick={handleSelectAll}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Select All
                </button>
                <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Deselect All
                </button>
            </div>

            {/* Fields List */}
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <div className="divide-y divide-gray-200">
                    {allFields.map((field) => (
                        <label
                            key={field}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => handleToggleField(field)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{field}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Selected Count */}
            <div className="text-sm text-gray-600">
                {selectedFields.length} field{selectedFields.length !== 1 ? 's' : ''} selected
            </div>
        </div>
    );
};

export default CustomSearch;
