import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Mail, Phone, MessageSquare, Trash2, MoreVertical, Edit, Mic, Users, UserPlus, Eye, CheckCircle2, MessageCircle, Mic2, Notebook, Upload, ClipboardCheck, CalendarCheck, PercentCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { taskStatusConfig } from '../constants';
import TaskDetailModal from './TaskDetailModal';
import { TfiLayoutAccordionList } from "react-icons/tfi";

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

    // Get month view (calendar grid)
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

const TaskCalendar = ({ tasks, onTaskAction }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState('week'); // day, week, month, year
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    // Get calendar data based on view
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

    // Get tasks for a specific date
    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toDateString() === date.toDateString();
        });
    };

    // Get tasks for a specific hour
    const getTasksForHour = (date, hour) => {
        return tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            const taskHour = parseInt(task.dueTime?.split(':')[0] || '0');
            return taskDate.toDateString() === date.toDateString() && taskHour === hour;
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
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
            <div className="p-6">
                {calendarView === 'week' && (
                    <WeekView data={calendarData} tasks={tasks} getTasksForHour={getTasksForHour} onTaskClick={handleTaskClick} />
                )}
                {calendarView === 'day' && (
                    <DayView data={calendarData} tasks={tasks} getTasksForHour={getTasksForHour} onTaskClick={handleTaskClick} />
                )}
                {calendarView === 'month' && (
                    <MonthView data={calendarData} tasks={tasks} getTasksForDate={getTasksForDate} onTaskClick={handleTaskClick} />
                )}
                {calendarView === 'year' && (
                    <YearView data={calendarData} tasks={tasks} getTasksForDate={getTasksForDate} onTaskClick={handleTaskClick} />
                )}
            </div>

            {/* Task Detail Modal */}
            <TaskDetailModal 
                task={selectedTask}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </div>
    );
};

// Week View Component
const WeekView = ({ data, tasks, getTasksForHour, onTaskClick }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
                {/* Header - Days */}
                <div className="grid grid-cols-8 gap-px bg-gray-200 mb-px">
                    <div className="bg-gray-50 p-3 text-xs font-semibold text-gray-500">
                        Tasks/BDays
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
                                const allDayTasks = tasks.filter(task => {
                                    const taskDate = new Date(task.dueDate);
                                    return taskDate.toDateString() === day.toDateString();
                                });
                                const isToday = day.toDateString() === new Date().toDateString();
                                const isFirstHour = hourIdx === 0;
                                
                                return (
                                    <div
                                        key={`${hour}-${dayIdx}`}
                                        className={`bg-white p-2 min-h-[80px] ${isToday ? 'bg-blue-50/30' : ''}`}
                                    >
                                        {isFirstHour && allDayTasks.map((task, taskIdx) => (
                                            <TaskItem key={taskIdx} task={task} onTaskClick={onTaskClick} compact />
                                        ))}
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

// Task Item with Hover Menu for Day View
const TaskItemWithMenu = ({ task, onTaskClick, hoveredTaskId, setHoveredTaskId, showActionMenu, setShowActionMenu }) => {
    const statusConfig = taskStatusConfig[task.status] || taskStatusConfig.open;
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowActionMenu(null);
            }
        };

        if (showActionMenu === task.id) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showActionMenu, task.id, setShowActionMenu]);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setHoveredTaskId(task.id)}
            onMouseLeave={() => setHoveredTaskId(null)}
        >
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onTaskClick && onTaskClick(task)}
                className={`p-3 rounded-lg border-l-3 ${statusConfig.border} bg-white hover:shadow-lg transition-all cursor-pointer`}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        <statusConfig.icon className={`w-5 h-5 ${statusConfig.color} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h4>
                            <p className="text-xs text-gray-600 line-clamp-1 mb-2">{task.description}</p>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs text-gray-500">{task.relatedTo}</span>
                                {task.dueTime && (
                                    <span className="text-xs font-medium text-blue-600">{task.dueTime}</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                                    <span>Owner: <span className="font-medium text-gray-700">{task.owner}</span></span>
                                    {task.collaborators && (
                                        <span>Collaborators: <span className="font-medium text-gray-700">{task.collaborators}</span></span>
                                    )}
                                </div>
                                {/* <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log('Add comment to task:', task.id);
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                    title="Add Comment"
                                >
                                    <MessageCircle className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Hover Action Icons */}
            {hoveredTaskId === task.id && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                        title="View"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Send email to', task.relatedTo);
                        }}
                    >
                        <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Add Followup"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Call', task.relatedTo);
                        }}
                    >
                        <CheckCircle2 className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Send Mail"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Send WhatsApp to', task.relatedTo);
                        }}
                    >
                        <Mail className="w-4 h-4 text-gray-400 hover:text-[#2545d3]" />
                    </button>
                    <button
                        title="Send SMS"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Send SMS to', task.relatedTo);
                        }}
                    >
                        <MessageCircle className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Send Voice"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <Mic2 className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Add Note"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <Notebook className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Upload Document"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <Upload className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Add Task"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <ClipboardCheck className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Add Appointment"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <CalendarCheck className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Add Deal"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <PercentCircle className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                    <button
                        title="Add Webform"
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete task', task.title);
                        }}
                    >
                        <TfiLayoutAccordionList className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                </div>
            )}
        </div>
    );
};

// Day View Component
const DayView = ({ data, tasks, getTasksForHour, onTaskClick }) => {
    const [hoveredTaskId, setHoveredTaskId] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(null);
    
    return (
        <div className="space-y-px bg-gray-200">
            {data.hours.map((hour) => {
                const hourTasks = getTasksForHour(data.date, hour);
                
                return (
                    <div key={hour} className="flex bg-white">
                        <div className="w-24 bg-gray-50 p-3 text-sm font-medium text-gray-600 flex-shrink-0">
                            {hour === 0 ? '12:00 am' : hour < 12 ? `${hour}:00 am` : hour === 12 ? '12:00 pm' : `${hour - 12}:00 pm`}
                        </div>
                        <div className="flex-1 p-3 min-h-[80px]">
                            <div className="space-y-2">
                                {hourTasks.map((task, idx) => (
                                    <TaskItemWithMenu 
                                        key={idx} 
                                        task={task} 
                                        onTaskClick={onTaskClick}
                                        hoveredTaskId={hoveredTaskId}
                                        setHoveredTaskId={setHoveredTaskId}
                                        showActionMenu={showActionMenu}
                                        setShowActionMenu={setShowActionMenu}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Month View Component
const MonthView = ({ data, tasks, getTasksForDate, onTaskClick }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [selectedDate, setSelectedDate] = React.useState(null);
    
    // Get tasks for the selected date or all tasks for current month
    const currentMonthTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getMonth() === data.currentMonth && taskDate.getFullYear() === data.days[15]?.getFullYear();
    });

    const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
    
    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="col-span-2">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-px bg-gray-200 mb-px">
                    {weekDays.map((day) => (
                        <div key={day} className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {data.days.map((day, idx) => {
                        const isCurrentMonth = day.getMonth() === data.currentMonth;
                        const isToday = day.toDateString() === new Date().toDateString();
                        const dayTasks = getTasksForDate(day);
                        const isSelected = selectedDate?.toDateString() === day.toDateString();
                        
                        return (
                            <div
                                key={idx}
                                onClick={() => isCurrentMonth && setSelectedDate(day)}
                                className={`bg-white p-2 min-h-[100px] cursor-pointer transition-all ${
                                    !isCurrentMonth ? 'bg-gray-50' : ''
                                } ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''} ${
                                    isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''
                                } hover:bg-gray-50`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className={`text-sm font-semibold ${
                                        !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
                                    }`}>
                                        {day.getDate()}
                                    </div>
                                    {dayTasks.length > 0 && (
                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                                            {dayTasks.length}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    {dayTasks.slice(0, 2).map((task, taskIdx) => {
                                        const statusConfig = taskStatusConfig[task.status];
                                        return (
                                            <div key={taskIdx} className={`w-2 h-2 rounded-full ${statusConfig.bg}`} />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Task List Sidebar */}
            <div className="col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-0">
                    <h3 className="font-bold text-gray-900 mb-4">
                        {selectedDate 
                            ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            : 'All Tasks This Month'
                        }
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {(selectedDate ? selectedDateTasks : currentMonthTasks).map((task, idx) => (
                            <TaskItem key={idx} task={task} onTaskClick={onTaskClick} compact />
                        ))}
                        {(selectedDate ? selectedDateTasks : currentMonthTasks).length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-8">
                                No tasks
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Year View Component
const YearView = ({ data, tasks, getTasksForDate, onTaskClick }) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [selectedMonth, setSelectedMonth] = React.useState(null);
    
    const selectedMonthTasks = selectedMonth !== null 
        ? tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.getMonth() === selectedMonth && taskDate.getFullYear() === data.months[selectedMonth].getFullYear();
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
                    const lastDay = new Date(year, monthNum + 1, 0);
                    const startDate = new Date(firstDay);
                    startDate.setDate(startDate.getDate() - firstDay.getDay());

                    const days = [];
                    let currentDay = new Date(startDate);
                    
                    for (let i = 0; i < 35; i++) {
                        days.push(new Date(currentDay));
                        currentDay.setDate(currentDay.getDate() + 1);
                    }

                    const monthTasks = tasks.filter(task => {
                        const taskDate = new Date(task.dueDate);
                        return taskDate.getMonth() === monthNum && taskDate.getFullYear() === year;
                    });

                    const isSelected = selectedMonth === monthIdx;

                    return (
                        <div 
                            key={monthIdx} 
                            onClick={() => setSelectedMonth(monthIdx)}
                            className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-gray-900">{monthNames[monthIdx].slice(0, 3)}</h3>
                                {monthTasks.length > 0 && (
                                    <div className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">
                                        {monthTasks.length}
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <div key={i} className="text-xs font-semibold text-gray-500 text-center">
                                        {d}
                                    </div>
                                ))}
                                
                                {days.map((day, dayIdx) => {
                                    const isCurrentMonth = day.getMonth() === monthNum;
                                    const isToday = day.toDateString() === new Date().toDateString();
                                    const dayTaskCount = getTasksForDate(day).length;
                                    
                                    return (
                                        <div
                                            key={dayIdx}
                                            className={`text-xs text-center py-1 rounded relative ${
                                                !isCurrentMonth ? 'text-gray-300' :
                                                isToday ? 'bg-blue-500 text-white font-bold' :
                                                dayTaskCount > 0 ? 'bg-blue-100 text-blue-800 font-semibold' :
                                                'text-gray-700'
                                            }`}
                                        >
                                            {day.getDate()}
                                            {dayTaskCount > 0 && isCurrentMonth && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
                                                    {dayTaskCount}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Task List Sidebar */}
            <div className="col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-0">
                    <h3 className="font-bold text-gray-900 mb-4">
                        {selectedMonth !== null 
                            ? `${monthNames[selectedMonth]} Tasks`
                            : 'Select a Month'
                        }
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {selectedMonth !== null && selectedMonthTasks.map((task, idx) => (
                            <TaskItem key={idx} task={task} onTaskClick={onTaskClick} compact />
                        ))}
                        {selectedMonth !== null && selectedMonthTasks.length === 0 && (
                            <div className="text-center text-gray-500 text-sm py-8">
                                No tasks this month
                            </div>
                        )}
                        {selectedMonth === null && (
                            <div className="text-center text-gray-500 text-sm py-8">
                                Click on a month to view tasks
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Task Item Component
const TaskItem = ({ task, onTaskClick, compact = false, mini = false }) => {
    const statusConfig = taskStatusConfig[task.status];
    
    if (mini) {
        return (
            <div
                onClick={() => onTaskClick && onTaskClick(task)}
                className={`text-xs px-2 py-1 rounded cursor-pointer ${statusConfig.light} ${statusConfig.text} hover:opacity-80 transition-opacity`}
            >
                <div className="truncate font-semibold">{task.title}</div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-600 truncate">Owner: {task.owner}</span>
                    <MessageCircle className="w-3 h-3 text-gray-400 hover:text-blue-600 cursor-pointer flex-shrink-0" 
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Add comment');
                        }}
                    />
                </div>
                {task.collaborators && (
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">
                        Collab: {task.collaborators}
                    </div>
                )}
            </div>
        );
    }
    
    if (compact) {
        return (
            <div
                onClick={() => onTaskClick && onTaskClick(task)}
                className={`px-3 py-2 rounded-lg cursor-pointer border-l-2 ${statusConfig.border} bg-white hover:shadow-md transition-all`}
            >
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <statusConfig.icon className={`w-3.5 h-3.5 ${statusConfig.color} flex-shrink-0`} />
                        <span className="text-xs font-semibold text-gray-900 truncate">{task.title}</span>
                    </div>
                    {task.dueTime && (
                        <span className="text-xs text-gray-500 flex-shrink-0">{task.dueTime}</span>
                    )}
                </div>
                <div className="flex items-center justify-between gap-2 ml-5">
                    <div className="flex flex-col gap-0.5 text-[10px] text-gray-600 flex-1 min-w-0">
                        <span className="truncate">Owner: {task.owner}</span>
                        {task.collaborators && (
                            <span className="truncate">Collaborators: {task.collaborators}</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Add comment to task:', task.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                        title="Add Comment"
                    >
                        <MessageCircle className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600" />
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onTaskClick && onTaskClick(task)}
            className={`p-3 rounded-lg border-l-3 ${statusConfig.border} bg-white hover:shadow-lg transition-all cursor-pointer`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <statusConfig.icon className={`w-5 h-5 ${statusConfig.color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-1 mb-2">{task.description}</p>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-gray-500">{task.relatedTo}</span>
                            {task.dueTime && (
                                <span className="text-xs font-medium text-blue-600">{task.dueTime}</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                                <span>Owner: <span className="font-medium text-gray-700">{task.owner}</span></span>
                                {task.collaborators && (
                                    <span>Collaborators: <span className="font-medium text-gray-700">{task.collaborators}</span></span>
                                )}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Add comment to task:', task.id);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                title="Add Comment"
                            >
                                <MessageCircle className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCalendar;
