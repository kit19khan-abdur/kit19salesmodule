import React from 'react';
import clsx from 'clsx';
import { THEME } from '../../config/constants';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md';

  const variantClasses = {
    // primary uses inline background to respect runtime THEME.primary
    primary: `text-white`,
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
    outline: '',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const style = {};
  if (variant === 'primary') {
    style.backgroundColor = THEME.primary;
    style.borderColor = THEME.primary;
  }
  if (variant === 'outline') {
    style.border = `2px solid ${THEME.primary}`;
    style.color = THEME.primary;
    // subtle hover handled by css class if present; keep hover background neutral
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
