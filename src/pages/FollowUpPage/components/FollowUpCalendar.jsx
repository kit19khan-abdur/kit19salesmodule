import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { followUpStatusConfig } from '../constants';

// Get day view (hourly breakdown)
const getDayView = (date) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return {
        type: 'day',
        date: date,
        hours: hours,
        label: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
};

// Get week view (7 days)
const getWeekView = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const hours = Array.from({ length: 13 }, (_, i) => i + 9); // 9am to 9pm

    return {
        type: 'week',
        days: days,
        hours: hours,
        label: `${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    };
};

const getMonthView = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    let currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    return {
        type: 'month',
        days: days,
        currentMonth: month,
        label: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
};

// Get year view (12 months)
const getYearView = (year) => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    return {
        type: 'year',
        months: months,
        label: year.toString()
    };
};

const FollowUpCalendar = ({ followUps, onFollowUpAction }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState('month'); // day, week, month, year
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        if (calendarView === 'day') {
            return getDayView(new Date(year, month, day));
        } else if (calendarView === 'week') {
            return getWeekView(new Date(year, month, day));
        } else if (calendarView === 'month') {
            return getMonthView(year, month);
        } else {
            return getYearView(year);
        }
    }, [currentDate, calendarView]);

    const getFollowUpsForDate = (date) => {
        return followUps.filter(followUp => {
            const followUpDate = new Date(followUp.dueDate);
            return followUpDate.toDateString() === date.toDateString();
        });
    };

    // Get followups for a specific hour
    const getFollowUpsForHour = (date, hour) => {
        return followUps.filter(followUp => {
            const followUpDate = new Date(followUp.dueDate);
            const followUpHour = parseInt(followUp.dueTime?.split(':')[0] || '0');
            return followUpDate.toDateString() === date.toDateString() && followUpHour === hour;
        });
    };

    // Navigation
    const navigate = (direction) => {
        const newDate = new Date(currentDate);

        if (calendarView === 'day') {
            newDate.setDate(newDate.getDate() + direction);
        } else if (calendarView === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else if (calendarView === 'month') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else {
            newDate.setFullYear(newDate.getFullYear() + direction);
        }

        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 flex-shrink-0 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        {['day', 'week', 'month', 'year'].map((view) => (
                            <button
                                key={view}
                                onClick={() => setCalendarView(view)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    calendarView === view
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {view.charAt(0).toUpperCase() + view.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToToday}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Today
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>

                            <span className="text-lg font-bold text-gray-900 min-w-[200px] text-center">
                                {calendarData.label}
                            </span>

                            <button
                                onClick={() => navigate(1)}
                                className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Body */}
            <div className="p-6 overflow-y-auto flex-1">
                {calendarView === 'day' && <DayView data={calendarData} followUps={followUps} getFollowUpsForHour={getFollowUpsForHour} onFollowUpAction={onFollowUpAction} />}
                {calendarView === 'week' && <WeekView data={calendarData} followUps={followUps} getFollowUpsForHour={getFollowUpsForHour} onFollowUpAction={onFollowUpAction} />}
                {calendarView === 'month' && <MonthView data={calendarData} followUps={followUps} getFollowUpsForDate={getFollowUpsForDate} onFollowUpAction={onFollowUpAction} />}
                {calendarView === 'year' && <YearView data={calendarData} followUps={followUps} getFollowUpsForDate={getFollowUpsForDate} onFollowUpAction={onFollowUpAction} />}
            </div>
        </div>
    );
};

// Day View Component
const DayView = ({ data, followUps, getFollowUpsForHour, onFollowUpAction }) => {
    return (
        <div className="space-y-2">
            {data.hours.map((hour) => {
                const hourFollowUps = getFollowUpsForHour(data.date, hour);
                return (
                    <div key={hour} className="flex gap-4 border-b border-gray-100 pb-2">
                        <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-600 pt-2">
                            {hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
                        </div>
                        <div className="flex-1 min-h-[60px] space-y-1">
                            {hourFollowUps.map((followUp) => {
                                const statusConfig = followUpStatusConfig[followUp.status];
                                return (
                                    <div
                                        key={followUp.id}
                                        onClick={() => onFollowUpAction('view', followUp)}
                                        className={`p-2 rounded-lg cursor-pointer ${statusConfig.bg} ${statusConfig.border} border hover:shadow-md transition-all`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                                            <span className={`font-medium text-sm ${statusConfig.text}`}>
                                                {followUp.followUpType}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">{followUp.contactNo}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Week View Component
const WeekView = ({ data, followUps, getFollowUpsForHour, onFollowUpAction }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
                {/* Header - Days */}
                <div className="grid grid-cols-8 gap-px bg-gray-200 mb-px">
                    <div className="bg-gray-50 p-3 text-xs font-semibold text-gray-500">
                        Time/Days
                    </div>
                    {data.days.map((day, idx) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        return (
                            <div
                                key={idx}
                                className={`bg-white p-3 text-center ${isToday ? 'bg-blue-50' : ''}`}
                            >
                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                    {weekDays[day.getDay()]} {day.getMonth() + 1}/{day.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Time slots */}
                <div className="grid grid-cols-8 gap-px bg-gray-200">
                    {data.hours.map((hour, hourIdx) => (
                        <React.Fragment key={hour}>
                            {/* Time label */}
                            <div className="bg-gray-50 p-3 text-xs font-medium text-gray-600 flex items-start">
                                {hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`}
                            </div>

                            {/* Day cells */}
                            {data.days.map((day, dayIdx) => {
                                const hourFollowUps = getFollowUpsForHour(day, hour);
                                const isToday = day.toDateString() === new Date().toDateString();

                                return (
                                    <div
                                        key={`${hour}-${dayIdx}`}
                                        className={`bg-white p-2 min-h-[60px] ${isToday ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="space-y-1">
                                            {hourFollowUps.map((followUp) => {
                                                const statusConfig = followUpStatusConfig[followUp.status];
                                                return (
                                                    <div
                                                        key={followUp.id}
                                                        onClick={() => onFollowUpAction('view', followUp)}
                                                        className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${statusConfig.bg} ${statusConfig.text} hover:shadow-sm transition-shadow truncate`}
                                                    >
                                                        {followUp.followUpType}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Month View Component
const MonthView = ({ data, followUps, getFollowUpsForDate, onFollowUpAction }) => {
    return (
        <div>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 sticky top-0 bg-white z-10">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
                {data.days.map((date, index) => {
                    const dateFollowUps = getFollowUpsForDate(date);
                    const isCurrentMonth = date.getMonth() === data.currentMonth;
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className={`
                                min-h-[100px] p-2 rounded-lg border transition-all cursor-pointer
                                ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}
                                ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                                hover:shadow-md
                            `}
                        >
                            <div className={`
                                text-sm font-semibold mb-1
                                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                ${isToday ? 'text-blue-600' : ''}
                            `}>
                                {date.getDate()}
                            </div>

                            {/* FollowUps for this date */}
                            <div className="space-y-1">
                                {dateFollowUps.slice(0, 3).map((followUp) => {
                                    const statusConfig = followUpStatusConfig[followUp.status];
                                    return (
                                        <div
                                            key={followUp.id}
                                            onClick={() => onFollowUpAction('view', followUp)}
                                            className={`
                                                px-2 py-1 rounded text-xs font-medium truncate
                                                ${statusConfig.bg} ${statusConfig.text}
                                                hover:shadow-sm transition-shadow
                                            `}
                                        >
                                            {followUp.followUpType}
                                        </div>
                                    );
                                })}
                                {dateFollowUps.length > 3 && (
                                    <div className="text-xs text-gray-500 px-2">
                                        +{dateFollowUps.length - 3} more
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Year View Component
const YearView = ({ data, followUps, getFollowUpsForDate, onFollowUpAction }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [selectedMonth, setSelectedMonth] = useState(null);

    const selectedMonthFollowUps = selectedMonth !== null
        ? followUps.filter(followUp => {
            const followUpDate = new Date(followUp.dueDate);
            return followUpDate.getMonth() === selectedMonth && followUpDate.getFullYear() === data.months[selectedMonth].getFullYear();
        })
        : [];

    return (
        <div className="grid grid-cols-4 gap-6">
            {/* Month Grid - 3 columns */}
            <div className="col-span-3 grid grid-cols-3 gap-4">
                {data.months.map((month, monthIdx) => {
                    const year = month.getFullYear();
                    const monthNum = month.getMonth();
                    const firstDay = new Date(year, monthNum, 1);
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - firstDay.getDay());

                    const days = [];
                    let currentDay = new Date(startDate);

                    for (let i = 0; i < 35; i++) {
                        days.push(new Date(currentDay));
                        currentDay.setDate(currentDay.getDate() + 1);
                    }

                    const monthFollowUps = followUps.filter(followUp => {
                        const followUpDate = new Date(followUp.dueDate);
                        return followUpDate.getMonth() === monthNum && followUpDate.getFullYear() === year;
                    });

                    // Get status counts for the month
                    const statusCounts = monthFollowUps.reduce((acc, followUp) => {
                        acc[followUp.status] = (acc[followUp.status] || 0) + 1;
                        return acc;
                    }, {});

                    // Determine badge color based on priority
                    let monthBadgeColor = 'bg-blue-500';
                    if (statusCounts.overdue > 0) {
                        monthBadgeColor = 'bg-red-500';
                    } else if (statusCounts.dueToday > 0) {
                        monthBadgeColor = 'bg-green-500';
                    } else if (statusCounts.scheduled > 0) {
                        monthBadgeColor = 'bg-orange-500';
                    }

                    return (
                        <motion.div
                            key={monthIdx}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedMonth(monthIdx)}
                            className={`bg-white border-2 rounded-lg p-3 cursor-pointer transition-all ${
                                selectedMonth === monthIdx ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
                            }`}
                        >
                            {/* Month Header */}
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 text-sm">{monthNames[monthNum]}</h4>
                                {monthFollowUps.length > 0 && (
                                    <span className={`${monthBadgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                                        {monthFollowUps.length}
                                    </span>
                                )}
                            </div>

                            {/* Mini Calendar */}
                            <div className="grid grid-cols-7 gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                    <div key={idx} className="text-center text-xs text-gray-500 font-medium">
                                        {day}
                                    </div>
                                ))}
                                {days.map((day, dayIdx) => {
                                    const isCurrentMonth = day.getMonth() === monthNum;
                                    const dayFollowUps = getFollowUpsForDate(day);
                                    const hasFollowUps = dayFollowUps.length > 0;

                                    return (
                                        <div
                                            key={dayIdx}
                                            className={`text-center text-xs p-1 rounded ${
                                                isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
                                            } ${hasFollowUps ? monthBadgeColor + ' text-white font-bold' : ''}`}
                                        >
                                            {day.getDate()}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Follow-up List Sidebar */}
            <div className="col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-0">
                    <h3 className="font-bold text-gray-900 mb-4">
                        {selectedMonth !== null
                            ? `${monthNames[selectedMonth]} Follow-ups`
                            : 'Select a Month'
                        }
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {selectedMonth !== null ? (
                            selectedMonthFollowUps.length > 0 ? (
                                selectedMonthFollowUps.map((followUp) => {
                                    const statusConfig = followUpStatusConfig[followUp.status];
                                    return (
                                        <div
                                            key={followUp.id}
                                            onClick={() => onFollowUpAction('view', followUp)}
                                            className={`p-2 rounded-lg cursor-pointer ${statusConfig.bg} ${statusConfig.border} border hover:shadow-md transition-all`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
                                                <span className={`font-medium text-sm ${statusConfig.text}`}>
                                                    {followUp.followUpType}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{followUp.contactNo}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(followUp.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} {followUp.dueTime}
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-500 text-sm py-8">
                                    No follow-ups
                                </div>
                            )
                        ) : (
                            <div className="text-center text-gray-500 text-sm py-8">
                                Click on a month to see follow-ups
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowUpCalendar;
