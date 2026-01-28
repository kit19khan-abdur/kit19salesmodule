import { Calendar, Clock, MapPin, Video, CheckCircle, XCircle, AlertCircle, CalendarClock, CalendarCheck } from 'lucide-react';

// Appointment Status Configuration
export const APPOINTMENT_STATUS = {
  open: {
    key: 'open',
    label: 'Open',
    icon: AlertCircle,
    color: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-700',
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-500',
    count: 0
  },
  overdue: {
    key: 'overdue',
    label: 'Overdue',
    icon: XCircle,
    color: 'bg-red-500',
    light: 'bg-red-50',
    text: 'text-red-700',
    gradient: 'from-red-500 to-red-600',
    border: 'border-red-500',
    count: 0
  },
  completed: {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle,
    color: 'bg-green-500',
    light: 'bg-green-50',
    text: 'text-green-700',
    gradient: 'from-green-500 to-green-600',
    border: 'border-green-500',
    count: 0
  }
};

// Time Filters
export const TIME_FILTERS = [
  { id: 'today', label: 'Today', icon: CalendarCheck },
  { id: 'week', label: 'This Week', icon: CalendarClock },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
];

// Appointment Types
export const APPOINTMENT_TYPES = {
  virtual: {
    key: 'virtual',
    label: 'Virtual',
    icon: Video,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  physical: {
    key: 'physical',
    label: 'Physical',
    icon: MapPin,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  }
};

// Sample Appointments Data
export const SAMPLE_APPOINTMENTS = [
  {
    id: 1,
    title: 'test_rahit_edit',
    description: 'test',
    date: '07-May-2034',
    time: '17:56:00',
    fullDateTime: '07 May 2034 17:56:00',
    location: 'delhi',
    type: 'physical',
    status: 'completed',
    outcome: 'Visit done',
    relatedTo: 'testing432',
    relatedToId: 432,
    owner: 'Mukesh Kumar',
    ownerUsername: 'kmukesh343',
    completedDate: '07-May-2025',
    completedTime: '11:11:22',
    avatar: 'https://kit19.com/assets/custom/img/img_avatar.png'
  },
  {
    id: 2,
    title: 'Edit Appointment 2026-01-17 09:58:09',
    description: 'Mass Update Appointment Description',
    date: '25-Jun-2026',
    time: '04:48:00',
    fullDateTime: '25 Jun 2026 04:48:00',
    location: 'Delhi, India',
    type: 'virtual',
    status: 'completed',
    outcome: 'Visit done',
    relatedTo: 'rahul birsha mart',
    relatedToId: 892,
    owner: 'Mukesh Kumar',
    ownerUsername: 'kmukesh343',
    completedDate: '17-Jan-2026',
    completedTime: '09:59:43',
    avatar: 'https://kit19.com/assets/custom/img/img_avatar.png'
  },
  {
    id: 3,
    title: 'Edit Appointment 2026-01-19 17:50:09',
    description: 'Mass Update Appointment Description',
    date: '24-Jun-2026',
    time: '23:18:00',
    fullDateTime: '24 Jun 2026 23:18:00',
    location: 'Delhi, India',
    type: 'physical',
    status: 'completed',
    outcome: 'Visit done',
    relatedTo: 'rahul birsha mart',
    relatedToId: 892,
    owner: 'Mukesh Kumar',
    ownerUsername: 'kmukesh343',
    completedDate: '19-Jan-2026',
    completedTime: '17:51:46',
    avatar: 'https://kit19.com/assets/custom/img/img_avatar.png'
  },
  {
    id: 4,
    title: 'Completed Appointment 2026-01-17',
    description: 'Mass Update Appointment Description',
    date: '24-Jun-2026',
    time: '17:48:00',
    fullDateTime: '24 Jun 2026 17:48:00',
    location: 'Delhi, India',
    type: 'virtual',
    status: 'completed',
    outcome: 'Visit done',
    relatedTo: 'rahul birsha mart',
    relatedToId: 892,
    owner: 'Mukesh Kumar',
    ownerUsername: 'kmukesh343',
    completedDate: '17-Jan-2026',
    completedTime: '12:34:22',
    avatar: 'https://kit19.com/assets/custom/img/img_avatar.png'
  },
  {
    id: 5,
    title: 'Meeting with Client',
    description: 'Discuss project requirements',
    date: '22-Jan-2026',
    time: '10:00:00',
    fullDateTime: '22 Jan 2026 10:00:00',
    location: 'Mumbai, India',
    type: 'physical',
    status: 'open',
    outcome: null,
    relatedTo: 'testing123',
    relatedToId: 123,
    owner: 'Mukesh Kumar',
    ownerUsername: 'kmukesh343',
    completedDate: null,
    completedTime: null,
    avatar: 'https://kit19.com/assets/custom/img/img_avatar.png'
  },
  {
    id: 6,
    title: 'Product Demo',
    description: 'Demo for new product',
    date: '20-Jan-2026',
    time: '14:30:00',
    fullDateTime: '20 Jan 2026 14:30:00',
    location: 'Bangalore, India',
    type: 'virtual',
    status: 'overdue',
    outcome: null,
    relatedTo: 'test_user',
    relatedToId: 456,
    owner: 'Mukesh Kumar',
    ownerUsername: 'kmukesh343',
    completedDate: null,
    completedTime: null,
    avatar: 'https://kit19.com/assets/custom/img/img_avatar.png'
  }
];
