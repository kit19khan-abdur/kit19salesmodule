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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!show) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onClose, anchorRef]);

  useEffect(() => {
    if (show && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuWidth = 176; // w-44 = 11rem = 176px
      const viewportWidth = window.innerWidth;
      
      let left = rect.left + window.scrollX;
      
      // Check if menu would overflow on the right side
      if (rect.left + menuWidth > viewportWidth) {
        // Position menu to the left of the anchor
        left = rect.right - menuWidth + window.scrollX;
      }
      
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: left
      });
    }
  }, [show, anchorRef]);

  if (!show) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-44 bg-white border border-gray-200 rounded shadow-lg py-2 text-sm"
      style={{ top: menuPosition.top, left: menuPosition.left }}
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
