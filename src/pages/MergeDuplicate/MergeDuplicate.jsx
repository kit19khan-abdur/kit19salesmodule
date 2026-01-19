import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { THEME } from '../../config/constants';
import { getSession } from '../../getSession';
import { wcfInstance } from '../../axiosinstance';

// Import organized components
import {
  PageHeader,
  StatsSection,
  FilterBar,
  DuplicateList,
  ComparisonView,
  EmptyState
} from './components';

// Import constants and utilities
import { MOCK_DUPLICATES } from './constants';

/**
 * MergeDuplicate Component
 * Main page for managing and merging duplicate records
 */
const MergeDuplicate = () => {
  // State
  const [duplicates, setDuplicates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedForMerge, setSelectedForMerge] = useState([]);
  const [primaryRecord, setPrimaryRecord] = useState(null);
  const [filterType, setFilterType] = useState('mobile');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [viewMode, setViewMode] = useState('split');
  
  const { userId, parentId, TokenId } = getSession();

  // Computed Values
  const stats = useMemo(() => ({
    total: duplicates.length,
    mobile: duplicates.filter(d => d.mobile).length,
    email: duplicates.filter(d => d.email).length,
    pending: duplicates.reduce((acc, d) => acc + d.matchCount, 0)
  }), [duplicates]);

  const filteredDuplicates = useMemo(() => {
    let filtered = [...duplicates];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.name?.toLowerCase().includes(query) ||
        d.mobile?.includes(query) ||
        d.email?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [duplicates, searchQuery]);

  const paginatedDuplicates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDuplicates.slice(start, start + pageSize);
  }, [filteredDuplicates, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredDuplicates.length / pageSize);

  // API Handlers
  const fetchDuplicates = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const payload = {
      //   Token: TokenId,
      //   LoggedUserId: userId,
      //   Details: {
      //     ParentId: parentId,
      //     DuplicateType: filterType === 'mobile' ? 1 : 2,
      //     PageNo: currentPage,
      //     PageSize: pageSize
      //   }
      // };
      // const response = await wcfInstance.post('/enquiries/duplicates', payload);
      // setDuplicates(response.data?.Details?.data || []);
      
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      setDuplicates(MOCK_DUPLICATES);
      
      if (MOCK_DUPLICATES.length > 0) {
        setSelectedRecord(MOCK_DUPLICATES[0]);
        setPrimaryRecord(MOCK_DUPLICATES[0]);
      }
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterType, userId, parentId, TokenId]);

  useEffect(() => {
    fetchDuplicates();
  }, [fetchDuplicates]);

  // Event Handlers
  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setPrimaryRecord(record);
    setSelectedForMerge([]);
  };

  const handleToggleMergeSelect = (duplicate) => {
    setSelectedForMerge(prev => {
      const isSelected = prev.some(d => d.id === duplicate.id);
      if (isSelected) {
        return prev.filter(d => d.id !== duplicate.id);
      }
      return [...prev, duplicate];
    });
  };

  const handleSetPrimary = (record) => {
    setPrimaryRecord(record);
    setSelectedForMerge(prev => prev.filter(d => d.id !== record.id));
  };

  const handleMerge = () => {
    if (!primaryRecord || selectedForMerge.length === 0) return;
    
    // TODO: Implement actual merge API call
    console.log('Merging:', { primary: primaryRecord, selected: selectedForMerge });
    alert(`Merging ${selectedForMerge.length} record(s) into ${primaryRecord.name}`);
  };

  const handleSelectAll = () => {
    if (selectedRecord?.duplicates) {
      setSelectedForMerge(selectedRecord.duplicates);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <PageHeader isLoading={isLoading} onRefresh={fetchDuplicates} />
      
      <StatsSection stats={stats} />
      
      <FilterBar
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={paginatedDuplicates.length}
        totalCount={filteredDuplicates.length}
      />

      <div className="px-8 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div 
                className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto"
                style={{ borderTopColor: THEME.primary }}
              />
              <p className="mt-4 text-gray-500">Loading duplicates...</p>
            </div>
          </div>
        ) : duplicates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <EmptyState
              icon={FiCheckCircle}
              title="No Duplicates Found"
              description="Great news! Your database is clean with no duplicate records detected."
            />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            <DuplicateList
              duplicates={paginatedDuplicates}
              selectedRecord={selectedRecord}
              onSelectRecord={handleSelectRecord}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            
            <ComparisonView
              selectedRecord={selectedRecord}
              primaryRecord={primaryRecord}
              selectedForMerge={selectedForMerge}
              onToggleMergeSelect={handleToggleMergeSelect}
              onSetPrimary={handleSetPrimary}
              onSelectAll={handleSelectAll}
              onMerge={handleMerge}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MergeDuplicate;
