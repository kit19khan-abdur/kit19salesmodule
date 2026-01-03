import React, { useState } from 'react';

const MarketingSequence = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedSequence: '',
    scheduleUpdate: false,
    searchTerm: '',
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sequenceOptions = [
    { value: 'test_seq2', label: 'Test Seq2' },
    { value: 'mass_enquiry_remove_tag', label: 'Mass Enquiry Remove Tag' },
    { value: 'qa_mass_enquiry123', label: 'QA Mass Enquiry123' },
    { value: 'mass_enquiry_add_score', label: 'Mass Enquiry Add Enquiry Score' },
    { value: 'uitherk', label: 'uitherk' },
    { value: 'mass_enquiry_add_segment', label: 'Mass Enquiry Add to Segment' },
    { value: 'yyyiyiyiuuyuyyuyu', label: 'yyyiyiyiuuyuyyuyu' },
    { value: 'mass_enquiry_add_tag', label: 'Mass Enquiry Add Tag' },
  ];

  const filteredOptions = sequenceOptions.filter((option) =>
    option.label.toLowerCase().includes(formData.searchTerm.toLowerCase())
  );

  const handleSequenceChange = (value) => {
    setFormData({
      ...formData,
      selectedSequence: value,
    });
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setFormData({
      ...formData,
      searchTerm: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (formData.selectedSequence && onSubmit) {
      onSubmit({
        sequence: formData.selectedSequence,
        scheduleUpdate: formData.scheduleUpdate,
      });
    }
  };

  const selectedLabel = sequenceOptions.find(
    (opt) => opt.value === formData.selectedSequence
  )?.label || '';

  return (
    <div className="bg-white h-[40vh]">
      {/* Select Sequence */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Select Sequence <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded cursor-pointer bg-white hover:border-gray-400 transition text-gray-700"
          >
            {selectedLabel || 'Select Sequence'}
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-auto">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={formData.searchTerm}
                  onChange={handleSearchChange}
                  placeholder=""
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Accounts Header */}
              <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50">
                --Select Accounts--
              </div>

              {/* Options */}
              <div>
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSequenceChange(option.value)}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition ${
                      formData.selectedSequence === option.value
                        ? 'bg-blue-400 text-white hover:bg-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No sequences found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="scheduleSequence"
                                checked={formData.scheduleUpdate}
                                onChange={(e) =>
                                    setFormData({ ...formData, scheduleUpdate: e.target.checked })
                                }
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="scheduleSequence" className="text-sm text-gray-700">
                                On Schedule Date And Time
                            </label>
                        </div>

    </div>
  );
};

export default MarketingSequence;
