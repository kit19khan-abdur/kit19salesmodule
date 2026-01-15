import React from 'react';
import clsx from 'clsx';

/**
 * ToggleSwitch Component
 * A pill-style toggle switch for switching between multiple options
 */
const ToggleSwitch = ({ options, value, onChange }) => (
  <div className="inline-flex bg-gray-100 rounded-xl p-1">
    {options.map(option => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={clsx(
          'px-4 py-2 text-sm font-medium rounded-lg transition-all',
          value === option.value
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        {option.icon && <option.icon className="w-4 h-4 inline mr-2" />}
        {option.label}
      </button>
    ))}
  </div>
);

export default ToggleSwitch;
