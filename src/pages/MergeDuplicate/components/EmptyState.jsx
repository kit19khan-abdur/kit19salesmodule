import React from 'react';

/**
 * EmptyState Component
 * Displays when there's no data to show
 */
const EmptyState = ({ title, description, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
      <Icon className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-center max-w-md">{description}</p>
  </div>
);

export default EmptyState;
