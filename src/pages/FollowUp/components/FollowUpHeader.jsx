import React from 'react';
import { Search, SlidersHorizontal, Download, Bell, Settings } from 'lucide-react';
import salesfunnel from '../../../assets/salesfunnel.jpg';

const FollowupHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                Follow-Ups
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage your scheduled follow-ups
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
                                placeholder="Search follow-ups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-72 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                            />
                        </div>

                        {/* Action Buttons */}
                        <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            {/* <SlidersHorizontal className="w-5 h-5 text-gray-600" /> */}
                            <img src={salesfunnel} className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
                        </button>
                        <button className="p-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all">
                            <Settings className="w-5 h-5 animate-spin" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FollowupHeader;
