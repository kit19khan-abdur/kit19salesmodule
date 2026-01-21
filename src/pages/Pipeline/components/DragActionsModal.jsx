import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Trash2 } from 'lucide-react';

const DragActionsModal = ({ isVisible, onDropAction }) => {
  const [activeZone, setActiveZone] = useState(null);

  const handleDragOver = (e, zone) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveZone(zone);
  };

  const handleDragLeave = (e, zone) => {
    e.preventDefault();
    setActiveZone(null);
  };

  const handleDrop = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveZone(null);
    onDropAction(action);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 pointer-events-auto max-w-md w-full mx-4"
        >
          <div className="space-y-4">
            {/* Won Zone */}
            <div
              onDragOver={(e) => handleDragOver(e, 'won')}
              onDragLeave={(e) => handleDragLeave(e, 'won')}
              onDrop={(e) => handleDrop(e, 'won')}
              className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                activeZone === 'won'
                  ? 'bg-green-50 border-green-500 scale-105'
                  : 'bg-green-50/30 border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-600">Won</h3>
              </div>
              <p className="text-sm text-gray-600">Drop here to mark as Won</p>
            </div>

            {/* Lost Zone */}
            <div
              onDragOver={(e) => handleDragOver(e, 'lost')}
              onDragLeave={(e) => handleDragLeave(e, 'lost')}
              onDrop={(e) => handleDrop(e, 'lost')}
              className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                activeZone === 'lost'
                  ? 'bg-red-50 border-red-500 scale-105'
                  : 'bg-red-50/30 border-red-300 hover:bg-red-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <X className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-red-600">Lost</h3>
              </div>
              <p className="text-sm text-gray-600">Drop here to mark as Lost</p>
            </div>

            {/* Delete Zone */}
            <div
              onDragOver={(e) => handleDragOver(e, 'delete')}
              onDragLeave={(e) => handleDragLeave(e, 'delete')}
              onDrop={(e) => handleDrop(e, 'delete')}
              className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                activeZone === 'delete'
                  ? 'bg-gray-100 border-gray-500 scale-105'
                  : 'bg-gray-50/30 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Trash2 className="w-6 h-6 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-600">Delete</h3>
              </div>
              <p className="text-sm text-gray-600">Drop here to delete</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DragActionsModal;
