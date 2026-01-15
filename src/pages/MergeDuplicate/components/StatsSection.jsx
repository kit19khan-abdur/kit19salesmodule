import React from 'react';
import { FiLayers, FiPhone, FiMail, FiAlertCircle } from 'react-icons/fi';
import { THEME } from '../../../config/constants';
import StatsCard from './StatsCard';

/**
 * StatsSection Component
 * Dashboard stats showing duplicate metrics
 */
const StatsSection = ({ stats }) => (
  <div className="px-8 py-6">
    <div className="grid grid-cols-4 gap-4">
      <StatsCard 
        icon={FiLayers} 
        label="Total Duplicates" 
        value={stats.total} 
        color={THEME.primary}
      />
      <StatsCard 
        icon={FiPhone} 
        label="Mobile Matches" 
        value={stats.mobile} 
        color="#8B5CF6"
      />
      <StatsCard 
        icon={FiMail} 
        label="Email Matches" 
        value={stats.email} 
        color="#F59E0B"
      />
      <StatsCard 
        icon={FiAlertCircle} 
        label="Pending Merges" 
        value={stats.pending} 
        color="#EF4444"
      />
    </div>
  </div>
);

export default StatsSection;
