import React from 'react';
import { useDealPipeline, useMoveDealStage } from '../hooks/useApi';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import { formatCurrency } from '../utils/helpers';
import { DEAL_STAGES } from '../config/constants';

const PipelinePage = () => {
  const { data, isLoading } = useDealPipeline();
  const moveDealStage = useMoveDealStage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = data?.dealsByStage?.[stage.id] || [];
          const stageValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

          return (
            <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <Badge variant="default" size="sm">
                  {stageDeals.length}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {formatCurrency(stageValue)}
              </p>

              <div className="space-y-2">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="p-3 cursor-move hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm text-gray-900 mb-1">{deal.title}</p>
                    <p className="text-xs text-gray-600 mb-2">{deal.companyName}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success" size="sm">
                        {formatCurrency(deal.value)}
                      </Badge>
                      <span className="text-xs text-gray-500">{stage.probability}%</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelinePage;
