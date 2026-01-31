import React, { useState, useMemo } from 'react';

const FilterSearch = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState({
    followupType: '',
    dueDateFrom: '',
    dueDateTo: '',
    createdDateFrom: '',
    createdDateTo: '',
    remarks: '',
    relatedTo: '',
    isReAssign: '',
    assignTo: '',
    createdBy: '',
  });

  // Demo data for autocomplete
  const relatedOptions = [
    {
      id: 1,
      name: 'testing432',
      phone: '+91-9780464143',
      location: 'Select State , Afghanistan',
      avatar: 'https://ui-avatars.com/api/?name=testing432',
    },
    {
      id: 2,
      name: 'test34',
      phone: '+91-7877876721',
      location: '',
      avatar: 'https://ui-avatars.com/api/?name=test34',
    },
    {
      id: 3,
      name: 'Tanvi',
      phone: '+91-9316454500',
      location: '',
      avatar: 'https://ui-avatars.com/api/?name=Tanvi',
    },
    {
      id: 4,
      name: 'testing1',
      phone: '+91-7311131213',
      location: '',
      avatar: 'https://ui-avatars.com/api/?name=testing1',
    },
  ];

  const [selectedRelatedIndex, setSelectedRelatedIndex] = useState(-1);
  const [showRelatedDropdown, setShowRelatedDropdown] = useState(false);

  // Filter options based on input
  const filteredRelatedOptions = useMemo(() => {
    if (!form.relatedTo) return [];
    return relatedOptions.filter(opt =>
      opt.name.toLowerCase().includes(form.relatedTo.toLowerCase())
    );
  }, [form.relatedTo]);

  // Select option
  const handleSelectRelated = (option) => {
    setForm((prev) => ({ ...prev, relatedTo: option.name }));
    setSelectedRelatedIndex(-1);
    setShowRelatedDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className=" bg-white rounded-lg w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter By Follow-up type</label>
          <input
            type="text"
            name="followupType"
            value={form.followupType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter follow-up type"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date From</label>
            <input
              type="date"
              name="dueDateFrom"
              value={form.dueDateFrom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date To</label>
            <input
              type="date"
              name="dueDateTo"
              value={form.dueDateTo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created Date From</label>
            <input
              type="date"
              name="createdDateFrom"
              value={form.createdDateFrom}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created Date To</label>
            <input
              type="date"
              name="createdDateTo"
              value={form.createdDateTo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter In Remarks</label>
          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter remarks"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
          <input
            type="text"
            name="relatedTo"
            value={form.relatedTo}
            onChange={e => {
              handleChange(e);
              setShowRelatedDropdown(true);
            }}
            autoComplete="off"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Related To"
            onFocus={() => setShowRelatedDropdown(true)}
            onBlur={() => setTimeout(() => setShowRelatedDropdown(false), 150)}
          />
          {/* Autocomplete dropdown */}
          {form.relatedTo && showRelatedDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
              {filteredRelatedOptions.length === 0 ? (
                <div className="px-4 py-2 text-gray-400">No results found</div>
              ) : (
                filteredRelatedOptions.map((option, idx) => (
                  <div
                    key={option.id}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100 ${selectedRelatedIndex === idx ? 'bg-blue-500 text-white' : ''}`}
                    onMouseDown={() => handleSelectRelated(option)}
                  >
                    <img src={option.avatar} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                    <span className="font-semibold mr-2">{option.name}</span>
                    <span className="text-xs text-gray-600 mr-2">📞 {option.phone}</span>
                    <span className="text-xs text-gray-600 mr-2">📍 {option.location}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Is Re-Assign</label>
          <select
            name="isReAssign"
            value={form.isReAssign}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--None--</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select
            name="assignTo"
            value={form.assignTo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Select Assign to--</option>
            {/* Add options dynamically as needed */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
          <select
            name="createdBy"
            value={form.createdBy}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Select Created By--</option>
            {/* Add options dynamically as needed */}
          </select>
        </div>
      </form>
    </div>
  );
};

export default FilterSearch;
