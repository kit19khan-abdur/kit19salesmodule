import React, { useState, useEffect } from 'react';
import RichTextEditor from '../common/RichTextEditor';

const generateDefaultTitle = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `NewAppointment_${y}${m}${d}${hh}${mm}${ss}`;
};

const AddAppointmentForm = ({ onSubmit, onClose, users = [] }) => {
    const [appointmentType, setAppointmentType] = useState('');
    const [title, setTitle] = useState(generateDefaultTitle());
    const [description, setDescription] = useState('');
    const [remarks, setRemarks] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [whereField, setWhereField] = useState('');
    const [completeAddress, setCompleteAddress] = useState('');
    const [owner, setOwner] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [assignedFieldExecutive, setAssignedFieldExecutive] = useState('');
    const [markCompleted, setMarkCompleted] = useState(false);
    const [outcome, setOutcome] = useState('Converted');

    useEffect(() => {
        // set sensible default dates: now and +1 hour
        if (!fromDate) {
            const now = new Date();
            setFromDate(new Date(now.getTime()).toISOString().slice(0, 16));
            const plusHour = new Date(now.getTime() + 60 * 60 * 1000);
            setToDate(plusHour.toISOString().slice(0, 16));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            appointmentType,
            title,
            description,
            remarks,
            fromDate,
            toDate,
            where: whereField,
            completeAddress,
            owner,
            collaborators,
            assignedFieldExecutive,
            markCompleted,
            outcome: markCompleted ? outcome : null
        };
        if (onSubmit) onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-auto pr-2">
            <div>
                <label className="text-sm font-medium">Appointment Type</label>
                <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="">Select Meeting Settings</option>
                    <option value="virtual">Virtual</option>
                    <option value="inperson">In Person</option>
                    <option value="phone">Phone Call</option>
                </select>
            </div>

            <div>
                <label className="text-sm font-medium">Appointment Title <span className="text-red-600">*</span></label>
                <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-24 resize-none"
                    placeholder="Start Typing the details about the appointment"
                    rows={4}
                />
            </div>

            <div>
                <label className="text-sm font-medium">Remarks</label>
                <textarea
                    value={remarks}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-24 resize-none"
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="about the task..."
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">From Date and Time<span className="text-red-600">*</span></label>
                    <input
                        required
                        type="datetime-local"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Due Date and Time<span className="text-red-600">*</span></label>
                    <input
                        required
                        type="datetime-local"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Where <span className="text-red-600">*</span></label>
                <input
                    required
                    value={whereField}
                    onChange={(e) => setWhereField(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
                    placeholder="Enter Where *"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Complete Address</label>
                <textarea
                    value={completeAddress}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-24 resize-none"
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder="Please enter complete address."
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-sm font-medium">Owner</label>
                    <select
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">Nothing selected</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Collaborators</label>
                    <select
                        multiple
                        value={collaborators}
                        onChange={(e) => setCollaborators(Array.from(e.target.selectedOptions, o => o.value))}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white h-24"
                    >
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Assigned Field Executive</label>
                    <select
                        value={assignedFieldExecutive}
                        onChange={(e) => setAssignedFieldExecutive(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">Nothing selected</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <input id="markCompleted" type="checkbox" checked={markCompleted} onChange={e => setMarkCompleted(e.target.checked)} className="w-4 h-4 rounded" />
                <label htmlFor="markCompleted" className="text-sm font-medium">Mark as Completed</label>
            </div>

            {markCompleted && (
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium">Outcomes</label>
                        <select value={outcome} onChange={e => setOutcome(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded">
                            <option value="Converted">Converted</option>
                            <option value="Not Converted">Not Converted</option>
                            <option value="Follow Up">Follow Up</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Remarks</label>
                        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-24 resize-none" />
                    </div>
                </div>
            )}

        </form>
    );
};

export default AddAppointmentForm;
