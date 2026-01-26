import { CheckCircle2, Clock, XCircle } from 'lucide-react';

// Task Status Configuration
export const taskStatusConfig = {
    open: {
        label: 'Open',
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        light: 'bg-blue-50',
        text: 'text-blue-700'
    },
    overdue: {
        label: 'Overdue',
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        light: 'bg-red-50',
        text: 'text-red-700'
    },
    completed: {
        label: 'Completed',
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        light: 'bg-green-50',
        text: 'text-green-700'
    }
};

// Sample Task Data
export const sampleTasks = [
    {
        id: 1,
        title: 'Completed Task Test - 2025-10-11 16:40:38',
        description: 'This is a task creation test for Create Task feature',
        status: 'completed',
        dueDate: '2025-10-11',
        dueTime: '16:40',
        completedDate: '11-Oct-2025',
        completedTime: '16:40:38',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 2,
        title: 'Completed Task Test - 2025-10-11 16:57:51',
        description: 'This is a task creation test for Create Task feature',
        status: 'completed',
        dueDate: '2025-10-11',
        dueTime: '16:57',
        completedDate: '11-Oct-2025',
        completedTime: '16:57:51',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 3,
        title: 'Follow up call with client',
        description: 'Schedule a follow-up call to discuss project requirements',
        status: 'open',
        dueDate: '2026-01-20',
        dueTime: '10:00',
        completedDate: '20-Jan-2026',
        completedTime: '10:00:00',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 4,
        title: 'Review proposal document',
        description: 'Review and approve the final proposal document',
        status: 'overdue',
        dueDate: '2026-01-15',
        dueTime: '09:00',
        completedDate: '15-Jan-2026',
        completedTime: '09:00:00',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 5,
        title: 'Send quotation to prospect',
        description: 'Prepare and send detailed quotation to new prospect',
        status: 'open',
        dueDate: '2026-01-22',
        dueTime: '14:30',
        completedDate: '22-Jan-2026',
        completedTime: '14:30:00',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 6,
        title: 'Update CRM records',
        description: 'Update all customer records in the CRM system',
        status: 'completed',
        dueDate: '2026-01-18',
        dueTime: '11:20',
        completedDate: '18-Jan-2026',
        completedTime: '11:20:00',
        outcome: 'success',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 7,
        title: 'Prepare monthly report',
        description: 'Compile and prepare monthly sales report',
        status: 'overdue',
        dueDate: '2026-01-10',
        dueTime: '17:00',
        completedDate: '10-Jan-2026',
        completedTime: '17:00:00',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    },
    {
        id: 8,
        title: 'Client meeting preparation',
        description: 'Prepare presentation for upcoming client meeting',
        status: 'open',
        dueDate: '2026-01-25',
        dueTime: '15:00',
        completedDate: '25-Jan-2026',
        completedTime: '15:00:00',
        outcome: 'pending',
        relatedTo: 'testing432',
        owner: 'Mukesh Kumar (kmukesh343)',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0
    }
];

export const ITEMS_PER_PAGE = 20;
