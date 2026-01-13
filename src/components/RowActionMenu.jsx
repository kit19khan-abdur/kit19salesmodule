import React, { useEffect, useRef } from 'react';
import { Edit, Trash2, Mic, BookCheck, ListChevronsDownUp, Spotlight, CloudUpload, CalendarCheck2 } from 'lucide-react';
import { FaRegMoneyBillAlt, FaUsers } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { SiJfrogpipelines } from 'react-icons/si';
import { GrDocumentConfig } from 'react-icons/gr';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import { GoGitBranch } from 'react-icons/go';

const RowActionMenu = ({ show, anchorRef, onClose, onAction, menuId }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          anchorRef.current && !anchorRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose, anchorRef]);

  if (!show) return null;
  
  return (
    <div
      id={menuId}
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[220px] py-2 mt-2 right-0 max-h-[200px] overflow-y-auto"
      style={{ top: '65%', left: 'auto' }}
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addFollowUp')}><Spotlight className="w-4 h-4 mr-2" />Add FollowUp</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('merge')}><GoGitBranch className="w-4 h-4 mr-2" />Merge Leads</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('edit')}><Edit className="w-4 h-4 mr-2" />Edit all fields</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addTask')}><BookCheck className="w-4 h-4 mr-2" />Add Task</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addDeal')}><SiJfrogpipelines className="w-4 h-4 mr-2" />Add Deal</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('sendVoice')}><Mic className="w-4 h-4 mr-2" />Send Voice</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('uploadDoc')}><CloudUpload className="w-4 h-4 mr-2" />Upload Document</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('meeting')}><FaUsersGear className="w-4 h-4 mr-2" />Create Meeting</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('taxSetting')}><FaRegMoneyBillAlt className="w-4 h-4 mr-2" />Add Tax Setting</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('quotation')}><GrDocumentConfig className="w-4 h-4 mr-2" />Add Quotation</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('invoice')}><HiOutlineDocumentText className="w-4 h-4 mr-2" />Add Invoice</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('physical')}><CalendarCheck2 className="w-4 h-4 mr-2" />Add Physical Appointment</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('appointment')}><FaUsers className="w-4 h-4 mr-2" />Add Appointment</button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('webform')}><ListChevronsDownUp className="w-4 h-4 mr-2" />Web Form</button>
      {/* <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => onAction('delete')}><Trash2 className="w-4 h-4 mr-2" />Delete</button> */}
    </div>
  );
};

export default RowActionMenu;
