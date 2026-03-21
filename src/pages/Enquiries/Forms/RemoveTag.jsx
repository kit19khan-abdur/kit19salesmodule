import React, { useRef, useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const RemoveTag = ({ onClose, onSubmit }) => {
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
      if (typeof dateTimeInputRef.current.showPicker === 'function') {
        dateTimeInputRef.current.showPicker();
      } else {
        dateTimeInputRef.current.click();
      }
    }
  };

  // Format datetime-local (yyyy-MM-ddTHH:mm) to dd-MMM-yyyy hh:MM:ss
  const formatScheduledDate = (datetimeLocal) => {
    if (!datetimeLocal) return '';
    try {
      const [datePart, timePart] = datetimeLocal.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = (timePart || '').split(':').map(Number);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const dd = String(day).padStart(2, '0');
      const MMM = months[(month || 1) - 1] || '';
      const yyyy = String(year);
      const hh = String(hour).padStart(2, '0');
      const MM = String(minute).padStart(2, '0');
      const ss = '00';
      return `${dd}-${MMM}-${yyyy} ${hh}:${MM}:${ss}`;
    } catch (e) {
      return '';
    }
  };

  // return current local datetime in 'yyyy-MM-ddTHH:mm' format for datetime-local inputs
  const getLocalDateTimeLocal = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const MIN = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${HH}:${MIN}`;
  };

  // Parse formatted 'dd-MMM-yyyy hh:MM:ss' into datetime-local 'yyyy-MM-ddTHH:mm'
  const parseFormattedToLocal = (formatted) => {
    if (!formatted) return '';
    try {
      // expected format: 18-Jan-2026 14:30:00
      const [datePart, timePart] = formatted.split(' ');
      if (!datePart || !timePart) return '';
      const [dd, MMM, yyyy] = datePart.split('-');
      const [hh, MM, ss] = timePart.split(':');
      const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
      const mm = months[MMM] || '01';
      const day = String(dd).padStart(2, '0');
      const hour = String(hh).padStart(2, '0');
      const minute = String(MM).padStart(2, '0');
      return `${yyyy}-${mm}-${day}T${hour}:${minute}`;
    } catch (e) {
      return '';
    }
  };

  const handlePickerChange = (e) => {
    const val = e.target.value; // datetime-local value
    if (!val) return;
    const formatted = formatScheduledDate(val);
    setFormData(prev => ({ ...prev, scheduleDateTime: formatted }));
  };

  // When scheduling is enabled and no datetime is set, default to current local datetime (formatted)
  useEffect(() => {
    if (formData.onSchedule && !formData.scheduleDateTime) {
      const formattedNow = formatScheduledDate(getLocalDateTimeLocal());
      setFormData(prev => ({ ...prev, scheduleDateTime: formattedNow }));
    }
  }, [formData.onSchedule]);

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
              type="text"
              name="scheduleDateTime"
              value={formData.scheduleDateTime}
              onChange={handleInputChange}
              onClick={() => {
                if (dateTimeInputRef.current) {
                  if (typeof dateTimeInputRef.current.showPicker === 'function') {
                    dateTimeInputRef.current.showPicker();
                  } else {
                    dateTimeInputRef.current.click();
                  }
                }
              }}
              placeholder="18-Jan-2026 14:30:00"
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleCalendarIconClick();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent"
              title="Pick date & time"
            >
              <Calendar className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
            </button>

            {/* Hidden native picker wired to dateTimeInputRef */}
            <input
              type="datetime-local"
              ref={dateTimeInputRef}
              onChange={handlePickerChange}
              value={parseFormattedToLocal(formData.scheduleDateTime)}
              min={getLocalDateTimeLocal()}
              className="sr-only"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveTag;
