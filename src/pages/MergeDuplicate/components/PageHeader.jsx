import React from 'react';
import clsx from 'clsx';
import { FiRefreshCw } from 'react-icons/fi';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { THEME } from '../../../config/constants';

/**
 * PageHeader Component
 * Top header with title, description and actions
 */
const PageHeader = ({ isLoading, onRefresh }) => (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
    <div className="px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="p-3 rounded-2xl"
            style={{ backgroundColor: `${THEME.primary}15` }}
          >
            <HiOutlineDocumentDuplicate className="w-7 h-7" style={{ color: THEME.primary }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duplicate Manager</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review and merge duplicate records to maintain data quality
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={clsx('w-4 h-4', isLoading && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default PageHeader;
