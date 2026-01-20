import React from 'react';
import { Search, Calendar, Users } from 'lucide-react';

const TaskHeader = ({ searchQuery, setSearchQuery, totalTasks }) => {
    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tasks/Days
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage and track all your tasks
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-72 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        {/* Action Buttons */}
                        <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                            <Users className="w-5 h-5" />
                            Team Members
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                            <Calendar className="w-5 h-5" />
                            Add Event
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TaskHeader;
