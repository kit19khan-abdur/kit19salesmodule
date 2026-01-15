import React from 'react';
import clsx from 'clsx';

/**
 * StatsCard Component
 * Displays a metric card with icon, label, value and optional trend
 */
const StatsCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className={clsx('text-xs mt-1', trend > 0 ? 'text-emerald-600' : 'text-red-500')}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
          </p>
        )}
      </div>
      <div 
        className="p-3 rounded-xl"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </div>
);

export default StatsCard;
