import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

const OpportunityCard = ({ opportunity, onDragStart, onDragEnd }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('opportunityId', opportunity.id);
    e.dataTransfer.setData('currentStage', opportunity.stage);
    if (onDragStart) onDragStart(opportunity.id);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-move group ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
    >
      <div className="p-4">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{opportunity.title}</h3>
          <button
            onClick={() => setShowMenu(!showMenu)}
            onMouseDown={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Amount */}
        <div className="mb-3">
          <p className="text-lg font-bold text-gray-900">
            Amount: ${opportunity.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">{opportunity.company}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Contact Name :</span>
            <span className="font-medium text-gray-900">{opportunity.contactName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Closing Date :</span>
            <span className="font-medium text-gray-900">{opportunity.closingDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
