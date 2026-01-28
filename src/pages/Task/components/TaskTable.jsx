import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Settings, ExternalLink, Eye, Edit, CheckCircle, MessageSquare, Trash2, EllipsisVertical, Plus, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImPlus } from "react-icons/im";
import TaskActionMenu from './TaskActionMenu';
import { taskStatusConfig } from '../constants';
import PopUpModal from '../../../components/PopUpModal/PopUpModal';
import Button from '../../../components/common/Button';
import AddFollowupForm from '../Forms/AddFollowupForm';
import SendMailForm from '../Forms/SendMailForm';
import SendSMS from '../../../components/LeadMass/SendSMS';
import SendSMSForm from '../../../components/EnquiriesForms/SendSMSForm';
import SendVoice from '../Forms/SendVoice';
import AddNotes from '../../../components/LeadForm/AddNotes';
import UploadData from '../../../components/LeadForm/UploadData';
import AddTask from '../Forms/AddTask';
import AddAppointment from '../Forms/AddAppointment';
import AddDeal from '../Forms/AddDeal';
import WebForm from '../../../components/LeadForm/WebForm';
import MassUpdate from '../Forms/MassUpdate';

const TaskTable = ({ tasks, selectedTasks, setSelectedTasks, onTaskAction }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [openMoreMenuId, setOpenMoreMenuId] = useState(null);
    const [hoveredProfileId, setHoveredProfileId] = useState(null);

    // ------------AllForms---------
    const [showFollowupForm, setShowFollowupForm] = useState(false);
    const [showMailForm, setShowMailForm] = useState(false);
    const [showSMSForm, setShowSMSForm] = useState(false);
    const [showVoiceForm, setShowVoiceForm] = useState(false);
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showUploadDataForm, setShowUploadDataForm] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [showAddAppointmentForm, setShowAddAppointmentForm] = useState(false);
    const [showAddDealForm, setShowAddDealForm] = useState(false);
    const [showWebForm, setShowWebForm] = useState(false);

// ------------------------------Mass Forms-------------------------------
    const [showMassUpdateForm, setShowMassUpdateForm] = useState(false);



    const moreMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
                setOpenMoreMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            {/* Mass Update Button - Shows when tasks are selected */}
            <AnimatePresence>
                {selectedTasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg font-semibold">
                                    {selectedTasks.length}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {selectedTasks.length === 1 ? '1 task selected' : `${selectedTasks.length} tasks selected`}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Update multiple tasks at once
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedTasks([])}
                                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    Clear Selection
                                </button>
                                <button
                                    onClick={() => {
                                        // Handle mass update
                                        setShowMassUpdateForm(true) //selectedTasks
                                        setSelectedTasks([])
                                    }}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    Mass Update
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                <th className="px-2 py-4 text-left text-sm font-semibold text-gray-900"></th>
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
                                        <td className="px-2 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <EllipsisVertical className="w-5 h-5 text-gray-400" />
                                                </button>
                                                {openMenuId === task.id && (
                                                    <TaskActionMenu
                                                        task={task}
                                                        onClose={() => setOpenMenuId(null)}
                                                        onAction={action => {
                                                            if (action === 'followup') {
                                                                setShowFollowupForm(true)
                                                            }else if (action === 'mail') {
                                                                setShowMailForm(true)
                                                            }else if (action === 'sms') {
                                                                setShowSMSForm(true)
                                                            }else if (action === 'voice') {
                                                                setShowVoiceForm(true)
                                                            }else if (action === 'notes') {
                                                                setShowAddNoteForm(true)
                                                            } else if (action === 'upload') {
                                                                setShowUploadDataForm(true) 
                                                            } else if (action === 'addtask') {
                                                                setShowAddTaskForm(true) 
                                                            } else if (action === 'addappointment') {
                                                                setShowAddAppointmentForm(true) 
                                                            } else if (action === 'adddeal') {
                                                                setShowAddDealForm(true) 
                                                            } else if (action === 'fillWebform') {
                                                                setShowWebForm(true) 
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-start gap-3 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                                <div className={`p-2 rounded-lg ${statusConfig.bg} mt-1`}>
                                                    <statusConfig.icon className={`w-5 h-5 ${statusConfig.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-semibold text-gray-900 mb-1 line-clamp-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                                        {task.title}
                                                    </h3>
                                                    <p className={`text-sm text-gray-500 mb-2 line-clamp-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                                        {task.description}
                                                    </p>
                                                    <div className={`flex items-center gap-4 text-xs text-gray-500 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                                        <span className="font-medium">
                                                            Completed: <span className="text-gray-700">{task.completedDate}</span>
                                                        </span>
                                                        <span>{task.completedTime}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className={`text-xs font-medium text-green-600 ${task.status === 'completed' ? 'line-through' : ''}`}>
                                                            Outcome: {task.outcome}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="relative"
                                                    onMouseEnter={() => setHoveredProfileId(task.id)}
                                                    onMouseLeave={() => setHoveredProfileId(null)}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer">
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

                                                    {/* Profile Detail Popup */}
                                                    <AnimatePresence>
                                                        {hoveredProfileId === task.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-400 overflow-hidden z-[100]"
                                                            >
                                                                {/* Header */}
                                                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="relative">
                                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden ring-2 ring-white">
                                                                                <img
                                                                                    src={task.avatar}
                                                                                    alt={task.relatedTo}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            </div>
                                                                            {task.badge !== undefined && (
                                                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                                                                    {task.badge}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <h4 className="font-bold text-blue-600 text-sm">{task.relatedTo}</h4>
                                                                                <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">tklrtk</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Lead Info */}
                                                                <div className="px-4 py-3 border-b border-gray-200">
                                                                    <p className="text-xs text-gray-600 mb-2">Lead since 19 Jul 2022 15:21:51</p>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-600">Lead score</span>
                                                                        <span className="text-xs font-bold text-green-600">↑3%</span>
                                                                        <span className="text-xs text-gray-500">in last 7 days. Top scoring factor(s):</span>
                                                                    </div>
                                                                </div>

                                                                {/* Activity Timeline */}
                                                                <div className="px-4 py-3 max-h-48 overflow-y-auto">
                                                                    <div className="space-y-3">
                                                                        <div className="flex gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                                <span className="text-blue-600 font-bold text-xs">{task.badge || 0}</span>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-700">
                                                                                    <span className="text-green-600 font-semibold">↑</span> kmukesh343 added a followup to leadno 21751 with status Trading Account Opened. Lead was assigned to no one
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                                <span className="text-blue-600 font-bold text-xs">{task.badge || 0}</span>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-700">
                                                                                    <span className="text-green-600 font-semibold">↑</span> kmukesh343 added a followup to leadno 21751 with status Trading Account Opened. Lead was assigned to no one
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                                                <span className="text-blue-600 font-bold text-xs">{task.badge || 0}</span>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-xs text-gray-700">
                                                                                    <span className="text-green-600 font-semibold">↑</span> kmukesh343 added a followup to leadno 21751 with status Trading Account Opened. Lead was assigned to no one
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Footer */}
                                                                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden ring-2 ring-white">
                                                                            <img
                                                                                src={task.avatar}
                                                                                alt={task.relatedTo}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <h5 className="font-semibold text-gray-900 text-xs">{task.relatedTo}</h5>
                                                                                <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">Owner: {task.owner}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">{task.relatedTo}</span>
                                                        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer" />
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        Owner: <span className="text-gray-700">{task.owner}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Collaborator: <span className="text-gray-700">{task.collaborator || 'processdemo'}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="relative" ref={openMoreMenuId === task.id ? moreMenuRef : null}>
                                                    <button
                                                        onClick={() => setOpenMoreMenuId(openMoreMenuId === task.id ? null : task.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <Settings className="w-5 h-5 text-gray-400" />
                                                    </button>
                                                    <AnimatePresence>
                                                        {openMoreMenuId === task.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute -right-[50%] top-40% mt-2 w-56 bg-white rounded-xl shadow-2xl  overflow-hidden z-50"
                                                            >
                                                                {/* Menu Items */}
                                                                <div className="py-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            onTaskAction('view', task);
                                                                            setOpenMoreMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                    >
                                                                        <Eye className="w-5 h-5 text-[#929191]" />
                                                                        <span className="font-medium text-[#929191]">View</span>
                                                                    </button>
                                                                    {task.status !== 'completed' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => {
                                                                                    onTaskAction('edit', task);
                                                                                    setOpenMoreMenuId(null);
                                                                                }}
                                                                                className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                            >
                                                                                <Edit className="w-5 h-5 text-[#929191]" />
                                                                                <span className="font-medium text-[#929191]">Edit</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    onTaskAction('markCompleted', task);
                                                                                    setOpenMoreMenuId(null);
                                                                                }}
                                                                                className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                            >
                                                                                <CheckSquare className="w-5 h-5 text-[#929191]" />
                                                                                <span className="font-medium text-[#929191]">Mark As Completed</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    onTaskAction('comment', task);
                                                                                    setOpenMoreMenuId(null);
                                                                                }}
                                                                                className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                                                                            >
                                                                                <MessageSquare className="w-5 h-5 text-[#929191]" />
                                                                                <span className="font-medium text-[#929191]">Comment</span>
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    <button
                                                                        onClick={() => {
                                                                            onTaskAction('remove', task);
                                                                            setOpenMoreMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
                                                                    >
                                                                        <Trash2 className="w-5 h-5 text-red-700" />
                                                                        <span className="font-medium text-red-700">Remove</span>
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
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
            {/* Followup Form Modal */}
            <PopUpModal
                isOpen={showFollowupForm}
                onClose={() => setShowFollowupForm(false)}
                title="Add FollowUp"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowFollowupForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowFollowupForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddFollowupForm />
            </PopUpModal>

            <PopUpModal
                isOpen={showMailForm}
                onClose={() => setShowMailForm(false)}
                title="Send Mail"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowMailForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowMailForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <SendMailForm />
            </PopUpModal>

            <PopUpModal
                isOpen={showSMSForm}
                onClose={() => setShowSMSForm(false)}
                title="Send SMS"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowSMSForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowSMSForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <SendSMSForm />
            </PopUpModal>

            <PopUpModal
                isOpen={showVoiceForm}
                onClose={() => setShowVoiceForm(false)}
                title="Send Voice"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowVoiceForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowVoiceForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <SendVoice />
            </PopUpModal>

            <PopUpModal
                isOpen={showAddNoteForm}
                onClose={() => setShowAddNoteForm(false)}
                title="Add Comments/Notes"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddNoteForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddNoteForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddNotes />
            </PopUpModal>

            <PopUpModal
                isOpen={showUploadDataForm}
                onClose={() => setShowUploadDataForm(false)}
                title="Upload Document"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowUploadDataForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowUploadDataForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <UploadData />
            </PopUpModal>

            <PopUpModal
                isOpen={showAddTaskForm}
                onClose={() => setShowAddTaskForm(false)}
                title="Add task"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddTaskForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddTaskForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddTask />
            </PopUpModal>

            <PopUpModal
                isOpen={showAddAppointmentForm}
                onClose={() => setShowAddAppointmentForm(false)}
                title="Add Appointment"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddAppointmentForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddAppointmentForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddAppointment />
            </PopUpModal>

            <PopUpModal
                isOpen={showAddDealForm}
                onClose={() => setShowAddDealForm(false)}
                title="Add Deal"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowAddDealForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowAddDealForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <AddDeal />
            </PopUpModal>

            <PopUpModal
                isOpen={showWebForm}
                onClose={() => setShowWebForm(false)}
                title="Fill Webform"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowWebForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowWebForm(false)}
                        >
                            open
                        </Button>
                    </div>
                }
            >
                <WebForm />
            </PopUpModal>

            <PopUpModal
                isOpen={showMassUpdateForm}
                onClose={() => setShowMassUpdateForm(false)}
                title="Mass Update Task"
                size="lg"
                footer={
                    <div className="flex justify-between w-full">
                        <Button
                            variant="secondary"
                            onClick={() => setShowMassUpdateForm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='success'
                            onClick={() => setShowMassUpdateForm(false)}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <MassUpdate />
            </PopUpModal>

        </div>
    );
};

export default TaskTable;
