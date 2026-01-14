import React, { useState, useRef, useEffect } from 'react';
import {
    Phone, Mail, MessageSquare, FileText, Upload, Plus,
    Clock, User, Calendar, MoreHorizontal, CheckCircle2, Eye
} from 'lucide-react';
import { GiFullPizza } from "react-icons/gi";
import { motion, AnimatePresence } from 'framer-motion';
import { statusConfig } from '../constants';

// Icon mapping for dynamic icon rendering
const iconMap = {
    CheckCircle2,
    Mail,
    MessageSquare,
    Phone,
    FileText,
    Upload,
}

// Quick Actions Configuration
const quickActions = [
    { id: 'followup', icon: CheckCircle2, label: 'Add Followup', color: 'text-emerald-500 hover:bg-emerald-50' },
    { id: 'mail', icon: Mail, label: 'Send Mail', color: 'text-blue-500 hover:bg-blue-50' },
    { id: 'sms', icon: MessageSquare, label: 'Send SMS', color: 'text-purple-500 hover:bg-purple-50' },
    { id: 'voice', icon: Phone, label: 'Send Voice', color: 'text-orange-500 hover:bg-orange-50' },
    { id: 'notes', icon: FileText, label: 'Add Notes', color: 'text-cyan-500 hover:bg-cyan-50' },
    { id: 'upload', icon: Upload, label: 'Upload Doc', color: 'text-pink-500 hover:bg-pink-50' },
    { id: 'addTask', icon: Plus, label: 'Add Task', color: 'text-gray-500 hover:bg-gray-50' },
    { id: 'addAppointment', icon: Calendar, label: 'Add Appointment', color: 'text-yellow-500 hover:bg-yellow-50' },
    { id: 'addDeal', icon: GiFullPizza, label: 'Add Deal', color: 'text-green-500 hover:bg-green-50' },
];

// Action Menu Component
const ActionMenu = ({ show, onClose, onAction, followup }) => {
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

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute max-h-[270px] overflow-y-auto right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 min-w-[180px]"
        >
            {quickActions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => {
                        onAction(action.id, followup);
                        onClose();
                    }}
                    className={`w-full text-nowrap flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${action.color}`}
                >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                </button>
            ))}
        </motion.div>
    );
};

// List View Row Component
const FollowupListRow = ({ followup, onAction }) => {
    const [showActions, setShowActions] = useState(false);
    const config = statusConfig[followup.status];
    const actionsRef = useRef(null);

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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group relative"
        >
            {/* Status Bar */}
            <div className={`h-1 bg-gradient-to-r ${config.gradient} rounded-t-2xl`} />

            {/* Row Content */}
            <div className="px-5 py-4 flex items-center gap-6">
                {/* Type & Status */}
                <div className="flex items-center gap-3 min-w-[200px]">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}>
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{followup.type}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.light} ${config.text}`}>
                            <config.icon className="w-3 h-3" />
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-3 min-w-[220px]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        <img src="https://kit19.com/assets/custom/img/img_avatar.png" className='rounded-full' alt="person" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{followup.relatedTo}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" /> {followup.assignedTo}
                        </p>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-6 text-sm text-gray-500 min-w-[200px]">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{followup.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{followup.dueTime}</span>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onAction('followup', followup)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Followup
                    </button>
                    <button
                        onClick={() => onAction('view', followup)}
                        className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
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
                                    followup={followup}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Main FollowupCard Component (Grid View)
const FollowupCard = ({ followup, onAction, viewMode = 'grid' }) => {
    const [showActions, setShowActions] = useState(false);
    const config = statusConfig[followup.status];
    const actionsRef = useRef(null);

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
        return <FollowupListRow followup={followup} onAction={onAction} />;
    }

    // Render grid view (original card)
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group relative"
        >
            {/* Status Bar */}
            <div className={`h-1.5 bg-gradient-to-r ${config.gradient} rounded-t-2xl`} />

            {/* Card Content */}
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{followup.type}</h3>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${config.light} ${config.text}`}>
                                <config.icon className="w-3 h-3" />
                                {config.label}
                            </span>
                        </div>
                    </div>
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
                                    followup={followup}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            <img src="https://kit19.com/assets/custom/img/img_avatar.png" className='rounded-full' alt="person" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">{followup.relatedTo}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <User className="w-3 h-3" /> {followup.assignedTo}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{followup.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{followup.dueTime}</span>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => onAction('followup', followup)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Followup
                    </button>
                    <button
                        onClick={() => onAction('view', followup)}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default FollowupCard;
