import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const MassUpdateEnquiry = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedField: '',
    fieldValue: '',
    scheduleUpdate: false,
  });

  const [addedFields, setAddedFields] = useState([]);

  const fieldOptions = [
    { value: 'PersonName', label: 'PersonName' },
    { value: 'CompanyName', label: 'CompanyName' },
    { value: 'City', label: 'City' },
    { value: 'State', label: 'State' },
    { value: 'Country', label: 'Country' },
    { value: 'PinCode', label: 'PinCode' },
    { value: 'ResidentialAddress', label: 'ResidentialAddress' },
    { value: 'OfficeAddress', label: 'OfficeAddress' },
    { value: 'SourceName', label: 'SourceName' },
    { value: 'MediumName', label: 'MediumName' },
    { value: 'CampaignName', label: 'CampaignName' },
    { value: 'ProductName', label: 'ProductName' },
    { value: 'Budget', label: 'Budget' },
    { value: 'Email', label: 'Email' },
    { value: 'Mobile', label: 'Mobile' },
  ];

  const handleFieldChange = (e) => {
    setFormData({
      ...formData,
      selectedField: e.target.value,
    });
  };

  const handleValueChange = (e) => {
    setFormData({
      ...formData,
      fieldValue: e.target.value,
    });
  };

  const handleAddField = () => {
    if (formData.selectedField && formData.fieldValue) {
      const fieldLabel = fieldOptions.find(opt => opt.value === formData.selectedField)?.label;
      setAddedFields([
        ...addedFields,
        {
          id: Date.now(),
          fieldName: fieldLabel || formData.selectedField,
          fieldValue: formData.fieldValue,
          fieldKey: formData.selectedField,
        },
      ]);
      setFormData({
        ...formData,
        selectedField: '',
        fieldValue: '',
      });
    }
  };

  const handleRemoveField = (id) => {
    setAddedFields(addedFields.filter(field => field.id !== id));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        fields: addedFields,
        scheduleUpdate: formData.scheduleUpdate,
      });
    }
  };

  // Filter out already-used fields
  const availableOptions = fieldOptions.filter(
    (option) => !addedFields.some((field) => field.fieldKey === option.value)
  );

  return (
    <div className="bg-white">
      {/* Field Selection */}
      <div className="mb-4">
        <select
          value={formData.selectedField}
          onChange={handleFieldChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600"
        >
          <option value="">Please Select Field</option>
          {availableOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Field Value Input */}
      <div className="mb-4">
        <input
          type="text"
          value={formData.fieldValue}
          onChange={handleValueChange}
          placeholder=""
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddField}
          disabled={!formData.selectedField || !formData.fieldValue}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Added Fields Table */}
      {addedFields.length > 0 && (
        <div className="mb-6 border border-gray-200 rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Field Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Field Value
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 w-16">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {addedFields.map((field) => (
                <tr key={field.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="px-4 py-3 text-gray-700">
                    {field.fieldName}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {field.fieldValue}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="p-1 text-gray-600 hover:text-red-600 transition bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="scheduleUpdate"
            checked={formData.scheduleUpdate}
            onChange={(e) => setFormData({ ...formData, scheduleUpdate: e.target.checked })}
            className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="scheduleUpdate" className="text-sm text-gray-700">
            On Schedule Date And Time
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={addedFields.length === 0}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default MassUpdateEnquiry;
