import React, { useState, useEffect } from 'react';
import { serviceInstance } from '../../../axiosinstance';
import { getSession } from '../../../getSession';
import { Clock } from 'lucide-react';

const AddFollowupForm = ({ selectedCount = 0 }) => {
    const [formData, setFormData] = useState({
        followupType: '',
        assignTo: '',
        nextStatusDate: new Date().toISOString().split('T')[0],
        nextStatusTime: '01:58 AM',
        conversionDate: new Date().toISOString().split('T')[0],
        conversionTime: '01:59 AM',
        amountPaid: '',
        remarks: '',
        products: '',
        reAssign: false,
        onSchedule: false
    });

    const defaultFollowupTypes = [
        'Select FollowupStatus',
        'Call-Back',
        'Not-Interested',
        'Dead Lead',
        'Wrong Number',
        'Converted',
        'Call-Back_Converted',
        'New Product',
        'New Source',
        'New'
    ];

    // followupOptions: array of { code, text }
    const [followupOptions, setFollowupOptions] = useState(
        defaultFollowupTypes.map((t, i) => ({ code: i === 0 ? '' : t, text: t }))
    );

    // assignable users for "Assign To" dropdown: array of { id, name }
    const [assignableUsers, setAssignableUsers] = useState([{ id: '', name: 'Select User' }]);

    // Fetch follow-up suggestions from Services.Kit19.com
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    Details: JSON.stringify({ UserId: session.userId || 0 })
                };

                const resp = await serviceInstance.post('/Suggestion/FollowUpSuggestions', payload);
                const data = resp?.data;
                if (data?.Status === 1 && Array.isArray(data.Details)) {
                    // Map to array of { code, text } using response fields Code & Text when available
                    const list = data.Details.map(item => {
                        if (typeof item === 'string') return { code: item, text: item };
                        // Prefer ID for code and FollowupStatus for text as requested
                        const code = item?.ID ?? item?.Id ?? item?.Code ?? item?.code ?? '';
                        const text = item?.FollowupStatus ?? item?.Text ?? item?.TextName ?? item?.Name ?? String(code || '');
                        return { code: String(code), text: String(text) };
                    }).filter(it => it && it.text);

                    if (list.length) setFollowupOptions([{ code: '', text: 'Select FollowupStatus' }, ...list]);
                } else {
                    console.warn('FollowUpSuggestions fetch failed', data);
                }
            } catch (err) {
                console.error('Error fetching follow up suggestions', err);
            }
        };

        fetchSuggestions();
    }, []);

    // Fetch users for "Assign To" dropdown using Services API: UserCRM/GetUserHierarchyList
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    // server expects { UserID: long }
                    Details: JSON.stringify({ UserID: session.userId || 0 })
                };

                const resp = await serviceInstance.post('/UserCRM/GetUserHierarchyList', payload);
                const data = resp?.data;
                if (data?.Status === 1 && data.Details) {
                    // normalize possible shapes
                    let rows = [];
                    if (Array.isArray(data.Details)) rows = data.Details;
                    else if (Array.isArray(data.Details?.data)) rows = data.Details.data;
                    else if (Array.isArray(data.Details?.d)) rows = data.Details.d;

                    const list = rows.map(r => {
                        // response rows may contain different field names
                        const id = r?.USER_ID ?? r?.User_ID ?? r?.UserId ?? r?.ID ?? r?.Id ?? r?.UserID ?? '';
                        const name = r?.User_Login ?? r?.Name ?? r?.FullName ?? r?.UserName ?? r?.LoginName ?? String(id);
                        return { id: String(id), name: String(name) };
                    }).filter(it => it && it.id);

                    if (list.length) setAssignableUsers([{ id: '', name: 'Select User' }, ...list]);
                } else {
                    console.warn('GetUserHierarchyList fetch failed', data);
                }
            } catch (err) {
                console.error('Error fetching users for lead popup', err);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const getSelectedFollowupText = () => {
        const found = followupOptions.find(o => String(o.code) === String(formData.followupType));
        return found ? found.text : formData.followupType;
    };

    const renderFormFields = () => {
        const selectedText = getSelectedFollowupText();
        switch (selectedText) {
            case 'Call-Back':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {assignableUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Date</label>
                            <input
                                type="date"
                                name="nextStatusDate"
                                value={formData.nextStatusDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="nextStatusTime"
                                    value={formData.nextStatusTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                placeholder="Enter product"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Followup Type :</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reAssign"
                                    checked={formData.reAssign}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Re-Assign</label>
                            </div>
                        </div>
                    </>
                );

            case 'Converted':
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {assignableUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conversion Date</label>
                            <input
                                type="date"
                                name="conversionDate"
                                value={formData.conversionDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conversion Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="conversionTime"
                                    value={formData.conversionTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount paid</label>
                            <input
                                type="text"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                placeholder="Amount Paid"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                placeholder="Enter product"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Followup Type :</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reAssign"
                                    checked={formData.reAssign}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Re-Assign</label>
                            </div>
                        </div>
                    </>
                );

            case 'Dead Lead':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Remarks"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                );

            default:
                return (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
                            <select
                                name="assignTo"
                                value={formData.assignTo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {assignableUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Date</label>
                            <input
                                type="date"
                                name="nextStatusDate"
                                value={formData.nextStatusDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Next Status Time</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="nextStatusTime"
                                    value={formData.nextStatusTime}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Remarks"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
                            <input
                                type="text"
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                placeholder="Enter product"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Followup Type :</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="reAssign"
                                    checked={formData.reAssign}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Re-Assign</label>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div>
            {/* Info Banner - Show when mass action */}
            {selectedCount > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-3 mb-4 flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                        <strong>Info!</strong> You are about to perform a mass action on {selectedCount} selected record(s)
                    </p>
                </div>
            )}

            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Follow up</label>
                <select
                    name="followupType"
                    value={formData.followupType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {followupOptions.map((opt) => (
                        <option key={opt.code} value={opt.code}>{opt.text}</option>
                    ))}
                </select>
            </div>

            {renderFormFields()}

            {/* On Schedule Date And Time checkbox - Show for certain types */}
            {(formData.followupType === 'Call-Back' || formData.followupType === 'Converted') && (
                <div className="flex items-center mt-6">
                    <input
                        type="checkbox"
                        name="onSchedule"
                        checked={formData.onSchedule}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">On Schedule Date And Time</label>
                </div>
            )}
        </div>
    );
};

export default AddFollowupForm;
