import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import OpportunityCard from './OpportunityCard';

const StageColumn = ({ stage, opportunities, onAddOpportunity, onDropOpportunity, onDragStart, onDragEnd }) => {
  const stageOpportunities = opportunities.filter(opp => opp.stage === stage.id);
  const totalValue = stageOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const opportunityId = parseInt(e.dataTransfer.getData('opportunityId'));
    const currentStage = e.dataTransfer.getData('currentStage');
    
    if (currentStage !== stage.id) {
      onDropOpportunity(opportunityId, stage.id);
    }
    
    // Close the modal after dropping
    if (onDragEnd) onDragEnd();
  };

  return (
    <div 
      className={`bg-white overflow-hidden rounded-lg border-2 min-h-[600px] flex flex-col transition-all ${
        isDragOver 
          ? `border-dashed ${stage.color.replace('bg-', 'border-')} bg-opacity-5 ${stage.lightColor}` 
          : 'border-gray-200 border-solid'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className={`p-4 border-b border-gray-200 ${stage.lightColor}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${stage.color}`}></span>
            {stage.name}
          </h2>
          <button
            onClick={() => onAddOpportunity(stage.id)}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900">{stageOpportunities.length} Opps</span>
          {totalValue > 0 && (
            <span className={`text-sm font-medium ${stage.textColor}`}>
              ${totalValue.toLocaleString()} Value
            </span>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {stageOpportunities.length > 0 ? (
          <AnimatePresence>
            {stageOpportunities.map(opp => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No opportunity yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StageColumn;
