import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Video, User, MoreHorizontal, 
  Eye, Edit, Trash2, CheckCircle, Mail, Phone, MessageSquare, 
  CheckCircle2,
  MessageCircle,
  Mic2,
  FileText,
  Upload,
  BadgePercent
} from 'lucide-react';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../constants';
import { BsClipboard2Check } from 'react-icons/bs';
import { LuCalendarCheck } from 'react-icons/lu';
import { TfiLayoutAccordionList } from 'react-icons/tfi';

// Action Menu Component
const ActionMenu = ({ show, onClose, onAction, appointment }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  const actions = [
        { id: 'followup', icon: CheckCircle2, label: 'Add Followup', color: 'text-emerald-500 hover:bg-emerald-50' },
        { id: 'mail', icon: Mail, label: 'Send Mail', color: 'text-blue-500 hover:bg-blue-50' },
        { id: 'sms', icon: MessageCircle, label: 'Send SMS', color: 'text-blue-500 hover:bg-blue-50' },
        { id: 'voice', icon: Mic2, label: 'Send Voice', color: 'text-orange-500 hover:bg-orange-50' },
        { id: 'notes', icon: FileText, label: 'Add Notes', color: 'text-cyan-500 hover:bg-cyan-50' },
        { id: 'upload', icon: Upload, label: 'Upload Document', color: 'text-pink-500 hover:bg-pink-50' },
        { id: 'addtask', icon: BsClipboard2Check, label: 'Add Task', color: 'text-blue-700 hover:bg-blue-50' },
        { id: 'addappointment', icon: LuCalendarCheck, label: 'Add Appointment', color: 'text-cyan-700 hover:bg-cyan-50' },
        { id: 'adddeal', icon: BadgePercent, label: 'Add Deal', color: 'text-green-500 hover:bg-green-50' },
        { id: 'fillWebform', icon: TfiLayoutAccordionList, label: 'Fill Webform', color: 'text-yellow-500 hover:bg-yellow-50' },
    ];

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[100] max-h-[450px] overflow-y-auto w-auto"
      style={{
        top: menuRef.current?.parentElement?.getBoundingClientRect().bottom + 'px' || 'auto',
        right: Math.max(10, window.innerWidth - (menuRef.current?.parentElement?.getBoundingClientRect().right || window.innerWidth)) + 'px',
        minWidth: '200px',
        maxWidth: '280px'
      }}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => {
            onAction(action.id, appointment);
            onClose();
          }}
          className={`w-full text-left whitespace-nowrap flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${action.color}`}
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </motion.div>
  );
};

// List View Row Component
const AppointmentListRow = ({ appointment, onAction }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);
  const statusConfig = APPOINTMENT_STATUS[appointment.status];
  const typeConfig = APPOINTMENT_TYPES[appointment.type];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group relative"
    >
      {/* Left Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.color}`} />

      {/* Row Content */}
      <div className="px-4 py-3 flex items-center gap-4 ml-1">
        {/* Type Icon & Title */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className={`w-9 h-9 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
            <typeConfig.icon className={`w-4 h-4 ${typeConfig.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{appointment.title}</h3>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${statusConfig.light} ${statusConfig.text}`}>
              <statusConfig.icon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            <span>{appointment.time}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-gray-600 min-w-[180px]">
          <MapPin className="w-3.5 h-3.5" />
          <span className="line-clamp-1">{appointment.location}</span>
        </div>

        {/* Related To */}
        <div className="flex items-center gap-2 min-w-[200px]">
          <img src={appointment.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-xs truncate">{appointment.relatedTo}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <User className="w-3 h-3" /> 
              <span>{appointment.owner}</span>
            </p>
          </div>
        </div>

        {/* Outcome Badge */}
        {appointment.outcome && (
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="font-medium">{appointment.outcome}</span>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          <AnimatePresence>
            {showActions && (
              <ActionMenu
                show={showActions}
                onClose={() => setShowActions(false)}
                onAction={onAction}
                appointment={appointment}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Main AppointmentCard Component (Grid View)
const AppointmentCard = ({ appointment, onAction, viewMode = 'grid' }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);
  const statusConfig = APPOINTMENT_STATUS[appointment.status];
  const typeConfig = APPOINTMENT_TYPES[appointment.type];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render list view
  if (viewMode === 'list') {
    return <AppointmentListRow appointment={appointment} onAction={onAction} />;
  }

  // Render grid view (card)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white overflow-hidden cursor-pointer rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group relative"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center`}>
            <typeConfig.icon className={`w-4 h-4 ${typeConfig.color}`} />
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.light} ${statusConfig.text}`}>
            <statusConfig.icon className="w-3 h-3" />
            {statusConfig.label}
          </span>
        </div>
        
        {/* Actions Menu */}
        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
          <AnimatePresence>
            {showActions && (
              <ActionMenu
                show={showActions}
                onClose={() => setShowActions(false)}
                onAction={onAction}
                appointment={appointment}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2">{appointment.title}</h3>

        {/* Info Grid */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="w-3.5 h-3.5" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{appointment.location}</span>
          </div>
        </div>

        {/* Related To */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="relative">
            <img src={appointment.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-xs truncate">{appointment.relatedTo}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <User className="w-3 h-3" /> 
              <span>{appointment.owner}</span>
            </p>
          </div>
        </div>

        {/* Outcome */}
        {appointment.outcome && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="font-medium">{appointment.outcome}</span>
            </div>
            {appointment.completedDate && (
              <p className="text-xs text-gray-500 mt-1">
                {appointment.completedDate} {appointment.completedTime}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
