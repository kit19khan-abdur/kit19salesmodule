import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

const COLUMNS = [
  { key: 'PersonName', label: 'Name', placeholder: '' },
  { key: 'Company', label: 'Company', placeholder: 'Company name' },
  { key: 'CsvMobileNo', label: 'Mobile', placeholder: 'Do not add +91' },
  { key: 'CsvEmailId', label: 'Email', placeholder: 'Email' },
  { key: 'City', label: 'City', placeholder: 'City' },
  { key: 'State', label: 'State', placeholder: 'State' },
  { key: 'Country', label: 'Country', placeholder: 'Country' },
  { key: 'Pincode', label: 'Pin code', placeholder: 'Pin code' },
  { key: 'Address', label: 'Address', placeholder: 'Address' }
];

const EnquiryFilterPanel = ({
  show = false,
  onClose = () => {},
  initialFilters = {},
  onApply = () => {}
}) => {

  const [local, setLocal] = useState({});

  useEffect(() => {
    const base = {};
    COLUMNS.forEach(c => {
      base[c.key] = {
        checked: !!initialFilters[c.key],
        condition: 'contains',
        value: initialFilters[c.key] || ''
      };
    });
    setLocal(base);
  }, [initialFilters, show]);

  const toggleColumn = (key) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked }
    }));
  };

  const setCondition = (key, condition) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], condition }
    }));
  };

  const setValue = (key, value) => {
    setLocal(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const handleApply = () => {
    const filters = {};
    Object.keys(local).forEach(k => {
      if (local[k].checked && local[k].value?.trim()) {
        filters[k] = {
          condition: local[k].condition,
          value: local[k].value
        };
      }
    });
    onApply(filters);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed h-screen inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />

      <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-white border-r shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0">
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-lg font-medium">Filters</h3>
          </div>

          <div className="p-4 overflow-auto flex-1">
            {COLUMNS.map(col => {
              const state = local[col.key];
              return (
                <div key={col.key} className="mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded-[2px]"
                      checked={state?.checked || false}
                      onChange={() => toggleColumn(col.key)}
                    />
                    <span className="font-medium">{col.label}</span>
                  </label>

                  {state?.checked && (
                    <div className="mt-2 space-y-2">
                      <select
                        value={state.condition}
                        onChange={e => setCondition(col.key, e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option value="contains">Contains</option>
                        <option value="equals">Equals</option>
                        <option value="starts">Starts With</option>
                      </select>

                      <input
                        value={state.value}
                        onChange={e => setValue(col.key, e.target.value)}
                        placeholder={col.placeholder}
                        className="w-full px-2 py-2 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex-shrink-0 border-t bg-white p-4">
            <div className="flex items-center gap-2 justify-end">
              <button onClick={handleApply} className="bg-green-500 text-white px-4 py-2 rounded">
                Apply
              </button>
              <button onClick={onClose} className="bg-gray-100 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EnquiryFilterPanel;
