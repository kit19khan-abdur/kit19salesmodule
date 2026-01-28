import React, { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, Download, Bell, Settings, X, Filter, Upload, FunnelPlus, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const AppointmentHeader = ({ searchQuery, setSearchQuery }) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const menuRef = useRef(null);

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
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments by title, location, or related to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className='flex'>
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

        {/* Settings Button */}
        <button onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          className={`ml-4 p-2.5 rounded-xl ${showSettingsMenu
            ? 'bg-gray-200 text-gray-700'
            : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
            } transition-colors`}>
          <Settings className={`w-5 h-5 ${!showSettingsMenu ? 'animate-spin' : ''}`} />
        </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHeader;
