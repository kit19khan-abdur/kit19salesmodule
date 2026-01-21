import React, { useState } from 'react';
import { PipelineHeader, PipelineControls, StageColumn, DragActionsModal } from './components';
import { PIPELINE_STAGES, SAMPLE_OPPORTUNITIES } from './constants';
import { toast } from 'react-hot-toast';

const Pipeline = () => {
  const [opportunities, setOpportunities] = useState(SAMPLE_OPPORTUNITIES);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [activeFilter, setActiveFilter] = useState('active');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedOpportunityId, setDraggedOpportunityId] = useState(null);

  const handleAddOpportunity = (stageId) => {
    console.log('Add opportunity to stage:', stageId);
    // Handle adding new opportunity
  };

  const handleDragStart = (opportunityId) => {
    setIsDragging(true);
    setDraggedOpportunityId(opportunityId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedOpportunityId(null);
  };

  const handleDropOpportunity = (opportunityId, newStageId) => {
    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, stage: newStageId }
          : opp
      )
    );
    console.log(`Moved opportunity ${opportunityId} to ${newStageId}`);
    // Here you can add API call to save to backend
  };

  const handleDropAction = (action) => {
    if (!draggedOpportunityId) return;

    const opportunity = opportunities.find(opp => opp.id === draggedOpportunityId);
    
    if (action === 'won') {
      setOpportunities(prev =>
        prev.map(opp =>
          opp.id === draggedOpportunityId
            ? { ...opp, stage: 'closed-won', status: 'won' }
            : opp
        )
      );
      console.log(`Marked opportunity ${draggedOpportunityId} as Won`);
      // Add API call here
    } else if (action === 'lost') {
      setOpportunities(prev =>
        prev.map(opp =>
          opp.id === draggedOpportunityId
            ? { ...opp, status: 'lost' }
            : opp
        )
      );
      console.log(`Marked opportunity ${draggedOpportunityId} as Lost`);
      // Add API call here
    } else if (action === 'delete') {
      setOpportunities(prev =>
        prev.filter(opp => opp.id !== draggedOpportunityId)
      );
      console.log(`Deleted opportunity ${draggedOpportunityId}`);
      // Add API call here
    }

    setIsDragging(false);
    setDraggedOpportunityId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PipelineHeader />

      {/* Controls Bar */}
      <PipelineControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Main Content - Kanban Board */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          {PIPELINE_STAGES.map(stage => (
            <StageColumn
              key={stage.id}
              stage={stage}
              opportunities={opportunities}
              onAddOpportunity={handleAddOpportunity}
              onDropOpportunity={handleDropOpportunity}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>

      {/* Drag Actions Modal */}
      <DragActionsModal 
        isVisible={isDragging}
        onDropAction={handleDropAction}
      />

      {/* Info Button (Bottom Right) */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
};

export default Pipeline;
