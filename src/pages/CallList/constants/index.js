// Sample call list data
export const sampleCallList = [
    {
        id: 1,
        name: 'Nayan',
        phone: '+91 9876543210',
        countryCode: '+91',
        scheduleTime: '01-Jan-1900 00:00',
        amountPaid: '5000',
        status: 'pending',
        category: 'All Contacts'
    },
    {
        id: 2,
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '',
        countryCode: '',
        scheduleTime: '01-Jan-1900 00:00',
        amountPaid: '',
        status: 'pending',
        category: 'New Contacts'
    },
    {
        id: 3,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '',
        countryCode: '',
        scheduleTime: '01-Jan-1900 00:00',
        amountPaid: '',
        status: 'pending',
        category: 'Follow Ups'
    },
    {
        id: 4,
        name: '917773813500',
        phone: '+91 7773813500',
        countryCode: '+91',
        scheduleTime: '01-Jan-1900 00:00',
        amountPaid: '',
        status: 'pending',
        category: 'All Contacts'
    }
];

// Sidebar menu items
export const sidebarMenuItems = [
    { id: 'new', label: 'New Contacts', icon: 'user-plus', count: 12 },
    { id: 'all', label: 'All Contacts', icon: 'users', count: 245, active: true },
    { id: 'followup', label: 'Follow Ups', icon: 'refresh', count: 34 },
    { id: 'task', label: 'Task Due', icon: 'check-circle', count: 18 },
    { id: 'appointment', label: 'Appointment Due', icon: 'calendar', count: 8 }
];

// Custom tabs
export const customTabs = [
    { id: 'tab1', label: 'add to call', removable: true },
    { id: 'tab2', label: 'Digital Marketing', removable: true }
];

// Table columns
export const tableColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'scheduleTime', label: 'Schedule Time', sortable: true },
    { key: 'countryCode', label: 'CountryCode', sortable: true },
    { key: 'amountPaid', label: 'Amount Paid', sortable: true }
];

// Call status types
export const callStatuses = {
    IDLE: 'idle',
    DIALING: 'dialing',
    RINGING: 'ringing',
    CONNECTED: 'connected',
    ON_HOLD: 'on-hold',
    ENDED: 'ended'
};
