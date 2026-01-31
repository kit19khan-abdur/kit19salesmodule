import { Calendar, Clock, CheckCircle2, PhoneCall } from 'lucide-react';

// FollowUp Status Configuration
export const followUpStatusConfig = {
    overdue: {
        label: 'Overdue',
        icon: Calendar,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        light: 'bg-red-50',
        text: 'text-red-700'
    },
    dueToday: {
        label: 'Due Today',
        icon: Clock,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        light: 'bg-green-50',
        text: 'text-green-700'
    },
    scheduled: {
        label: 'Scheduled',
        icon: Calendar,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        light: 'bg-orange-50',
        text: 'text-orange-700'
    },
    noFollowup: {
        label: 'No Followup',
        icon: CheckCircle2,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        light: 'bg-blue-50',
        text: 'text-blue-700'
    }
};

// Items per page for pagination
export const ITEMS_PER_PAGE = 100;

// Sample FollowUp Data
export const sampleFollowUps = [
    {
        id: 1,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '14:34:34',
        createdDate: '2026-01-31',
        createdTime: '14:34:34',
        contactNo: '+91 9587228222',
        relatedTo: '919587228222',
        assignedTo: 'Mukesh Kumar',
        status: 'overdue',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 2,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:46:26',
        createdDate: '2026-01-31',
        createdTime: '13:46:25',
        contactNo: '+91 9819602760',
        relatedTo: '919819602760',
        assignedTo: 'Mukesh Kumar',
        status: 'overdue',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 3,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:39:29',
        createdDate: '2026-01-31',
        createdTime: '13:39:29',
        contactNo: '+91 96546 12659',
        relatedTo: '9196546 12659',
        assignedTo: 'Mukesh Kumar',
        status: 'dueToday',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 4,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:37:05',
        createdDate: '2026-01-31',
        createdTime: '13:37:05',
        contactNo: '+91 7082486965',
        relatedTo: '917082486965',
        assignedTo: 'Mukesh Kumar',
        status: 'dueToday',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 5,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:32:24',
        createdDate: '2026-01-31',
        createdTime: '13:32:24',
        contactNo: '+91 9765649459',
        relatedTo: '919765649459',
        assignedTo: 'Mukesh Kumar',
        status: 'scheduled',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 6,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:31:40',
        createdDate: '2026-01-31',
        createdTime: '13:31:40',
        contactNo: '+91 9456849497',
        relatedTo: '919456849497',
        assignedTo: 'Mukesh Kumar',
        status: 'scheduled',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 7,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:30:49',
        createdDate: '2026-01-31',
        createdTime: '13:30:49',
        contactNo: '+91 9465646420',
        relatedTo: '919465646420',
        assignedTo: 'Mukesh Kumar',
        status: 'noFollowup',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 8,
        followUpType: 'Call-Back',
        dueDate: '2026-01-31',
        dueTime: '13:29:03',
        createdDate: '2026-01-31',
        createdTime: '13:29:03',
        contactNo: '+91 9456845668',
        relatedTo: '919456845668',
        assignedTo: 'Mukesh Kumar',
        status: 'noFollowup',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    }
];
