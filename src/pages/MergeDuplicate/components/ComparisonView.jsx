import React from 'react';
import { FiLayers, FiEye } from 'react-icons/fi';
import { THEME } from '../../../config/constants';
import ComparisonRecord from './ComparisonRecord';
import EmptyState from './EmptyState';

/**
 * ComparisonView Component
 * Right panel showing detailed comparison of duplicate records
 */
const ComparisonView = ({ 
  selectedRecord,
  primaryRecord,
  selectedForMerge,
  onToggleMergeSelect,
  onSetPrimary,
  onSelectAll,
  onMerge 
}) => (
  <div className="col-span-8">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {selectedRecord ? (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="font-semibold text-gray-800">
                Comparing {1 + (selectedRecord.duplicates?.length || 0)} Records
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Select records to merge and choose a primary record
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onSelectAll}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Select All
              </button>
              <button
                onClick={onMerge}
                disabled={selectedForMerge.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: THEME.primary }}
              >
                <FiLayers className="w-4 h-4" />
                Merge {selectedForMerge.length > 0 ? `(${selectedForMerge.length})` : ''}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[calc(100vh-420px)] overflow-y-auto">
            {/* Primary Record */}
            <ComparisonRecord
              record={primaryRecord || selectedRecord}
              isPrimary={true}
              isSelected={false}
              onSelect={() => {}}
              onSetPrimary={() => {}}
            />

            {/* Duplicate Records */}
            {selectedRecord.duplicates?.map(duplicate => (
              <ComparisonRecord
                key={duplicate.id}
                record={duplicate}
                isPrimary={primaryRecord?.id === duplicate.id}
                isSelected={selectedForMerge.some(d => d.id === duplicate.id)}
                onSelect={() => onToggleMergeSelect(duplicate)}
                onSetPrimary={() => onSetPrimary(duplicate)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={FiEye}
          title="Select a Duplicate Group"
          description="Choose a duplicate group from the left panel to view and compare records."
        />
      )}
    </div>
  </div>
);

export default ComparisonView;
