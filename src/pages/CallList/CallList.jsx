import React, { useState, useMemo } from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Components
import {
    CallListSidebar,
    CallListTable,
    DialerWidget
} from './components';

// Constants
import { sampleCallList, sidebarMenuItems, customTabs as initialCustomTabs } from './constants';

const CallList = () => {
    const [contacts, setContacts] = useState(sampleCallList);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [customTabs, setCustomTabs] = useState(initialCustomTabs);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDialerActive, setIsDialerActive] = useState(false);

    // Helper function to get category name
    const getCategoryName = (id) => {
        const categoryMap = {
            'new': 'New Contacts',
            'all': 'All Contacts',
            'followup': 'Follow Ups',
            'task': 'Task Due',
            'appointment': 'Appointment Due'
        };
        return categoryMap[id] || 'All Contacts';
    };

    // Filter contacts based on selected category
    const filteredContacts = useMemo(() => {
        if (selectedCategory === 'all') return contacts;
        return contacts.filter(contact => contact.category === getCategoryName(selectedCategory));
    }, [contacts, selectedCategory]);

    // Paginate contacts
    const paginatedContacts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredContacts.slice(startIndex, endIndex);
    }, [filteredContacts, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle items per page change
    const handleItemsPerPageChange = (items) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    // Handle call contact
    const handleCallContact = (contact) => {
        setIsDialerActive(true);
        toast.success(`Calling ${contact.name || 'Unknown'}...`);
    };

    // Handle edit contact
    const handleEditContact = (contact) => {
        toast.success(`Editing ${contact.name}`);
        console.log('Edit contact:', contact);
    };

    // Handle delete contact
    const handleDeleteContact = (contact) => {
        if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
            setContacts(prev => prev.filter(c => c.id !== contact.id));
            toast.success('Contact deleted successfully');
        }
    };

    // Handle schedule contact
    const handleScheduleContact = (contact) => {
        toast.success(`Scheduling call with ${contact.name}`);
        console.log('Schedule contact:', contact);
    };

    // Handle add tab
    const handleAddTab = () => {
        const newTab = {
            id: `tab${Date.now()}`,
            label: `New Tab ${customTabs.length + 1}`,
            removable: true
        };
        setCustomTabs([...customTabs, newTab]);
        toast.success('New tab added');
    };

    // Handle remove tab
    const handleRemoveTab = (tabId) => {
        setCustomTabs(customTabs.filter(tab => tab.id !== tabId));
        toast.success('Tab removed');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                        borderRadius: '8px',
                        padding: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            {/* Sidebar */}
            <CallListSidebar
                menuItems={sidebarMenuItems}
                customTabs={customTabs}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onAddTab={handleAddTab}
                onRemoveTab={handleRemoveTab}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Dialer Widget - Top Bar */}
                <DialerWidget
                    isDialerActive={isDialerActive}
                    onToggleDialer={() => setIsDialerActive(!isDialerActive)}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-full p-6">
                        {/* Header Stats */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Call List</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Showing {filteredContacts.length} contacts
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Show:</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <CallListTable
                            contacts={paginatedContacts}
                            onCallContact={handleCallContact}
                            onEditContact={handleEditContact}
                            onDeleteContact={handleDeleteContact}
                            onScheduleContact={handleScheduleContact}
                        />

                        {/* Pagination */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                                to{' '}
                                <span className="font-semibold">
                                    {Math.min(currentPage * itemsPerPage, filteredContacts.length)}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold">{filteredContacts.length}</span>{' '}
                                results
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                
                                <div className="hidden sm:flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const page = index + 1;
                                        if (
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return (
                                                <span key={page} className="px-2 text-gray-500">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallList;
