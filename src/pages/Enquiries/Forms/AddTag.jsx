import React, { useRef, useState } from 'react';
import { Calendar } from 'lucide-react';

const AddTag = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    searchTag: '',
    selectedTag: '',
    scheduleDateTime: '',
    onSchedule: false,
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dateTimeInputRef = useRef(null);

  // Sample tag options - replace with actual data
  const tagOptions = [
    { value: 'rafce', label: 'rafce' },
    { value: 'react', label: 'react' },
    { value: 'redux', label: 'redux' },
    { value: 'router', label: 'router' },
  ];

  const filteredTags = tagOptions.filter((tag) =>
    tag.label.toLowerCase().includes(formData.searchTag.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setFormData({
      ...formData,
      searchTag: e.target.value,
    });
    setIsDropdownOpen(true);
  };

  const handleTagSelect = (tag) => {
    setFormData({
      ...formData,
      searchTag: tag.label,
      selectedTag: tag.value,
    });
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (formData.selectedTag && onSubmit) {
      onSubmit(formData);
    }
  };

  const handleCalendarIconClick = () => {
    if (dateTimeInputRef.current) {
      dateTimeInputRef.current.showPicker();
    }
  };

  return (
    <div className="bg-white h-[40vh]">
      {/* Tag Search/Select Field */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            value={formData.searchTag}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search tags..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          />
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-auto">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div
                    key={tag.value}
                    onClick={() => handleTagSelect(tag)}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition text-gray-700"
                  >
                    {tag.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No tags found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* On Schedule Checkbox */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="onSchedule"
          name="onSchedule"
          checked={formData.onSchedule}
          onChange={handleInputChange}
          className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="onSchedule" className="text-sm font-medium text-gray-800">
          On Schedule Date And Time
        </label>
      </div>

      {/* Schedule Date and Time - Only show when checkbox is checked */}
      {formData.onSchedule && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Schedule Date and Time<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              ref={dateTimeInputRef}
              type="datetime-local"
              name="scheduleDateTime"
              value={formData.scheduleDateTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-0"
              style={{ colorScheme: 'light' }}
            />
            <Calendar 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
              onClick={handleCalendarIconClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTag;
