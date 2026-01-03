import React from 'react';
import { Edit, Trash2, Mic } from 'lucide-react';
import { FaUsers } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

const RowActionMenu = ({ show, anchorRef, onClose, onAction, menuId }) => {
  if (!show) return null;
  return (
    <div
      id={menuId}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[220px] py-2 mt-2 right-0"
      style={{ top: '85%', left: 'auto' }}
      ref={anchorRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('edit')}><Edit className="w-4 h-4 mr-2" />Edit all fields</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('sendVoice')}><Mic className="w-4 h-4 mr-2" />Send Voice</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('meeting')}><FaUsersGear className="w-4 h-4 mr-2" />Create Meeting</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('appointment')}><FaUsers className="w-4 h-4 mr-2" />Add Physical Appointment</button>
      {/* <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => onAction('delete')}><Trash2 className="w-4 h-4 mr-2" />Delete</button> */}
    </div>
  );
};

export default RowActionMenu;
