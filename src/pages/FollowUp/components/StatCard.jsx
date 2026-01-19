import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ config, count, isActive, onClick }) => {
    const Icon = config.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative cursor-pointer rounded-2xl p-5 transition-all duration-300 ${isActive
                    ? `bg-gradient-to-br ${config.gradient} text-white shadow-xl`
                    : 'bg-white hover:shadow-lg border border-gray-100'
                }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {config.label}
                    </p>
                    <p className={`text-3xl font-bold mt-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {count}
                    </p>
                </div>
                <div className={`p-3 rounded-xl ${isActive ? 'bg-white/20' : config.light}`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : config.text}`} />
                </div>
            </div>
            {isActive && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full mb-2"
                />
            )}
        </motion.div>
    );
};

export default StatCard;
