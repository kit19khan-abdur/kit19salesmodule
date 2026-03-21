import React, { useState, useEffect } from 'react';
import { serviceInstance } from '../../axiosinstance';
import { getSession } from '../../getSession';

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

    // Task types fetched from Services API: { id, name }
    const [taskTypes, setTaskTypes] = useState([{ id: '', name: 'Select Meeting Settings' }]);
    // Users for Owner/Collaborators/Assigned Field Executive
    const [usersList, setUsersList] = useState(users || []);

    useEffect(() => {
        // set sensible default dates: now and +1 hour
        if (!fromDate) {
            const now = new Date();
            setFromDate(new Date(now.getTime()).toISOString().slice(0, 16));
            const plusHour = new Date(now.getTime() + 60 * 60 * 1000);
            setToDate(plusHour.toISOString().slice(0, 16));
        }
    }, []);

    // Fetch task types for Appointment Type dropdown
    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    Details: JSON.stringify({ ParentId: session.parentId || 0 })
                };

                const resp = await serviceInstance.post('/UserCRM/GetSalesActivityTaskTypeListByParentId', payload);
                const data = resp?.data;
                if (data?.Status === 1 && data.Details) {
                    // Normalize possible response shapes
                    let rows = [];
                    if (Array.isArray(data.Details)) rows = data.Details;
                    else if (Array.isArray(data.Details?.data)) rows = data.Details.data;
                    else if (Array.isArray(data.Details?.d)) rows = data.Details.d;

                    const list = rows.map(r => ({
                        id: String(r?.Id ?? r?.ID ?? r?.id ?? ''),
                        name: String(r?.TaskType ?? r?.Tasktype ??'')
                    })).filter(i => i.id);

                    if (list.length) setTaskTypes([{ id: '', name: 'Select Meeting Settings' }, ...list]);
                } else {
                    console.warn('GetSalesActivityTaskTypeListByParentId fetch failed', data);
                }
            } catch (err) {
                console.error('Error fetching task types', err);
            }
        };

        fetchTaskTypes();
    }, []);

    // Fetch users for Owner / Collaborators / Assigned Field Executive using Services API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    Details: JSON.stringify({ UserID: session.userId || 0 })
                };

                const resp = await serviceInstance.post('/UserCRM/GetUserHierarchyList', payload);
                const data = resp?.data;
                if (data?.Status === 1 && data.Details) {
                    let rows = [];
                    if (Array.isArray(data.Details)) rows = data.Details;
                    else if (Array.isArray(data.Details?.data)) rows = data.Details.data;
                    else if (Array.isArray(data.Details?.d)) rows = data.Details.d;

                    const list = rows.map(r => {
                        // Use only USER_ID and User_Login for collaborators/owners
                        const id = r?.USER_ID ?? '';
                        const name = r?.User_Login ?? '';
                        return { id: String(id), name: String(name) };
                    }).filter(it => it && it.id && it.name);

                    if (list.length) setUsersList(list);
                } else {
                    console.warn('GetUserHierarchyList fetch failed', data);
                }
            } catch (err) {
                console.error('Error fetching users list', err);
            }
        };

        fetchUsers();
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
    <form onSubmit={handleSubmit} className="space-y-4 pr-2">
            <div>
                <label className="text-sm font-medium">Appointment Type</label>
                <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white"
                >
                    {taskTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-24 resize-none"
                    placeholder="Start Typing the details about the appointment"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Remarks</label>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-20 resize-none"
                    placeholder="about the task..."
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
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-20 resize-none"
                    placeholder="Please enter complete address."
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-sm font-medium">Owner</label>
                    <select  id="ddlOwners"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">Nothing selected</option>
                   
                   
                        {usersList.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                                <div>
                                        <label className="text-sm font-medium">Cousers</label>
                                        <select id="ddlCousers"
                                                multiple
                                                value={collaborators}
                                                onChange={(e) => setCollaborators(Array.from(e.target.selectedOptions, o => o.value))}
                                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white h-24"
                                        >
                                                            {usersList.map(u => (
                                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                                ))}
                                        </select>
                                </div>

                <div>
                    <label className="text-sm font-medium">Assigned Field Executive</label>
                    <select   id="ddlAssignedFieldExecutive" 
                        value={assignedFieldExecutive}
                        onChange={(e) => setAssignedFieldExecutive(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">Nothing selected</option>
                        {usersList.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>))}
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
                        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded h-20 resize-none" />
                    </div>
                </div>
            )}

        </form>
    );
};

export default AddAppointmentForm;
