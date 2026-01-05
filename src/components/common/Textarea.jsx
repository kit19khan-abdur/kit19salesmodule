import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 3,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
