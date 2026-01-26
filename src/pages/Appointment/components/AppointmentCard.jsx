import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Video, User, MoreHorizontal, 
  Eye, Edit, Trash2, CheckCircle, Mail, Phone, MessageSquare 
} from 'lucide-react';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../constants';

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
    { id: 'view', icon: Eye, label: 'View Details', color: 'text-blue-600 hover:bg-blue-50' },
    { id: 'edit', icon: Edit, label: 'Edit', color: 'text-gray-600 hover:bg-gray-50' },
    { id: 'complete', icon: CheckCircle, label: 'Mark Complete', color: 'text-green-600 hover:bg-green-50' },
    { id: 'mail', icon: Mail, label: 'Send Mail', color: 'text-purple-600 hover:bg-purple-50' },
    { id: 'sms', icon: MessageSquare, label: 'Send SMS', color: 'text-teal-600 hover:bg-teal-50' },
    { id: 'delete', icon: Trash2, label: 'Delete', color: 'text-red-600 hover:bg-red-50' },
  ];

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 min-w-[200px]"
    >
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => {
            onAction(action.id, appointment);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${action.color}`}
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
      className="bg-white overflow-hidden rounded-xl border border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group relative"
    >
      {/* Left Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${statusConfig.gradient}`} />

      {/* Row Content */}
      <div className="px-6 py-5 flex items-center gap-6 ml-2">
        {/* Type Icon & Title */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <div className={`w-12 h-12 rounded-xl ${typeConfig.bg} flex items-center justify-center ring-2 ring-purple-50 shadow-sm`}>
            <typeConfig.icon className={`w-6 h-6 ${typeConfig.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{appointment.title}</h3>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig.light} ${statusConfig.text}`}>
              <statusConfig.icon className="w-3.5 h-3.5" />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Date & Time - Enhanced */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-900">{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium text-gray-600">{appointment.time}</span>
          </div>
        </div>

        {/* Location - Enhanced */}
        <div className="flex items-center gap-2.5 text-sm text-gray-700 min-w-[220px] bg-gray-50 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-purple-500" />
          <span className="line-clamp-1 font-medium">{appointment.location}</span>
        </div>

        {/* Related To - Enhanced */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ring-2 ring-purple-100">
              <img src={appointment.avatar} className="rounded-full w-full h-full object-cover" alt="avatar" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{appointment.relatedTo}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3" /> 
              <span className="font-medium">{appointment.owner}</span>
            </p>
          </div>
        </div>

        {/* Outcome Badge */}
        {appointment.outcome && (
          <div className="flex-1">
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                {appointment.outcome}
              </span>
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
      whileHover={{ y: -4 }}
      className="bg-white overflow-hidden cursor-pointer rounded-2xl border border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group relative"
    >
      {/* Gradient Header Background */}
      <div className={`h-24 bg-gradient-to-br ${statusConfig.gradient} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        
        {/* Type Icon - Floating */}
        <div className="absolute -bottom-6 left-6">
          <div className={`w-14 h-14 rounded-2xl ${typeConfig.bg} flex items-center justify-center shadow-xl ring-4 ring-white`}>
            <typeConfig.icon className={`w-7 h-7 ${typeConfig.color}`} />
          </div>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-4 right-4" ref={actionsRef}>
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <MoreHorizontal className="w-5 h-5 text-white" />
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

        {/* Status Badge */}
        <div className="absolute bottom-4 right-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${statusConfig.light} ${statusConfig.text} shadow-md`}>
            <statusConfig.icon className="w-3.5 h-3.5" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-10">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-5 line-clamp-2 leading-tight">{appointment.title}</h3>

        {/* Info Grid */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-900">{appointment.date}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-600">{appointment.time}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-600 line-clamp-1">{appointment.location}</span>
          </div>
        </div>

        {/* Related To - Enhanced Card */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ring-2 ring-purple-200">
              <img src={appointment.avatar} className="rounded-full w-full h-full object-cover" alt="avatar" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">{appointment.relatedTo}</p>
            <p className="text-xs text-purple-600 flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3" /> 
              <span className="font-medium">{appointment.owner}</span>
            </p>
          </div>
        </div>

        {/* Outcome */}
        {appointment.outcome && (
          <div className="mt-5 pt-4 border-t border-purple-100">
            <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <p className="text-xs text-green-700 font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {appointment.outcome}
              </p>
              {appointment.completedDate && (
                <p className="text-xs text-gray-600 mt-1.5 ml-6">
                  Completed: {appointment.completedDate} {appointment.completedTime}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
