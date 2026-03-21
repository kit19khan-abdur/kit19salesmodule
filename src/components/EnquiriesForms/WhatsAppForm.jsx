import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { serviceInstance } from '../../axiosinstance';
import { getSession } from '../../getSession';

const WhatsAppForm = () => {
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [message, setMessage] = useState('');

    const mobileNumbers = ['8990005555', '9876543210', '8765432109'];

    const templates = [
        { id: 1, name: 'Welcome Message', type: 'Enquiry' },
        { id: 2, name: 'Follow Up', type: 'Enquiry' },
        { id: 3, name: 'Product Information', type: 'Lead' },
        { id: 4, name: 'Appointment Reminder', type: 'Follow-up' }
    ];

    // API / sending state
    const [apiKey, setApiKey] = useState('your_api_key');
    const [username, setUsername] = useState('your_username');
    const [remarks, setRemarks] = useState('optional_remarks');
    const [broadcastId, setBroadcastId] = useState('');
    const [batchId, setBatchId] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [resultMessage, setResultMessage] = useState(null);

    // Fetch active API key from backend on mount and bind to apiKey input
    useEffect(() => {
        const fetchActiveApiKey = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    Details: JSON.stringify({ UserId: session.userId || 0 })
                };

                const resp = await serviceInstance.post('/IMSMOB/GetActiveApiKey', payload);
                const data = resp?.data;
                if (data?.Status === 1) {
                    let details = data.Details;
                    // Details may be a JSON string sometimes
                    if (typeof details === 'string') {
                        try { details = JSON.parse(details); } catch (e) { /* ignore */ }
                    }

                    // Details could be an array of ActiveApi or single object
                    const active = Array.isArray(details) ? details[0] : details;
                    const keyVal = active?.ApiKey ?? active?.Value ?? null;
                    if (keyVal) setApiKey(keyVal);
                } else {
                    console.warn('GetActiveApiKey failed', data);
                }
            } catch (err) {
                console.error('Error fetching active API key', err);
            }
        };

        fetchActiveApiKey();
    }, []);

    // Fetch user login/username and bind to username input
    useEffect(() => {
        const fetchUserLogin = async () => {
            try {
                const session = getSession();
                const payload = {
                    Token: session.token,
                    Details: JSON.stringify(session.userId || 0)
                };

                const resp = await serviceInstance.post('/Admin/GetUserLoginDetails', payload);
                const data = resp?.data;
                if (data?.Status === 1) {
                    let details = data.Details;
                    if (typeof details === 'string') {
                        // response might directly be the login name string
                        setUsername(details);
                    } else if (details) {
                        // try several common property names
                        const possible = details.User_Login || details.UserLogin || details.LoginName || details.UserName || details.User || details.Username;
                        if (typeof possible === 'string' && possible.trim()) setUsername(possible);
                        else if (typeof details === 'string') setUsername(details);
                        else {
                            // last resort: stringify object
                            setUsername(JSON.stringify(details));
                        }
                    }
                } else {
                    console.warn('GetUserLoginDetails failed', data);
                }
            } catch (err) {
                console.error('Error fetching user login details', err);
            }
        };

        fetchUserLogin();
    }, []);

    const handleNumberToggle = (number) => {
        setSelectedNumbers(prev =>
            prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number]
        );
    };

    const handleSelectAll = () => {
        if (selectedNumbers.length === mobileNumbers.length) {
            setSelectedNumbers([]);
        } else {
            setSelectedNumbers([...mobileNumbers]);
        }
    };

    const buildTemplatePayload = (toNumber) => {
        // Build a simple template payload using the selected template and message variables.
        // This follows the structure provided by the user in the prompt.
        return {
            key: apiKey,
            name: 'whatsapp',
            username: username,
            remarks: remarks,
            BroadcastId: broadcastId || undefined,
            BatchId: batchId || undefined,
            whatsapp: {
                to: toNumber.startsWith('+') ? toNumber : `+${toNumber}`,
                type: 'template',
                template: {
                    name: selectedTemplate || 'hello_world',
                    language: {
                        code: 'en',
                        policy: 'deterministic'
                    },
                    namespace: 'template_namespace',
                    body: {
                        parameters: message
                            ? message.split('|').map((txt) => ({ type: 'text', text: txt }))
                            : [
                                { type: 'text', text: 'parameter_value_1' },
                                { type: 'text', text: 'parameter_value_2' }
                              ]
                    }
                }
            }
        };
    };

    const sendWhatsApp = async () => {
        if (selectedNumbers.length === 0) {
            setResultMessage({ type: 'error', text: 'Please select at least one mobile number.' });
            return;
        }

        setIsSending(true);
        setResultMessage(null);

        try {
            // const baseUrl = 'http://localhost:62194/IMS/Whatsapp/Template';
          const baseUrl = 'https://services.kit19.com/IMS/Whatsapp/Template';
            const requests = selectedNumbers.map((num) => {
                const payload = buildTemplatePayload(num);

                return fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(async (res) => {
                    const json = await res.json().catch(() => null);
                    return { ok: res.ok, status: res.status, json };
                });
            });

            const results = await Promise.all(requests);

            // Determine overall success: all responses returned success true in meta or http ok
            const failures = results.filter(r => !(r.ok || (r.json && r.json.meta && r.json.meta.success)));

            if (failures.length === 0) {
                setResultMessage({ type: 'success', text: 'Message(s) sent successfully.' });
            } else {
                setResultMessage({ type: 'error', text: `Failed to send to ${failures.length} number(s).` });
            }
        } catch (err) {
            console.error('sendWhatsApp error', err);
            setResultMessage({ type: 'error', text: 'An error occurred while sending messages.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full max-h-[600px] overflow-y-auto px-1">
            {/* Choose Mobile Numbers */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Choose Mobile Numbers</h3>
                    <button
                        onClick={handleSelectAll}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {selectedNumbers.length === mobileNumbers.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>
                <div className="space-y-2">
                    {mobileNumbers.map((number, index) => (
                        <label
                            key={index}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedNumbers.includes(number)}
                                onChange={() => handleNumberToggle(number)}
                                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{number}</span>
                        </label>
                    ))}
                </div>
                {selectedNumbers.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                        {selectedNumbers.length} number{selectedNumbers.length > 1 ? 's' : ''} selected
                    </p>
                )}
            </div>

            {/* Template Selection */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Template
                </label>
                <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                    <option value="">--Select Template--</option>
                    {templates.map((template) => (
                        <option key={template.id} value={template.name}>
                            {template.name} ({template.type})
                        </option>
                    ))}
                </select>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Template Preview
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-700">
                            Hello! This is a preview of the <strong>{selectedTemplate}</strong> template.
                            Your personalized message will appear here.
                        </p>
                    </div>
                </div>
            )}

            {/* Message Variables */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Available Variables
                </label>
                <div className="flex flex-wrap gap-2">
                    {['{{Name}}', '{{Phone}}', '{{Email}}', '{{Company}}'].map((variable) => (
                        <button
                            key={variable}
                            onClick={() => setMessage(message + variable)}
                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition"
                        >
                            {variable}
                        </button>
                    ))}
                </div>
            </div>
            {/* Message input & API settings */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Parameters</label>
                <input
                    type="text"
                    placeholder="Enter parameters separated by | e.g. John|Order123"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3">
                <label className="block text-sm font-semibold text-gray-700">API Settings</label>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="API Key"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                />
                <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Remarks (optional)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="text"
                        value={broadcastId}
                        onChange={(e) => setBroadcastId(e.target.value)}
                        placeholder="BroadcastId (optional)"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                    />
                    <input
                        type="text"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        placeholder="BatchId (optional)"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={sendWhatsApp}
                    disabled={isSending}
                    className={`px-4 py-2 text-sm font-medium text-white rounded ${isSending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isSending ? 'Sending...' : 'Send WhatsApp'}
                </button>
                {resultMessage && (
                    <div className={`text-sm ${resultMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {resultMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatsAppForm;
