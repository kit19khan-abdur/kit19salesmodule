import React, { useState } from 'react';

const SendVoiceForm = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [dniNumber, setDniNumber] = useState('');
  const [appFlow, setAppFlow] = useState('');
  const [messageType, setMessageType] = useState('promotional');
  const [duration, setDuration] = useState('60');

  const mobileNumbers = ['8990005555', '9876543210', '8765432109'];
  const dniNumbers = [
    'DNI-001 - Sales Department',
    'DNI-002 - Marketing Team',
    'DNI-003 - Support Center'
  ];
  const appFlows = [
    'Welcome Flow',
    'Follow Up Flow',
    'Promotional Flow',
    'Transactional Flow'
  ];

  const handleNumberToggle = (number) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  return (
    <div className="w-full max-h-[600px] overflow-y-auto px-1">
      {/* Choose Mobile Numbers */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Mobile Numbers</h3>
        <div className="space-y-2">
          {mobileNumbers.map((number, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedNumbers.includes(number)}
                onChange={() => handleNumberToggle(number)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{number}</span>
            </label>
          ))}
        </div>
      </div>

      {/* DNI Number Dropdown */}
      <div className="mb-6">
        <select
          value={dniNumber}
          onChange={(e) => setDniNumber(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Please select DNI number</option>
          {dniNumbers.map((dni, index) => (
            <option key={index} value={dni}>
              {dni}
            </option>
          ))}
        </select>
      </div>

      {/* App Flow Dropdown */}
      <div className="mb-6">
        <select
          value={appFlow}
          onChange={(e) => setAppFlow(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Please select App flow</option>
          {appFlows.map((flow, index) => (
            <option key={index} value={flow}>
              {flow}
            </option>
          ))}
        </select>
      </div>

      {/* Message Type Radio Buttons */}
      <div className="mb-6 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="messageType"
            value="promotional"
            checked={messageType === 'promotional'}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Promotional</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="messageType"
            value="transactional"
            checked={messageType === 'transactional'}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Transactional</span>
        </label>
      </div>

      {/* Duration Input */}
      <div className="mb-4">
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (Default 60 seconds)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default SendVoiceForm;
