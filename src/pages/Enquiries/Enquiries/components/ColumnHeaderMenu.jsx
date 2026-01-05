import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Filter, EyeOff, Pin } from 'lucide-react';

const ColumnHeaderMenu = ({
  show,
  onClose,
  onSortAsc,
  onSortDesc,
  onPin,
  onFilter,
  onHide,
  anchorRef,
  canHide = true
}) => {
  const menuRef = useRef(null);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onClose, anchorRef]);

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm right-0"
    >
      <button
        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
        onClick={onSortAsc}
      >
        <ArrowUp className="w-4 h-4 mr-2" /> Sort Asc
      </button>

      <button
        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
        onClick={onSortDesc}
      >
        <ArrowDown className="w-4 h-4 mr-2" /> Sort Desc
      </button>

      <button
        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
        onClick={onPin}
      >
        <Pin className="w-4 h-4 mr-2" /> Pin Column
      </button>

      {/* FILTER INPUT */}
      <div className="px-3 py-2">
        <div className="flex items-center mb-1 text-gray-600">
          <Filter className="w-4 h-4 mr-1" /> Filter
        </div>
        <input
          type="text"
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            onFilter(e.target.value);
          }}
          placeholder="Type to filter..."
          className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring"
        />
      </div>

      <button
        className={`flex items-center w-full px-3 py-2 ${
          canHide 
            ? 'hover:bg-gray-100 text-red-600 cursor-pointer' 
            : 'text-gray-400 cursor-not-allowed opacity-50'
        }`}
        onClick={canHide ? onHide : undefined}
        disabled={!canHide}
      >
        <EyeOff className="w-4 h-4 mr-2" /> Hide Column
      </button>
    </div>
  );
};

export default ColumnHeaderMenu;
