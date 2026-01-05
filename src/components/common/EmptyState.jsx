import React from 'react';
import { THEME } from '../../config/constants';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
          style={{ backgroundColor: THEME.primary }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
