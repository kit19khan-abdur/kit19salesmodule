import React, { useEffect } from 'react';
import clsx from 'clsx';

const Drawer = ({ isOpen, onClose, title, children, position = 'right', size = 'md', width }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    half: 'w-1/2 max-w-none',
    wide: 'w-4/5 max-w-none'
  };

  const positionClasses = {
    right: 'right-0 top-0 h-full',
    left: 'left-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  const customStyle = {};
  if (width && (position === 'right' || position === 'left')) {
    customStyle.width = width;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        style={customStyle}
        className={clsx('absolute bg-white border border-gray-200 shadow-2xl flex flex-col', positionClasses[position], !width && (position === 'right' || position === 'left') && sizeClasses[size])}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
