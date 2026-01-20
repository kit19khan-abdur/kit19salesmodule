import React, { useState, useMemo } from 'react';
import { TaskHeader, TaskFilters, TaskTable, TaskPagination } from './components';
import { sampleTasks, ITEMS_PER_PAGE } from './constants';

const Task = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        open: true,
        overdue: true,
        completed: true
    });
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and search tasks
    const filteredTasks = useMemo(() => {
        return sampleTasks.filter(task => {
            // Apply status filters
            const statusMatch = filters[task.status];
            if (!statusMatch) return false;

            // Apply search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    task.title.toLowerCase().includes(query) ||
                    task.description.toLowerCase().includes(query) ||
                    task.relatedTo.toLowerCase().includes(query) ||
                    task.owner.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [filters, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    const startEntry = filteredTasks.length > 0 ? startIndex + 1 : 0;
    const endEntry = Math.min(endIndex, filteredTasks.length);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle task actions
    const handleTaskAction = (actionId, task) => {
        console.log('Action:', actionId, 'Task:', task);
        // Implement your action logic here
        // e.g., open modal for followup, send mail, etc.
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container */}
            <div className="w-full">
                {/* Header */}
                <TaskHeader 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    totalTasks={filteredTasks.length}
                />

                {/* Filters */}
                <TaskFilters 
                    filters={filters}
                    setFilters={setFilters}
                />

                {/* Task Table */}
                <TaskTable 
                    tasks={paginatedTasks}
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                    onTaskAction={handleTaskAction}
                />

                {/* Pagination */}
                {filteredTasks.length > 0 && (
                    <TaskPagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalEntries={filteredTasks.length}
                        startEntry={startEntry}
                        endEntry={endEntry}
                    />
                )}

                {/* Empty State */}
                {filteredTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No tasks found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Task;
