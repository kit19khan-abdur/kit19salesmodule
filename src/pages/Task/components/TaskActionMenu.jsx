import React, { useRef, useEffect } from 'react';
import { 
    CheckCircle2, Mail, MessageSquare, Phone, 
    FileText, Upload 
} from 'lucide-react';
import { motion } from 'framer-motion';

const TaskActionMenu = ({ task, onClose, onAction }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const actions = [
        { id: 'followup', icon: CheckCircle2, label: 'Add Followup', color: 'text-emerald-500 hover:bg-emerald-50' },
        { id: 'mail', icon: Mail, label: 'Send Mail', color: 'text-blue-500 hover:bg-blue-50' },
        { id: 'sms', icon: MessageSquare, label: 'Send SMS', color: 'text-teal-500 hover:bg-teal-50' },
        { id: 'voice', icon: Phone, label: 'Send Voice', color: 'text-orange-500 hover:bg-orange-50' },
        { id: 'notes', icon: FileText, label: 'Add Notes', color: 'text-cyan-500 hover:bg-cyan-50' },
        { id: 'upload', icon: Upload, label: 'Upload Document', color: 'text-pink-500 hover:bg-pink-50' },
    ];

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50 min-w-[200px]"
        >
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => {
                        onAction(action.id, task);
                        onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${action.color}`}
                >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                </button>
            ))}
        </motion.div>
    );
};

export default TaskActionMenu;
