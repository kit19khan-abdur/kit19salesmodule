import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  size = 'md',
  ...props
}, ref) => {
  const sizeMap = {
    sm: 'px-2 py-1 text-sm rounded-md',
    md: 'px-3 py-2 text-sm rounded-lg',
    lg: 'px-4 py-3 text-base rounded-lg'
  };
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
          sizeMap[size],
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
