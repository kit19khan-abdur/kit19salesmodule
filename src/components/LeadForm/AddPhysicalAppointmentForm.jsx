import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../common/RichTextEditor';
import { ChevronDown } from 'lucide-react'
import { getSession } from '../../getSession'
import { getUserFromHashedList, getAppointmentTypes } from '../../utils/lead'

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

const AddPhysicalAppointmentForm = ({ onSubmit, onClose, users = [] }) => {
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
    const [apiUsers, setApiUsers] = useState([])
    const [isUsersLoading, setIsUsersLoading] = useState(false)
    const [appointmentTypesList, setAppointmentTypesList] = useState([])
    const [isAppointmentTypesLoading, setIsAppointmentTypesLoading] = useState(false)
    const [isCollaboratorsOpen, setIsCollaboratorsOpen] = useState(false)
    const collaboratorsRef = useRef(null)
    const fromInputRef = useRef(null)
    const toInputRef = useRef(null)
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

        // Close collaborators dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (collaboratorsRef.current && !collaboratorsRef.current.contains(event.target)) {
                    setIsCollaboratorsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        const toggleCollaborator = (val) => {
            setCollaborators(prev => (
                prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
            ))
        }

    // fetch users from API and normalize to {id,name}
    useEffect(() => {
        let mounted = true
        const fetchUsers = async () => {
            setIsUsersLoading(true)
            try {
                const { userId, TokenId } = getSession()
                const details = { UserId: userId || 0 }
                const payload = {
                    Token: TokenId,
                    Message: '',
                    LoggedUserId: userId,
                    MAC_Address: '',
                    IP_Address: '',
                    Details: details,
                    BroadcastName: ''
                }
                const resp = await getUserFromHashedList(payload)
                let raw = resp?.Details ?? resp?.d ?? resp ?? []
                if (raw && raw.data) raw = raw.data
                if (raw && !Array.isArray(raw)) {
                    raw = raw.ResultList ?? raw.Users ?? raw.UserList ?? raw.Data ?? raw.Items ?? raw
                }
                const usersArray = Array.isArray(raw) ? raw : []
                const mapped = usersArray.map(u => ({
                    id: String(u.Code ?? u.Id ?? u.ID ?? u.UserId ?? u.Value ?? ''),
                    name: String(u.Text ?? u.TextN ?? u.Name ?? u.FullName ?? u.DisplayName ?? u.LoginName ?? u.UserName ?? '')
                }))
                if (mounted) setApiUsers(mapped)
            } catch (err) {
                console.error('AddPhysicalAppointmentForm fetch users error', err)
            } finally {
                if (mounted) setIsUsersLoading(false)
            }
        }
        fetchUsers()
        return () => { mounted = false }
    }, [])

    // fetch appointment types
    useEffect(() => {
        let mounted = true
        const fetchTypes = async () => {
            setIsAppointmentTypesLoading(true)
            try {
                const { userId, TokenId } = getSession()
                const details = { UserId: userId || 0,Mode:'PhysicalMeeting' }
                const payload = {
                    Token: TokenId,
                    Message: '',
                    LoggedUserId: userId,
                    MAC_Address: '',
                    IP_Address: '',
                    Details: details,
                    BroadcastName: ''
                }
                const resp = await getAppointmentTypes(payload)

                // helper to robustly extract an array from various envelope shapes
                const extractArray = (obj) => {
                    if (!obj) return []
                    // common candidates to check
                    const candidates = [
                        obj.Details,
                        obj.d,
                        obj,
                        obj?.Details?.data,
                        obj?.Details?.ResultList,
                        obj?.Details?.Items,
                        obj?.ResultList,
                        obj?.Types,
                        obj?.Items
                    ]
                    for (const c of candidates) {
                        if (Array.isArray(c)) return c
                        if (c && c.data && Array.isArray(c.data)) return c.data
                        if (c && c.ResultList && Array.isArray(c.ResultList)) return c.ResultList
                        if (c && c.Items && Array.isArray(c.Items)) return c.Items
                    }
                    return []
                }

                const arr = extractArray(resp)
                const mapped = arr.map(t => ({
                    // prefer numeric Id when present, otherwise fallback to Code or other fields
                    id: String(t.Id ?? t.ID ?? t.Code ?? t.value ?? t.id ?? t.Value ?? ''),
                    name: String(t.Text ?? t.TextN ?? t.name ?? t.Name ?? t.DisplayName ?? t.text ?? '')
                }))
                if (mounted) setAppointmentTypesList(mapped)
            } catch (err) {
                console.error('fetch appointment types error', err)
            } finally {
                if (mounted) setIsAppointmentTypesLoading(false)
            }
        }
        fetchTypes()
        return () => { mounted = false }
    }, [])

    const formatToDisplay = (val) => {
        if (!val) return ''
        // val expected as 'YYYY-MM-DDTHH:mm' or ISO string
        const dt = new Date(val)
        if (isNaN(dt)) return String(val)
        const dd = String(dt.getDate()).padStart(2, '0')
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const m = months[dt.getMonth()] || ''
        const yyyy = dt.getFullYear()
        const hh = String(dt.getHours()).padStart(2, '0')
        const mm = String(dt.getMinutes()).padStart(2, '0')
        return `${dd}-${m}-${yyyy} ${hh}:${mm}`
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            appointmentType,
            title,
            description,
            remarks,
            fromDate: formatToDisplay(fromDate),
            toDate: formatToDisplay(toDate),
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
                    <option value="">{isAppointmentTypesLoading ? 'Loading...' : 'Select Meeting Settings'}</option>
                    {appointmentTypesList.length > 0
                        ? appointmentTypesList.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))
                        : (
                            // fallback to default hard-coded options
                            <>
                                <option value="virtual">Virtual</option>
                                <option value="inperson">In Person</option>
                                <option value="phone">Phone Call</option>
                            </>
                        )
                    }
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Start Typing the details about the appointment"
                    rows="4"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Remarks</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="about the task..."
                    rows="3"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                        <label className="text-sm font-medium">From Date and Time<span className="text-red-600">*</span></label>
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={fromDate ? formatToDisplay(fromDate) : ''}
                                onClick={() => fromInputRef.current && (fromInputRef.current.showPicker ? fromInputRef.current.showPicker() : fromInputRef.current.click())}
                                placeholder="Select date and time"
                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white cursor-pointer"
                            />
                            <button
                                type="button"
                                onClick={() => fromInputRef.current && (fromInputRef.current.showPicker ? fromInputRef.current.showPicker() : fromInputRef.current.click())}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                aria-label="Open date picker"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
                                    <path d="M16 2v4M8 2v4" strokeWidth="1.5" />
                                    <path d="M3 10h18" strokeWidth="1.5" />
                                </svg>
                            </button>
                            <input
                                ref={fromInputRef}
                                required
                                type="datetime-local"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="absolute inset-0 opacity-0 pointer-events-none"
                            />
                        </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Due Date and Time<span className="text-red-600">*</span></label>
                    <div className="relative">
                        <input
                            type="text"
                            readOnly
                            value={toDate ? formatToDisplay(toDate) : ''}
                            onClick={() => toInputRef.current && (toInputRef.current.showPicker ? toInputRef.current.showPicker() : toInputRef.current.click())}
                            placeholder="Select date and time"
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white cursor-pointer"
                        />
                        <button
                            type="button"
                            onClick={() => toInputRef.current && (toInputRef.current.showPicker ? toInputRef.current.showPicker() : toInputRef.current.click())}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            aria-label="Open date picker"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" />
                                <path d="M16 2v4M8 2v4" strokeWidth="1.5" />
                                <path d="M3 10h18" strokeWidth="1.5" />
                            </svg>
                        </button>
                        <input
                            ref={toInputRef}
                            required
                            type="datetime-local"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="absolute inset-0 opacity-0 pointer-events-none"
                        />
                    </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={completeAddress}
                    onChange={(e) => setCompleteAddress(e.target.value)}
                    placeholder="Please enter complete address."
                    rows="3"
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
                        <option value="">{isUsersLoading ? 'Loading users...' : 'Nothing selected'}</option>
                        {(apiUsers.length > 0 ? apiUsers : users).map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                                <div>
                                        <label className="text-sm font-medium">Collaborators</label>
                                        <div className="relative" ref={collaboratorsRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsCollaboratorsOpen(!isCollaboratorsOpen)}
                                                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white"
                                            >
                                                <span className={collaborators.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                                                    {collaborators.length === 0
                                                        ? 'Nothing selected'
                                                        : `Selected: ${(apiUsers.length > 0 ? apiUsers : users).filter(o => collaborators.includes(o.id)).map(o => o.name).join(', ')}`}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCollaboratorsOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isCollaboratorsOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-blue-500 rounded shadow-lg max-h-48 overflow-y-auto">
                                                    {(apiUsers.length > 0 ? apiUsers : users).map((collaborator) => (
                                                        <label
                                                            key={collaborator.id}
                                                            className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${collaborators.includes(collaborator.id) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={collaborators.includes(collaborator.id)}
                                                                onChange={() => toggleCollaborator(collaborator.id)}
                                                                className="mr-2 rounded"
                                                            />
                                                            <span className="text-sm">{collaborator.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                </div>

                <div>
                    <label className="text-sm font-medium">Assigned Field Executive</label>
                    <select
                        value={assignedFieldExecutive}
                        onChange={(e) => setAssignedFieldExecutive(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded bg-white"
                    >
                        <option value="">{isUsersLoading ? 'Loading users...' : 'Nothing selected'}</option>
                        {(apiUsers.length > 0 ? apiUsers : users).map(u => (
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
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            rows="3"
                        />
                    </div>
                </div>
            )}

        </form>
    );
};

export default AddPhysicalAppointmentForm;
