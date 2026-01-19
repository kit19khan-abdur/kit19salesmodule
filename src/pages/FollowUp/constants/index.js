import { AlertTriangle, Timer, Calendar, XCircle, BellRing } from 'lucide-react';

// Status Configuration
export const statusConfig = {
    overdue: { 
        label: 'Overdue', 
        icon: AlertTriangle, 
        gradient: 'from-rose-300 to-pink-400', 
        bg: 'bg-rose-400', 
        light: 'bg-rose-50', 
        text: 'text-rose-500', 
        ring: 'ring-rose-400' 
    },
    dueToday: { 
        label: 'Due Today', 
        icon: Timer, 
        gradient: 'from-amber-300 to-orange-400', 
        bg: 'bg-amber-400', 
        light: 'bg-amber-50', 
        text: 'text-amber-500', 
        ring: 'ring-amber-400' 
    },
    scheduled: { 
        label: 'Scheduled', 
        icon: Calendar, 
        gradient: 'from-emerald-300 to-teal-400', 
        bg: 'bg-emerald-400', 
        light: 'bg-emerald-50', 
        text: 'text-emerald-500', 
        ring: 'ring-emerald-400' 
    },
    noFollowup: { 
        label: 'No Follow-up', 
        icon: BellRing, 
        gradient: 'from-slate-300 to-gray-400', 
        bg: 'bg-slate-400', 
        light: 'bg-slate-50', 
        text: 'text-slate-500', 
        ring: 'ring-slate-400' 
    },
};

// Sample Data
export const sampleFollowups = [
    { id: 1, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:45:42', createdDate: '13 Jan 2026 16:45:42', contactNo: '0', relatedTo: '+917011006348', assignedTo: 'Mukesh Kumar', status: 'overdue' },
    { id: 2, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:45:28', createdDate: '13 Jan 2026 16:45:28', contactNo: '0', relatedTo: '+917210999694', assignedTo: 'Mukesh Kumar', status: 'dueToday' },
    { id: 3, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:45:15', createdDate: '13 Jan 2026 16:45:15', contactNo: '0', relatedTo: '+916397388715', assignedTo: 'Mukesh Kumar', status: 'scheduled' },
    { id: 4, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:44:59', createdDate: '13 Jan 2026 16:44:59', contactNo: '0', relatedTo: '+917240001234', assignedTo: 'Mukesh Kumar', status: 'overdue' },
    { id: 5, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:44:45', createdDate: '13 Jan 2026 16:44:45', contactNo: '0', relatedTo: '+918224839854', assignedTo: 'Mukesh Kumar', status: 'dueToday' },
    { id: 6, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:44:32', createdDate: '13 Jan 2026 16:44:32', contactNo: '0', relatedTo: '+919967535353', assignedTo: 'Mukesh Kumar', status: 'scheduled' },
    { id: 7, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:44:18', createdDate: '13 Jan 2026 16:44:18', contactNo: '0', relatedTo: '+919867579170', assignedTo: 'Mukesh Kumar', status: 'noFollowup' },
    { id: 8, type: 'Scheduled Work', dueDate: '13 Jan 2026', dueTime: '17:48:18', createdDate: '14 Jan 2026 16:44:18', contactNo: '0', relatedTo: '+919867673170', assignedTo: 'Mukesh Kumar', status: 'noFollowup' },
    { id: 9, type: 'Tomorrow Work', dueDate: '13 Jan 2026', dueTime: '16:48:18', createdDate: '13 Jan 2026 16:44:18', contactNo: '0', relatedTo: '+919867679170', assignedTo: 'Mukesh Kumar', status: 'noFollowup' },
    { id: 10, type: 'Call-Back', dueDate: '13 Jan 2026', dueTime: '16:41:55', createdDate: '13 Jan 2026 16:41:55', contactNo: '0', relatedTo: '+919819866142', assignedTo: 'Mukesh Kumar', status: 'overdue' },
];

// Quick Actions Configuration
export const quickActions = [
    { id: 'followup', icon: 'CheckCircle2', label: 'Add Followup', color: 'text-emerald-500 hover:bg-emerald-50' },
    { id: 'mail', icon: 'Mail', label: 'Send Mail', color: 'text-blue-500 hover:bg-blue-50' },
    { id: 'sms', icon: 'MessageSquare', label: 'Send SMS', color: 'text-purple-500 hover:bg-purple-50' },
    { id: 'voice', icon: 'Phone', label: 'Send Voice', color: 'text-orange-500 hover:bg-orange-50' },
    { id: 'notes', icon: 'FileText', label: 'Add Notes', color: 'text-cyan-500 hover:bg-cyan-50' },
    { id: 'upload', icon: 'Upload', label: 'Upload Doc', color: 'text-pink-500 hover:bg-pink-50' },
];
