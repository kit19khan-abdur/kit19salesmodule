import { CheckCircle2, Clock, XCircle } from 'lucide-react';

// Appointment Status Configuration
export const appointmentStatusConfig = {
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

// Sample Appointment Data
export const sampleAppointments = [
    {
        id: 1,
        title: 'Completed Appointment 2026-01-27',
        description: 'Mass Update Appointment Description',
        status: 'completed',
        dueDate: '2026-01-27',
        dueTime: '15:47',
        completedDate: '27-Jan-2026',
        completedTime: '15:47:32',
        outcome: 'Visit done',
        relatedTo: 'Rahul Tyagi',
        owner: 'Mukesh Kumar (kmukesh343)',
        collaborators: '',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0,
        location: 'Delhi, India'
    },
    {
        id: 2,
        title: 'Edit Appointment 2026-01-27 20:20:26',
        description: 'Mass Update Appointment Description',
        status: 'completed',
        dueDate: '2026-01-24',
        dueTime: '12:18',
        completedDate: '27-Jan-2026',
        completedTime: '20:21:58',
        outcome: 'Visit done',
        relatedTo: 'Rahul Tyagi',
        owner: 'Mukesh Kumar (kmukesh343)',
        collaborators: '',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0,
        location: 'Delhi, India'
    },
    {
        id: 3,
        title: 'Completed Appointment 2026-01-27 20:26:39',
        description: 'Mass Update Appointment Description',
        status: 'completed',
        dueDate: '2026-01-24',
        dueTime: '12:18',
        completedDate: '27-Jan-2026',
        completedTime: '20:26:39',
        outcome: 'Visit done',
        relatedTo: 'Rahul Tyagi',
        owner: 'Mukesh Kumar (kmukesh343)',
        collaborators: '',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0,
        location: 'Delhi, India'
    },
    {
        id: 4,
        title: 'Client Meeting - Project Discussion',
        description: 'Discuss project requirements and timeline',
        status: 'open',
        dueDate: '2026-02-05',
        dueTime: '10:00',
        completedDate: null,
        completedTime: null,
        outcome: null,
        relatedTo: 'Rahul Tyagi',
        owner: 'Mukesh Kumar (kmukesh343)',
        collaborators: 'Mohit Cheema',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0,
        location: 'Mumbai, India'
    },
    {
        id: 5,
        title: 'Follow-up Call - Proposal Review',
        description: 'Review proposal feedback with client',
        status: 'overdue',
        dueDate: '2026-01-25',
        dueTime: '14:00',
        completedDate: null,
        completedTime: null,
        outcome: null,
        relatedTo: 'Rahul Tyagi',
        owner: 'Mukesh Kumar (kmukesh343)',
        collaborators: '',
        avatar: 'https://kit19.com/assets/custom/img/img_avatar.png',
        badge: 0,
        location: 'Bangalore, India'
    }
];

// Items per page for pagination
export const ITEMS_PER_PAGE = 20;
