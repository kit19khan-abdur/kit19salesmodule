import React, { useState } from 'react';

const SendVoice = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedNumbers: ['+91 9780464143'],
    dniNumber: '',
    appFlow: '',
    voiceType: 'promotional' // 'promotional' or 'transactional'
  });

  const availableNumbers = [
    '+91 9780464143',
    '+91 9876543210',
    '+91 8765432109'
  ];

  const dniNumbers = [
    'Please select DNI number',
    'DNI-001',
    'DNI-002',
    'DNI-003',
    'DNI-004'
  ];

  const appFlows = [
    'Please select App flow',
    'Welcome Flow',
    'Follow-up Flow',
    'Reminder Flow',
    'Notification Flow'
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

  const handleNumberCheckbox = (number) => {
    setFormData(prev => ({
      ...prev,
      selectedNumbers: prev.selectedNumbers.includes(number)
        ? prev.selectedNumbers.filter(n => n !== number)
        : [...prev.selectedNumbers, number]
    }));
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-2xl">

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Choose Mobile Numbers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Mobile Numbers
          </label>
          <div className="space-y-2">
            {availableNumbers.map((number) => (
              <div key={number} className="flex items-center">
                <input
                  type="checkbox"
                  id={number}
                  checked={formData.selectedNumbers.includes(number)}
                  onChange={() => handleNumberCheckbox(number)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor={number} className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {number}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* DNI Number Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.dniNumber}
            onChange={(e) => handleChange('dniNumber', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            {dniNumbers.map((dni, index) => (
              <option key={index} value={dni} disabled={index === 0}>
                {dni}
              </option>
            ))}
          </select>
        </div>

        {/* App Flow Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.appFlow}
            onChange={(e) => handleChange('appFlow', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            {appFlows.map((flow, index) => (
              <option key={index} value={flow} disabled={index === 0}>
                {flow}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Type Radio Buttons */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="promotional"
              name="voiceType"
              value="promotional"
              checked={formData.voiceType === 'promotional'}
              onChange={(e) => handleChange('voiceType', e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="promotional" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
              Promotional
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="transactional"
              name="voiceType"
              value="transactional"
              checked={formData.voiceType === 'transactional'}
              onChange={(e) => handleChange('voiceType', e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="transactional" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
              Transactional
            </label>
          </div>
        </div>


      </form>
    </div>
  );
};

export default SendVoice;
