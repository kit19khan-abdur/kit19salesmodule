import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const AddFollowupForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    status: 'DDPI Activated',
    lead: '34594-Aakash.Jain (Aakash Jain)',
    dateTime: '25-Jan-2026 18:41',
    remarks: '',
    products: '',
    reAssign: false
  });

  const statusOptions = [
    'Documents Approved',
    'Traiding Account Opened',
    'DDPI Activated',
    'Call-Back',
    'Not-Interested',
    'Dead Lead',
    'Wrong Number',
    'Converted',
    'Not reachable',
    'Not repsponding',
    'Positive lead',
    'Hot lead',
    'SW off',
    'Black hole',
    'New Lead',
    'Ringing',
    'Payment recived',
    'New activity',
    'new',
    'newpipeline'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Add Follow-Up</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Status Dropdown */}
        <div>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            {statusOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Dropdown */}
        <div>
          <select
            value={formData.lead}
            onChange={(e) => handleChange('lead', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            <option value="34594-Aakash.Jain (Aakash Jain)">34594-Aakash.Jain (Aakash Jain)</option>
            {/* Add more lead options as needed */}
          </select>
        </div>

        {/* Date Time Picker */}
        <div className="relative">
          <input
            type="text"
            value={formData.dateTime}
            onChange={(e) => handleChange('dateTime', e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Select date and time"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Remarks Textarea */}
        <div>
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="Remarks"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Choose Products */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Products <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.products}
            onChange={(e) => handleChange('products', e.target.value)}
            placeholder="Enter product"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Follow Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Follow Type
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reAssign"
              checked={formData.reAssign}
              onChange={(e) => handleChange('reAssign', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="reAssign" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Re Assign
            </label>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AddFollowupForm;
