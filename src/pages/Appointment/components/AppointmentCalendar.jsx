import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from 'lucide-react';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../constants';

const AppointmentCalendar = ({ appointments, onAppointmentClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getAppointmentsForDay = (day) => {
    const dateStr = `${String(day).padStart(2, '0')}-${monthNames[month].substring(0, 3)}-${year}`;
    return appointments.filter(apt => apt.date.includes(dateStr));
  };

  const renderCalendar = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50 border border-gray-100 rounded-lg"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAppointments = getAppointmentsForDay(day);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === month && 
                     new Date().getFullYear() === year;

      days.push(
        <div
          key={day}
          className={`min-h-[120px] border rounded-lg p-2 overflow-hidden ${
            isToday 
              ? 'bg-teal-50 border-teal-300 border-2' 
              : 'bg-white border-gray-200 hover:border-teal-200'
          } transition-all`}
        >
          <div className={`text-sm font-semibold mb-2 ${
            isToday ? 'text-teal-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map(apt => {
              const statusConfig = APPOINTMENT_STATUS[apt.status];
              const typeConfig = APPOINTMENT_TYPES[apt.type];
              return (
                <div
                  key={apt.id}
                  onClick={() => onAppointmentClick(apt)}
                  className={`${statusConfig.light} border ${statusConfig.border} rounded p-1.5 cursor-pointer hover:shadow-sm transition-all text-xs`}
                >
                  <div className="flex items-center gap-1 mb-0.5">
                    <typeConfig.icon className={`w-3 h-3 ${typeConfig.color}`} />
                    <span className="font-medium text-gray-800 truncate">{apt.time.substring(0, 5)}</span>
                  </div>
                  <div className="text-gray-700 truncate font-medium">{apt.title}</div>
                </div>
              );
            })}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-gray-500 font-medium px-1">
                +{dayAppointments.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors font-medium text-sm"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
