import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarMonthView = ({ currentMonth, onMonthChange }) => {
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add all days in month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        
        return days;
    };

    const formatMonthYear = () => {
        return currentMonth.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    };

    const goToPreviousMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        onMonthChange(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        onMonthChange(newDate);
    };

    const days = getDaysInMonth();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex-1 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <button 
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <h2 className="text-lg font-semibold text-gray-800">{formatMonthYear()}</h2>
                
                <button 
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="p-6">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((date, index) => (
                        <div
                            key={index}
                            className={`
                                aspect-square border border-gray-200 rounded-lg p-2
                                ${date ? 'hover:bg-blue-50 cursor-pointer' : 'bg-gray-50'}
                                ${date && date.toDateString() === new Date().toDateString() ? 'bg-blue-100 border-blue-500' : ''}
                            `}
                        >
                            {date && (
                                <div className="text-sm font-medium text-gray-900">
                                    {date.getDate()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarMonthView;
