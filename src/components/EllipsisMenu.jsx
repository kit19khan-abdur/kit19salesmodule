import React, { useState, useLayoutEffect } from 'react';
import { Mail, MessageSquare, Upload, FilePlus, Phone, PlusSquare, Calendar, Tag, FileText } from 'lucide-react';

const EllipsisMenu = ({ show, anchorRef, onClose, onAction, menuId }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!show || !anchorRef || !anchorRef.current) return undefined;
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + 6;
    const left = rect.left - 8;
    setPos({ top, left });
    const handleResize = () => {
      if (!anchorRef.current) return;
      const r = anchorRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left - 8 });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [show, anchorRef]);

  if (!show) return null;

  return (
    <div
      id={menuId}
      className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[220px] py-2"
      style={{ position: 'fixed', top: pos.top, left: pos.left }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addFollowup')}>
        <FilePlus className="w-4 h-4 mr-2" />Add Followup
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('sendMail')}>
        <Mail className="w-4 h-4 mr-2" />Send Mail
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('sendSMS')}>
        <MessageSquare className="w-4 h-4 mr-2" />Send SMS
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('sendVoice')}>
        <Phone className="w-4 h-4 mr-2" />Send Voice
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addNotes')}>
        <MessageSquare className="w-4 h-4 mr-2" />Add Notes
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('uploadDocument')}>
        <Upload className="w-4 h-4 mr-2" />Upload Document
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addTask')}>
        <PlusSquare className="w-4 h-4 mr-2" />Add Task
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addAppointment')}>
        <Calendar className="w-4 h-4 mr-2" />Add Appointment
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('addDeal')}>
        <Tag className="w-4 h-4 mr-2" />Add Deal
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => onAction('fillWebform')}>
        <FileText className="w-4 h-4 mr-2" />Fill Webform
      </button>
    </div>
  );
};

export default EllipsisMenu;
