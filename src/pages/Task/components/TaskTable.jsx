import React, { useState } from 'react';
import { MoreHorizontal, Settings, ExternalLink } from 'lucide-react';
import TaskActionMenu from './TaskActionMenu';
import { taskStatusConfig } from '../constants';

const TaskTable = ({ tasks, selectedTasks, setSelectedTasks, onTaskAction }) => {
    const [openMenuId, setOpenMenuId] = useState(null);

    const handleSelectTask = (taskId) => {
        setSelectedTasks(prev => {
            if (prev.includes(taskId)) {
                return prev.filter(id => id !== taskId);
            } else {
                return [...prev, taskId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTasks(tasks.map(task => task.id));
        } else {
            setSelectedTasks([]);
        }
    };

    return (
        <div className="px-8 py-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Task</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Related to</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tasks.map((task) => {
                                const statusConfig = taskStatusConfig[task.status];
                                return (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.includes(task.id)}
                                                onChange={() => handleSelectTask(task.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${statusConfig.bg} mt-1`}>
                                                    <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="font-medium">
                                                            Completed: <span className="text-gray-700">{task.completedDate}</span>
                                                        </span>
                                                        <span>{task.completedTime}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="text-xs font-medium text-green-600">
                                                            Outcome: {task.outcome}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                                        <img 
                                                            src={task.avatar} 
                                                            alt={task.relatedTo}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {task.badge !== undefined && (
                                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                            {task.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">{task.relatedTo}</span>
                                                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Owner: <span className="text-gray-700">{task.owner}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                                </button>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Settings className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                    {openMenuId === task.id && (
                                                        <TaskActionMenu
                                                            task={task}
                                                            onClose={() => setOpenMenuId(null)}
                                                            onAction={onTaskAction}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TaskTable;
