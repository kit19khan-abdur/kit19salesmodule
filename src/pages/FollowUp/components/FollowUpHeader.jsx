import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Download, Bell, Settings, X, Filter, Upload, FunnelPlus , CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import salesfunnel from '../../../assets/salesfunnel.jpg';
import moneybag from '../../../assets/moneybag.svg';

const FollowupHeader = ({ searchQuery, setSearchQuery }) => {
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowSettingsMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const settingsOptions = [
        { id: 'close', icon: X, label: 'Close', color: 'text-gray-600 hover:bg-gray-100' },
        { id: 'filter', icon: Filter, label: 'Filter', color: 'text-orange-500 hover:bg-orange-50' },
        { id: 'export', icon: FunnelPlus, label: 'Custom Filter', color: 'text-emerald-500 hover:bg-emerald-50' },
        { id: 'upload', icon: CloudUpload, label: 'Upload', color: 'text-blue-500 hover:bg-blue-50' },
    ];

    const handleOptionClick = (optionId) => {
        console.log('Settings option clicked:', optionId);
        if (optionId === 'close') {
            setShowSettingsMenu(false);
        }
        // Handle other options here
    };

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

                        {/* Settings Menu Options - Show when menu is open */}
                        <AnimatePresence>
                            {showSettingsMenu && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2"
                                    ref={menuRef}
                                >
                                    {settingsOptions.map((option, index) => (
                                        <motion.button
                                            key={option.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleOptionClick(option.id)}
                                            className={`p-3 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:scale-105 active:scale-95 ${option.color}`}
                                            title={option.label}
                                        >
                                            <option.icon className="w-5 h-5" />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons - Hide when menu is open */}
                        {!showSettingsMenu && (
                            <>
                                <button className="p-3 relative rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <img src={salesfunnel} className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-2 right-0 text-[10px] w-4 bg-rose-500 text-[#fff] rounded-full">0</span>
                                </button>
                                <button className="p-3 relative rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <img src={moneybag} className="w-5 h-5 text-gray-600" />
                                    <span className="absolute top-2 right-0 text-[10px] w-4 bg-rose-500 text-[#fff] rounded-full">0</span>
                                </button>
                                <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors relative">
                                    <Download className="w-5 h-5 text-gray-600" />
                                </button>
                            </>
                        )}

                        {/* Settings Button */}
                        <button 
                            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                            className={`p-3 relative rounded-2xl transition-all ${
                                showSettingsMenu 
                                    ? 'bg-gray-200 text-gray-700' 
                                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
                            }`}
                        >
                            <Settings className={`w-5 h-5 ${showSettingsMenu ? '' : 'animate-spin'}`} style={{ animationDuration: '3s' }} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FollowupHeader;
