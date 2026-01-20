import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarDayView = ({ currentDate, onDateChange }) => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const period = i < 12 ? 'am' : 'pm';
        return `${hour}${period}`;
    });

    const formatDate = () => {
        return currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const goToPreviousDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        onDateChange(newDate);
    };

    const goToNextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        onDateChange(newDate);
    };

    return (
        <div className="flex-1 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <button 
                    onClick={goToPreviousDay}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <h2 className="text-lg font-semibold text-gray-800">{formatDate()}</h2>
                
                <button 
                    onClick={goToNextDay}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
                {timeSlots.map((time, index) => (
                    <div key={index} className="flex border-b border-gray-200">
                        <div className="w-24 py-4 px-4 text-sm text-gray-500 bg-gray-50">
                            {time}
                        </div>
                        <div className="flex-1 py-4 hover:bg-blue-50 transition-colors cursor-pointer"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarDayView;
