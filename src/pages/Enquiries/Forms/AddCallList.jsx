import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const AddCallList = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    callList: '',
    scheduleTime: '',
    specificDateTime: '',
    anyTimeDate: '',
  });

  const callListOptions = [
    { value: 'list1', label: 'Call List 1' },
    { value: 'list2', label: 'Call List 2' },
    { value: 'list3', label: 'Call List 3' },
  ];

  const handleCallListChange = (e) => {
    setFormData({
      ...formData,
      callList: e.target.value,
    });
  };

  const handleScheduleTimeChange = (value) => {
    setFormData({
      ...formData,
      scheduleTime: value,
      specificDateTime: '',
      anyTimeDate: '',
    });
  };

  const handleDateTimeChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    if (formData.callList && formData.scheduleTime && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white">
      {/* Call List Field */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Call List<span className="text-red-500">*</span>
        </label>
        <select
          value={formData.callList}
          onChange={handleCallListChange}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600"
        >
          <option value="">Nothing selected</option>
          {callListOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule Time Field */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Schedule Time<span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="specificTime"
                name="scheduleTime"
                value="specificTime"
                checked={formData.scheduleTime === 'specificTime'}
                onChange={() => handleScheduleTimeChange('specificTime')}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="specificTime" className="text-sm text-gray-800">
                Specific time
              </label>
            </div>
            {formData.scheduleTime === 'specificTime' && (
              <div className="mt-2 ml-7">
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.specificDateTime}
                    onChange={(e) => handleDateTimeChange('specificDateTime', e.target.value)}
                    placeholder="Choose specific time"
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="withoutDateTime"
              name="scheduleTime"
              value="withoutDateTime"
              checked={formData.scheduleTime === 'withoutDateTime'}
              onChange={() => handleScheduleTimeChange('withoutDateTime')}
              className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="withoutDateTime" className="text-sm text-gray-800">
              Without date time
            </label>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="anyTimeThisDay"
                name="scheduleTime"
                value="anyTimeThisDay"
                checked={formData.scheduleTime === 'anyTimeThisDay'}
                onChange={() => handleScheduleTimeChange('anyTimeThisDay')}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="anyTimeThisDay" className="text-sm text-gray-800">
                Any time on this day
              </label>
            </div>
            {formData.scheduleTime === 'anyTimeThisDay' && (
              <div className="mt-2 ml-7">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.anyTimeDate}
                    onChange={(e) => handleDateTimeChange('anyTimeDate', e.target.value)}
                    placeholder="Any time on this day"
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600"
                  />
                  {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCallList;
