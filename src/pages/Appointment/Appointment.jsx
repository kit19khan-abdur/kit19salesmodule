import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppointmentHeader, AppointmentToolbar, AppointmentCard, AppointmentPagination } from './components';
import { APPOINTMENT_STATUS, SAMPLE_APPOINTMENTS } from './constants';

const Appointment = () => {
  const [activeFilters, setActiveFilters] = useState(['open', 'overdue', 'completed']);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const itemsPerPage = 20;
  const totalRecords = 1370;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  // Filter appointments based on active filters and search
  const filteredAppointments = SAMPLE_APPOINTMENTS.filter(appointment => {
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(appointment.status);
    const matchesSearch = searchQuery === '' ||
      appointment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.relatedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle action click
  const handleAction = (actionId, appointment) => {
    console.log(`Action: ${actionId}`, appointment);
    // Handle different actions here
  };

  // Handle filter click
  const handleFilterClick = (key) => {
    setActiveFilters(prev => {
      if (prev.includes(key)) {
        return prev.filter(f => f !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // Check if all filters are active
  const allFiltersActive = activeFilters.length === 3;

  // Toggle all filters
  const handleShowAllClick = () => {
    if (allFiltersActive) {
      setActiveFilters([]);
    } else {
      setActiveFilters(['open', 'overdue', 'completed']);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sidebar Accent */}
      <div className="fixed left-0 -top-[4px] bottom-0 w-1 bg-blue-200" />

      {/* Main Container */}
      <div className="">
        {/* Header */}
        <AppointmentHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content */}
        <main className="py-6">
          {/* Combined Filter Checkboxes and Toolbar */}
          <div className="flex items-center justify-between mb-6 px-6">
            {/* Left side - Filter Checkboxes */}
            <div className="flex items-center gap-6">
              {Object.entries(APPOINTMENT_STATUS).map(([key, config]) => {
                const IconComponent = config.icon;
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(key)}
                      onChange={() => handleFilterClick(key)}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-0 cursor-pointer transition-all"
                    />
                    <span className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      activeFilters.includes(key) ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${config.text}`} />
                      {config.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Right side - Toolbar */}
            <AppointmentToolbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              showAllButton={activeFilters.length === 0}
              onShowAllClick={handleShowAllClick}
            />
          </div>

          {/* Entry Count */}
          <div className="px-6 mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">1</span> to <span className="font-semibold">20</span> of <span className="font-semibold">{totalRecords.toLocaleString()}</span> entries
            </p>
          </div>

          {/* Appointments Grid/List */}
          {activeFilters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Filter Selected</h3>
              <p className="text-gray-500 mb-6">Please select at least one filter to view appointments</p>
              <button
                onClick={handleShowAllClick}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all shadow-sm"
              >
                Show All Appointments
              </button>
            </div>
          ) : (
            <>
              <div className="px-6">
                <motion.div
                  layout
                  className={viewMode === 'grid' ? 'grid grid-cols-4 gap-5' : 'flex flex-col gap-3'}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onAction={handleAction}
                        viewMode={viewMode}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Empty State - No Results */}
              {filteredAppointments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No appointments found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}

              {/* Pagination */}
              {filteredAppointments.length > 0 && (
                <AppointmentPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Appointment;
