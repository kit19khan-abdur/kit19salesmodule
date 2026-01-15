import React from 'react';
import clsx from 'clsx';
import { FiPhone, FiMail, FiCalendar, FiCheckCircle, FiCheck, FiCopy, FiLayers } from 'react-icons/fi';
import Avatar from './Avatar';
import { formatDate } from '../utils/helpers';

/**
 * ComparisonRecord Component
 * Displays a detailed record card in the comparison view
 */
const ComparisonRecord = ({ record, isPrimary, isSelected, onSelect, onSetPrimary }) => (
  <div 
    className={clsx(
      'relative p-5 rounded-xl border-2 transition-all',
      isPrimary 
        ? 'border-emerald-400 bg-emerald-50/30' 
        : isSelected 
          ? 'border-blue-400 bg-blue-50/30'
          : 'border-gray-200 bg-white hover:border-gray-300'
    )}
  >
    {isPrimary && (
      <div className="absolute -top-3 left-4 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
        Primary Record
      </div>
    )}
    
    <div className="flex items-start justify-between mt-1">
      <div className="flex items-center gap-4">
        <Avatar name={record.name} size="lg" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{record.name}</h4>
          <p className="text-sm text-gray-500">{record.source} • {formatDate(record.createdDate)}</p>
        </div>
      </div>
      
      {!isPrimary && (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onSetPrimary(); }}
            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Set as Primary"
          >
            <FiCheckCircle className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isSelected 
                ? 'text-blue-600 bg-blue-100' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
            )}
            title={isSelected ? 'Deselect' : 'Select for merge'}
          >
            {isSelected ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
          </button>
        </div>
      )}
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-5">
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <FiPhone className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Mobile</p>
            <p className="text-sm font-medium text-gray-700">{record.mobile || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <FiMail className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-700 break-all">{record.email || '-'}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Created</p>
            <p className="text-sm font-medium text-gray-700">{formatDate(record.createdDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <FiLayers className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Source</p>
            <p className="text-sm font-medium text-gray-700">{record.source || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ComparisonRecord;
