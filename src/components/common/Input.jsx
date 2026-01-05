import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  containerClassName = '',
  icon,
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
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'block w-full border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 transition-all bg-white hover:bg-gray-50 focus:bg-white',
            sizeMap[size],
            icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
