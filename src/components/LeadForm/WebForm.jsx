import React, { useState } from 'react';

const sampleWebforms = [
  'yooutube',
  'contact_us',
  'lead_capture',
  'demo_request'
];

const WebForm = ({ onSubmit, onClose, initial = {} }) => {
  const [selected, setSelected] = useState(initial.selected || sampleWebforms[0]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selected) {
      alert('Please select a webform');
      return;
    }
    if (onSubmit) onSubmit({ webform: selected });
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Webform</label>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            {sampleWebforms.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

      </form>
    </div>
  );
};

export default WebForm;
