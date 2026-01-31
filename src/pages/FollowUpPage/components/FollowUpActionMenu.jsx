import React, { useRef, useEffect } from 'react';
import { 
    Edit, Eye, Trash2, Mail, MessageSquare, 
    FileText, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const FollowUpActionMenu = ({ followUp, onClose, onAction }) => {
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
        { id: 'view', icon: Eye, label: 'View Details', color: 'text-blue-500 hover:bg-blue-50' },
        { id: 'edit', icon: Edit, label: 'Edit Followup', color: 'text-green-500 hover:bg-green-50' },
        { id: 'complete', icon: CheckCircle2, label: 'Mark Complete', color: 'text-emerald-500 hover:bg-emerald-50' },
        { id: 'mail', icon: Mail, label: 'Send Mail', color: 'text-blue-500 hover:bg-blue-50' },
        { id: 'sms', icon: MessageSquare, label: 'Send SMS', color: 'text-purple-500 hover:bg-purple-50' },
        { id: 'comment', icon: FileText, label: 'Add Comment', color: 'text-cyan-500 hover:bg-cyan-50' },
        { id: 'delete', icon: Trash2, label: 'Delete', color: 'text-red-500 hover:bg-red-50' },
    ];

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute left-0 top-full mt-2 bg-white max-h-[200px] overflow-y-auto rounded-xl shadow-2xl border border-gray-100 p-2 z-50 min-w-[200px]"
        >
            {actions.map((action) => (
                <button
                    key={action.id}
                    onClick={() => {
                        onAction(action.id);
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

export default FollowUpActionMenu;
