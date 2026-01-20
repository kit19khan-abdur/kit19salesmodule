import React from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const CalendarWeekView = ({ currentWeek, onWeekChange }) => {
    const timeSlots = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    
    // Get week days
    const getWeekDays = () => {
        const days = [];
        const weekStart = new Date(currentWeek);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            days.push(date);
        }
        
        return days;
    };

    const weekDays = getWeekDays();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Format week range
    const formatWeekRange = () => {
        const start = weekDays[0];
        const end = weekDays[6];
        
        const startMonth = start.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const endMonth = end.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const startDay = start.getDate();
        const endDay = end.getDate();
        const year = end.getFullYear();
        
        if (startMonth === endMonth) {
            return `${startMonth} ${startDay} — ${endDay}, ${year}`;
        } else {
            return `${startMonth} ${startDay} — ${endMonth} ${endDay}, ${year}`;
        }
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        onWeekChange(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        onWeekChange(newDate);
    };

    return (
        <div className="flex-1 bg-white overflow-hidden">
            {/* Week Navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <button 
                    onClick={goToPreviousWeek}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <h2 className="text-lg font-semibold text-gray-800">
                    {formatWeekRange()}
                </h2>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={goToNextWeek}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Info className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-auto" style={{ height: 'calc(100vh - 180px)' }}>
                <div className="grid grid-cols-8 border-b border-gray-200">
                    {/* Empty corner cell */}
                    <div className="bg-gray-50 border-r border-gray-200"></div>
                    
                    {/* Day Headers */}
                    {weekDays.map((date, index) => (
                        <div 
                            key={index}
                            className="text-center py-3 border-r border-gray-200 bg-gray-50"
                        >
                            <div className="text-sm font-medium text-gray-600">
                                {dayNames[index]} {date.getMonth() + 1}/{date.getDate()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Time slots and grid */}
                <div className="relative">
                    <div className="grid grid-cols-8">
                        {/* Left column with time labels */}
                        <div className="bg-gray-50 border-r border-gray-200">
                            <div className="py-2 px-3 text-sm font-medium text-gray-600 border-b border-gray-200">
                                Tasks/Days
                            </div>
                            {timeSlots.map((time, index) => (
                                <div 
                                    key={index}
                                    className="py-8 px-3 text-sm text-gray-500 border-b border-gray-200"
                                >
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Grid cells for each day */}
                        {weekDays.map((date, dayIndex) => (
                            <div key={dayIndex} className="border-r border-gray-200">
                                {/* Empty cell for alignment */}
                                <div className="h-[41px] border-b border-gray-200"></div>
                                
                                {/* Time slot cells */}
                                {timeSlots.map((_, timeIndex) => (
                                    <div
                                        key={timeIndex}
                                        className="h-[89px] border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        {/* This is where events/tasks would be rendered */}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarWeekView;
