import React, { useState } from 'react';

const ScheduleCallForm = ({ lead, onSave, onCancel }) => {
  const [selectedPhone, setSelectedPhone] = useState(lead?.CsvMobileNo || '');
  const [labelName, setLabelName] = useState('');
  const [scheduleTime, setScheduleTime] = useState(new Date().toISOString().slice(0,16));

  const handleSave = () => {
    const data = {
      phone: selectedPhone,
      labelName,
      scheduleTime
    };
    if (onSave) onSave(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input type="radio" checked={true} readOnly className="w-4 h-4" />
        <div className="text-sm font-medium">{selectedPhone}</div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Label Name</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
          value={labelName}
          onChange={(e) => setLabelName(e.target.value)}
        >
          <option value="">Select Label Name</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Schedule Time*</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
        <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-300 text-sm">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white text-sm">Save</button>
      </div>
    </div>
  );
};

export default ScheduleCallForm;
