import React from 'react';
import clsx from 'clsx';
import { FiPhone } from 'react-icons/fi';
import { THEME } from '../../../config/constants';
import Avatar from './Avatar';
import { formatDate } from '../utils/helpers';

/**
 * DuplicateCard Component
 * Card showing a duplicate group in the left panel
 */
const DuplicateCard = ({ record, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      'p-4 rounded-xl cursor-pointer transition-all border-2',
      isSelected 
        ? 'border-blue-500 bg-blue-50/50 shadow-md' 
        : 'border-transparent bg-white hover:bg-gray-50 hover:shadow-sm'
    )}
  >
    <div className="flex items-start gap-4">
      <Avatar name={record.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{record.name}</h3>
          <span 
            className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: THEME.primary }}
          >
            {record.matchCount}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5 truncate">{record.company || 'No company'}</p>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <FiPhone className="w-3.5 h-3.5" />
            {record.mobile}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
      <span className="text-xs text-gray-400">{formatDate(record.createdDate)}</span>
      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{record.source}</span>
    </div>
  </div>
);

export default DuplicateCard;
