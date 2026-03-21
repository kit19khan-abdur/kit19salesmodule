import React, { useState, useEffect } from 'react';
import { serviceInstance } from '../../../axiosinstance';
import { getSession } from '../../../getSession';
import { Clock } from 'lucide-react';

const AddFollowupForm = ({ selectedCount = 0, onSave, onCancel }) => {
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
        { id: 0, text: 'Select FollowupStatus', isCallback: 0, isConvert: 0 },
        { id: 1, text: 'Call-Back', isCallback: 1, isConvert: 0 },
        { id: 2, text: 'Not-Interested', isCallback: 0, isConvert: 0 },
        { id: 3, text: 'Dead Lead', isCallback: 0, isConvert: 0 },
        { id: 4, text: 'Wrong Number', isCallback: 0, isConvert: 0 },
        { id: 5, text: 'Converted', isCallback: 0, isConvert: 1 },
        { id: 6, text: 'Call-Back_Converted', isCallback: 1, isConvert: 1 },
        { id: 7, text: 'New Product', isCallback: 0, isConvert: 0 },
        { id: 8, text: 'New Source', isCallback: 0, isConvert: 0 },
        { id: 9, text: 'New', isCallback: 0, isConvert: 0 }
    ];

    // followupOptions: array of { Code, Text, ID, IsCallback, IsConvert, FupValue }
    // Code is the primary identifier (same as ID)
    // FupValue format: "Code,IsCallback,IsConvert"
    const [followupOptions, setFollowupOptions] = useState(
        defaultFollowupTypes.map((t) => ({ 
            Code: t.id.toString(),  // Code is the ID
            Text: t.text,
            ID: t.id.toString(),    // ID same as Code
            IsCallback: t.isCallback,
            IsConvert: t.isConvert,
            FupValue: t.id === 0 ? '' : `${t.id},${t.isCallback},${t.isConvert}`  // Full comma-separated value
        }))
    );

    // assignable users for "Assign To" dropdown: array of { id, name }
    const [assignableUsers, setAssignableUsers] = useState([{ id: '', name: 'Select User' }]);

    // Product suggestions for autocomplete
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);

    // Fetch follow-up suggestions from Services.Kit19.com
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    Details: JSON.stringify({ UserId: session.userId || 0 })
                };

                const resp = await serviceInstance.post('http://localhost:62194/Suggestion/FollowUpSuggestions', payload);
                const data = resp?.data;
                if (data?.Status === 1 && Array.isArray(data.Details)) {
                    // Map to array of { Code, Text, ID, IsCallback, IsConvert } using response fields
                    const list = data.Details.map(item => {
                        if (typeof item === 'string') return { Code: item, Text: item, ID: item, IsCallback: 0, IsConvert: 0 };
                        
                        // Extract Code (ID) from response - Code is the primary identifier
                        const Code = item?.Code ?? item?.ID ?? item?.Id ?? item?.id ?? item?.code ?? '';
                        const Text = item?.Text ?? item?.FollowupStatus ?? item?.Name ?? item?.name ?? String(Code || '');
                        const IsCallback = item?.IsCallback ?? item?.isCallback ?? 0;
                        const IsConvert = item?.IsConvert ?? item?.isConvert ?? 0;
                        
                        // Convert boolean to 1/0 if needed
                        const isCallbackValue = IsCallback === true ? 1 : (IsCallback === false ? 0 : (IsCallback ? 1 : 0));
                        const isConvertValue = IsConvert === true ? 1 : (IsConvert === false ? 0 : (IsConvert ? 1 : 0));
                        
                        // FupValue contains comma-separated: Code,IsCallback,IsConvert (with 1/0)
                        const FupValue = `${Code},${isCallbackValue},${isConvertValue}`;
                        
                        return { 
                            Code: String(Code),  // Store Code as the primary identifier
                            Text: String(Text),
                            ID: String(Code),    // ID is same as Code
                            IsCallback: isCallbackValue,
                            IsConvert: isConvertValue,
                            FupValue: String(FupValue)  // Store the full comma-separated value
                        };
                    }).filter(it => it && it.Text);

                    if (list.length) setFollowupOptions([{ Code: '', Text: 'Select FollowupStatus', ID: '', IsCallback: 0, IsConvert: 0, FupValue: '' }, ...list]);
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

                const resp = await serviceInstance.post('/Common/GetUserListByUserId', payload);
                const data = resp?.data;
                if (data?.Status === 1 && data.Details) {
                    // normalize possible shapes
                    let rows = [];
                    if (Array.isArray(data.Details)) rows = data.Details;
                    else if (Array.isArray(data.Details?.data)) rows = data.Details.data;
                    else if (Array.isArray(data.Details)) rows = data.Details;
                    const list = rows.map(r => {
                        // response rows may contain different field names
                        const id = r?.Code ?? r?.User_ID ?? r?.UserId ?? r?.ID ?? r?.Id ?? r?.UserID ?? '';
                        const name = r?.Text ?? r?.Name ?? r?.FullName ?? r?.UserName ?? r?.LoginName ?? String(id);
                        return { id: String(id), name: String(name) };
                    }).filter(it => it && it.id);

                    if (list.length) setAssignableUsers([{ id: '0', name: 'Select User' }, ...list]);
                } else {
                    console.warn('GetUserHierarchyList fetch failed', data);
                }
            } catch (err) {
                console.error('Error fetching users for lead popup', err);
            }
        };
 
        fetchUsers();
    }, []);

    // Fetch product suggestions when user types in products field
    const fetchProductSuggestions = async (filterText) => {
        if (!filterText || filterText.length < 2) {
            setProductSuggestions([]);
            setShowProductSuggestions(false);
            return;
        }

        try {
            const session = getSession();
            const payload = {
                Token: session.token,
                Details: JSON.stringify({ 
                    FilterText: filterText,
                    SectionName: '',
                    UserId: session.userId || 0 
                })
            };

            const resp = await serviceInstance.post('/Invoice/GetProductForSuggetion', payload);
            const data = resp?.data;
            if (data?.Status === 1 && Array.isArray(data.Details)) {
                setProductSuggestions(data.Details);
                setShowProductSuggestions(true);
            } else {
                setProductSuggestions([]);
                setShowProductSuggestions(false);
            }
        } catch (err) {
            console.error('Error fetching product suggestions', err);
            setProductSuggestions([]);
            setShowProductSuggestions(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Fetch product suggestions when products field changes
        if (name === 'products') {
            fetchProductSuggestions(value);
        }
    };

    const handleProductSelect = (product) => {
        setFormData(prev => ({
            ...prev,
            products: product.Name
        }));
        setShowProductSuggestions(false);
        setProductSuggestions([]);
    };

    const getSelectedFollowupText = () => {
        const found = followupOptions.find(o => String(o.Code) === String(formData.followupType));
        return found ? found.Text : formData.followupType;
    };

    // Map formData to API format expected by MergeLead
    const prepareFollowupData = () => {
        const session = getSession();
        const selectedOption = followupOptions.find(o => String(o.Code) === String(formData.followupType));
        
        // Combine date and time for NextStatusDate
        let nextStatusDateTime = '';
        if (formData.nextStatusDate && formData.nextStatusTime) {
            nextStatusDateTime = `${formData.nextStatusDate} ${formData.nextStatusTime}`;
        }

        // Combine date and time for schedule fields if onSchedule is checked
        let smsScheduleDateTime = '';
        let emailScheduleDateTime = '';
        if (formData.onSchedule) {
            if (formData.nextStatusDate && formData.nextStatusTime) {
                smsScheduleDateTime = nextStatusDateTime;
                emailScheduleDateTime = nextStatusDateTime;
            }
        }

        // FupValue is comma-separated: Code,IsCallback,IsConvert
        // Use the FupValue from selectedOption if available, otherwise construct it
        const fupValue = selectedOption?.FupValue || formData.followupType || '';
        
        // FollowUpStatus is the Code (same as ID)
        const followUpStatus = selectedOption?.Code ? parseInt(selectedOption.Code) : (parseInt(formData.followupType) || 0);

        return {
            AssignedTo: parseInt(formData.assignTo) || 0,
            FupValue: fupValue,  // Contains: Code,IsCallback,IsConvert
            FollowUpStatus: followUpStatus,  // The Code (ID) value
            NextStatusDate: nextStatusDateTime,
            Remarks: formData.remarks || '',
            Products: formData.products || '',
            AmountPaid: parseFloat(formData.amountPaid) || 0,
            IsReAssign: formData.reAssign || false,
            NotifyBySMS: formData.onSchedule || false,
            NotifyByEmail: formData.onSchedule || false,
            SmsScheduelDateTime: smsScheduleDateTime,
            EmailScheduelDateTime: emailScheduleDateTime
        };
    };

    // Handle Save button click
    const handleSave = () => {
        const followupData = prepareFollowupData();
        console.log('Saving followup data:', followupData);
        console.log('FupValue format (ID,IsCallback,IsConvert):', followupData.FupValue);
        if (onSave && typeof onSave === 'function') {
            onSave(followupData);
        }
    };

    // Handle Cancel button click
    const handleCancel = () => {
        if (onCancel && typeof onCancel === 'function') {
            onCancel();
        }
    };

    // Reusable Products Input with Autocomplete
    const renderProductsInput = () => (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Products</label>
            <div className="relative">
                <input
                    type="text"
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                    onFocus={() => formData.products && setShowProductSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowProductSuggestions(false), 200)}
                    placeholder="Enter product"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                />
                {showProductSuggestions && productSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {productSuggestions.map((product) => (
                            <div
                                key={product.Id}
                                onClick={() => handleProductSelect(product)}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">{product.Name}</div>
                                {product.Description && (
                                    <div className="text-xs text-gray-500 truncate">{product.Description}</div>
                                )}
                                {product.Sku && (
                                    <div className="text-xs text-gray-400">SKU: {product.Sku}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

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

                        {renderProductsInput()}

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
                                    type="time"
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
                                type="number"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                placeholder="Amount Paid"
                                min="0"
                                step="0.01"
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

                        {renderProductsInput()}

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

                        {renderProductsInput()}

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
						<div>
 		   <button
             onClick={(e) => {  alert('Form data to be saved: ' + JSON.stringify(formData, null, 2));e.stopPropagation(); localStorage.setItem("formDataStorage",formData);    }}
                                 
             className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium`}
             >
             {'Save Follow up'}
         </button>
		</div>
                    </>
                );
        }
    };

     const AddFollowUpForm = () => {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  return
   (
    <a
      
      onClick={() => setOpen(false)}
      className="px-6 py-2 bg-green-600 text-black rounded hover:bg-green-700 transition font-medium"
    >
      Close
    </a>
   );
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
                        <option key={opt.Code} value={opt.Code}>{opt.Text}</option>
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-600 text-gray-600 rounded hover:bg-gray-50 transition font-medium"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

const AddFollowUpForm = ({ onClose }) => {
  return (
    <button
      type='button'
      onClick={onClose}

      className="px-6 py-2 bg-green-600 text-black rounded hover:bg-green-700 transition font-medium"
    >
      Close
    </button>
  );
};

export default AddFollowupForm;
