import React from 'react';
import clsx from 'clsx';
import { THEME } from '../../config/constants';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Table = ({ 
  columns, 
  data, 
  onRowClick,
  selectedRows = [],
  onSelectRow,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {onSelectRow && (
              <th scope="col" className="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  style={{ color: THEME.primary }}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectRow(data.map(item => item.id));
                    } else {
                      onSelectRow([]);
                    }
                  }}
                  checked={selectedRows.length === data.length && data.length > 0}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.className
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            // render skeleton rows
            Array.from({ length: 6 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`}>
                {onSelectRow && (
                  <td className="px-6 py-4">
                    <Skeleton width={18} height={18} circle />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    <div className="space-y-2">
                      <Skeleton height={12} width={`80%`} />
                      <Skeleton height={10} width={`50%`} />
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onSelectRow ? 1 : 0)} className="px-6 py-12 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={clsx(onRowClick && 'cursor-pointer hover:bg-gray-50')}
              >
                {onSelectRow && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      style={{ color: THEME.primary }}
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          onSelectRow([...selectedRows, row.id]);
                        } else {
                          onSelectRow(selectedRows.filter(id => id !== row.id));
                        }
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={clsx(
                      'px-6 py-4 whitespace-nowrap text-sm',
                      column.cellClassName
                    )}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
