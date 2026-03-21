import React, { useState, useRef, useEffect } from 'react';
import RichTextEditor from '../../../components/common/RichTextEditor';
import { Grid3x3, Calendar } from 'lucide-react';
import { RxDropdownMenu } from "react-icons/rx";
import RichTextEditorArea from '../../../components/common/RichTextEditorArea';
import { serviceInstance } from '../../../axiosinstance';
import { getSession } from '../../../getSession';

const SendMassMailForm = ({ selectedCount = 0, selectedEnquiryIds = [], onSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        email1: true,
        email2: false,
        email3: false,
        sender: 'Abhi01(Transactional : 6610)(Abhishek Kumar)',
        fromEmail: '',
        replyToEmail: '',
        mailMode: 'template', // 'template' or 'compose'
        subject: '',
        template: '',
        composeContent: '',
        onSchedule: false,
        scheduledDateTime: ''
    });

    const [showPlaceholderDropdown, setShowPlaceholderDropdown] = useState(false);
    const placeholderDropdownRef = useRef(null);
    const pickerRef = useRef(null);
    const [fromMailList, setFromMailList] = useState([{ Code: '', Text: 'Select From Email' }]);
    const [mailTemplates, setMailTemplates] = useState([]);
    const [showTemplatePreview, setShowTemplatePreview] = useState(false);
    const [selectedTemplatePreview, setSelectedTemplatePreview] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const placeholders = [
        { label: 'Person Name', value: 'PersonName' },
        { label: 'Company Name', value: 'CompanyName' },
        { label: 'Email', value: 'Email' },
        { label: 'Mobile Number', value: 'MobileNo' },
        { label: 'City', value: 'City' },
        { label: 'State', value: 'State' },
        { label: 'Country', value: 'Country' },
        { label: 'Source', value: 'Source' },
        { label: 'Enquiry ID', value: 'EnquiryID' },
        { label: 'Created Date', value: 'CreatedDate' },
    ];

    // Fetch from email list
    useEffect(() => {
        const fetchFromEmails = async () => {
            try {
                const session = getSession();
                const requestData = {
                    Token: session.token,
                    Details: JSON.stringify({
                        UserId: session.userId
                    })
                };

                const response = await serviceInstance.post('/Common/GetFromMailIdByUserId', requestData);
                
                // Handle different response wrappers (.data, .d, or direct array)
                let fromEmails = response?.data?.Details || response?.data?.d || response?.data || [];
                
                // Ensure it's an array
                if (!Array.isArray(fromEmails)) {
                    fromEmails = [];
                }

                // Add default option at the beginning
                const emailOptions = [{ Code: '', Text: 'Select From Email' }, ...fromEmails];
                setFromMailList(emailOptions);

                // Auto-select first email if available
                if (fromEmails.length > 0 && !formData.fromEmail) {
                    setFormData(prev => ({
                        ...prev,
                        fromEmail: fromEmails[0].Code,
                        replyToEmail: fromEmails[0].Code
                    }));
                }
            } catch (error) {
                console.error('Error fetching from emails:', error);
            }
        };

        fetchFromEmails();
    }, []);

    // Fetch mail templates
    useEffect(() => {
        const fetchMailTemplates = async () => {
            try {
                const session = getSession();
                const requestData = {
                    Token: session.token,
                    Details: JSON.stringify({
                        ParentID: session.parentId,
                        isSMS: "false",
                        isMail: "true"
                    })
                };

                const response = await serviceInstance.post('/UserCRM/GetEnquiryMailTemplate', requestData);
                
                // Handle different response wrappers
                let templates = response?.data?.Details || response?.data?.d || response?.data || [];
                
                // Ensure it's an array
                if (!Array.isArray(templates)) {
                    templates = [];
                }

                // Add default option at the beginning
                const templateOptions = [
                    { MailTemplateId: 0, MailTemplateName: '-- None --', MailTemplateContent: '', MailTemplateURL: '', DLT_TemplateID: 0 },
                    ...templates
                ];
                setMailTemplates(templateOptions);
            } catch (error) {
                console.error('Error fetching mail templates:', error);
            }
        };

        fetchMailTemplates();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (placeholderDropdownRef.current && !placeholderDropdownRef.current.contains(event.target)) {
                setShowPlaceholderDropdown(false);
            }
        };

        if (showPlaceholderDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showPlaceholderDropdown]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleModeChange = (mode) => {
        setFormData(prev => ({
            ...prev,
            mailMode: mode
        }));
    };

    const handlePlaceholderSelect = (placeholder) => {
        setFormData(prev => ({
            ...prev,
            subject: prev.subject + `#${placeholder}#`
        }));
        setShowPlaceholderDropdown(false);
    };

    // Format datetime-local value (yyyy-MM-ddTHH:mm) to dd-MMM-yyyy hh:MM:ss
    const formatScheduledDate = (datetimeLocal) => {
        if (!datetimeLocal) return '';
        try {
            // datetimeLocal is like '2026-01-18T14:30' (no seconds)
            const [datePart, timePart] = datetimeLocal.split('T');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hour, minute] = (timePart || '').split(':').map(Number);
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const dd = String(day).padStart(2, '0');
            const MMM = months[(month || 1) - 1] || '';
            const yyyy = String(year);
            const hh = String(hour).padStart(2, '0');
            const MM = String(minute).padStart(2, '0');
            const ss = '00';
            return `${dd}-${MMM}-${yyyy} ${hh}:${MM}:${ss}`;
        } catch (e) {
            return '';
        }
    };

    // return current local datetime in 'yyyy-MM-ddTHH:mm' format for datetime-local inputs
    const getLocalDateTimeLocal = () => {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const HH = pad(d.getHours());
        const MIN = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${HH}:${MIN}`;
    };

    // Parse formatted 'dd-MMM-yyyy hh:MM:ss' into datetime-local 'yyyy-MM-ddTHH:mm'
    const parseFormattedToLocal = (formatted) => {
        if (!formatted) return '';
        try {
            // expected format: 18-Jan-2026 14:30:00
            const [datePart, timePart] = formatted.split(' ');
            if (!datePart || !timePart) return '';
            const [dd, MMM, yyyy] = datePart.split('-');
            const [hh, MM, ss] = timePart.split(':');
            const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
            const mm = months[MMM] || '01';
            const day = String(dd).padStart(2, '0');
            const hour = String(hh).padStart(2, '0');
            const minute = String(MM).padStart(2, '0');
            return `${yyyy}-${mm}-${day}T${hour}:${minute}`;
        } catch (e) {
            return '';
        }
    };

    const handlePickerChange = (e) => {
        const val = e.target.value; // datetime-local value
        if (!val) return;
        const formatted = formatScheduledDate(val);
        setFormData(prev => ({ ...prev, scheduledDateTime: formatted }));
    };

    // When scheduling is enabled and no datetime is set, default to current local datetime (formatted)
    useEffect(() => {
        if (formData.onSchedule && !formData.scheduledDateTime) {
            const formattedNow = formatScheduledDate(getLocalDateTimeLocal());
            setFormData(prev => ({ ...prev, scheduledDateTime: formattedNow }));
        }
    }, [formData.onSchedule]);

    const handleViewTemplate = (e) => {
        e.preventDefault();
        if (formData.template) {
            const template = mailTemplates.find(t => t.MailTemplateId === parseInt(formData.template));
            if (template) {
                setSelectedTemplatePreview(template);
                setShowTemplatePreview(true);
            }
        } else {
            alert('Please select a template first');
        }
    };

    const closeTemplatePreview = () => {
        setShowTemplatePreview(false);
        setSelectedTemplatePreview(null);
    };

    const handleSendEmail = async () => {
        // Validation
        if (!formData.fromEmail) {
            alert('Please select a From Email');
            return;
        }

        if (!formData.replyToEmail) {
            alert('Please select a Reply To Email');
            return;
        }

        if (!formData.subject) {
            alert('Please enter an email subject');
            return;
        }

        if (formData.mailMode === 'template' && !formData.template) {
            alert('Please select a template');
            return;
        }

        if (formData.mailMode === 'compose' && !formData.composeContent) {
            alert('Please enter email content');
            return;
        }

        if (!selectedEnquiryIds || selectedEnquiryIds.length === 0) {
            alert('No enquiries selected to send email');
            return;
        }

        try {
            setIsSending(true);
            const session = getSession();

            // Prepare the email message content
            let emailMessage = '';
            if (formData.mailMode === 'template') {
                const selectedTemplate = mailTemplates.find(t => t.MailTemplateId === parseInt(formData.template));
                emailMessage = selectedTemplate ? selectedTemplate.MailTemplateContent : '';
            } else {
                emailMessage = formData.composeContent;
            }

            // Extract AccountId from sender or fromEmail (use the Code value)
            const accountId = formData.fromEmail || 0;

            // scheduledDateTime is stored in formatted 'dd-MMM-yyyy hh:MM:ss' string
            const scheduleValue = formData.onSchedule && formData.scheduledDateTime ? formData.scheduledDateTime : '';

            formData.EntityType='Enquiry';
            formData.userId=session.userId;
            formData.BatchId=0;
            formData.Account = session.parentId;

            const requestData = {
                Token: session.token,
                Details: JSON.stringify({
                IDS: selectedEnquiryIds.join(','),
                    Account: parseInt(formData.Account) || 0,
                    Subject: formData.subject,
                    Message: formData.mailMode === 'template' ? '' : emailMessage,
                    SenderName: formData.sender,
                    ReplyTo: formData.replyToEmail,
                    Email: formData.email1,
                    Email1: formData.email2,
                    Email2: formData.email3,
                    Template: formData.mailMode === 'template' ? parseInt(formData.template) || 0 : 0,
                    ScheduleDateTime: scheduleValue,
                    EntityType:formData.EntityType,
                    UserId:formData.userId,
                    BatchId:formData.BatchId,
                    FromMailID:formData.fromEmail
            })
            };

           // const response = await serviceInstance.post('/UserCRM/SendEmailFromEnquiry', requestData);
           const response = await serviceInstance.post('http://localhost:62194/UserCRM/SendMassBatchEmail', requestData);
            if (response?.data?.Status === 1) {
                alert('Email sent successfully!');
                if (onSuccess) onSuccess();
                if (onClose) onClose();
            } else if (response?.data?.Status === -1) {
                alert('Invalid token. Please login again.');
            } else {
                alert(response?.data?.Details || 'Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('An error occurred while sending email. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            {/* Sender Dropdown */}
            <div className="mb-4">
                <select
                    name="sender"
                    value={formData.sender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option>Abhi01(Transactional : 6610)(Abhishek Kumar)</option>
                </select>
            </div>

            {/* From Email Dropdown */}
            <div className="mb-4">
                <select
                    name="fromEmail"
                    value={formData.fromEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    {fromMailList.map((mail) => (
                        <option key={mail.Code} value={mail.Code}>
                            {mail.Text}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reply To Email Dropdown */}
            <div className="mb-6">
                <select
                    name="replyToEmail"
                    value={formData.replyToEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    {fromMailList.map((mail) => (
                        <option key={mail.Code} value={mail.Code}>
                            {mail.Text}
                        </option>
                    ))}
                </select>
            </div>

            {/* Radio Buttons - Select Template / Compose Mail */}
            <div className="mb-6 flex items-center justify-center gap-16 py-4">
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="radio"
                            name="mailMode"
                            checked={formData.mailMode === 'template'}
                            onChange={() => handleModeChange('template')}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        Select Template
                    </span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="radio"
                            name="mailMode"
                            checked={formData.mailMode === 'compose'}
                            onChange={() => handleModeChange('compose')}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                        Compose Mail
                    </span>
                </label>
            </div>

            {/* Subject Field */}
            <div className="mb-4">
                <div className="flex items-center relative" ref={placeholderDropdownRef}>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPlaceholderDropdown(!showPlaceholderDropdown)}
                        className="p-2.5 rounded-r rounded-l-none border border-gray-300 rounded hover:bg-gray-50 transition"
                        title="Insert Template Variables"
                    >
                        <RxDropdownMenu className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Placeholder Dropdown */}
                    {showPlaceholderDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                            <div className="py-1">
                                {placeholders.map((placeholder, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handlePlaceholderSelect(placeholder.value)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-between"
                                    >
                                        <span>{placeholder.label}</span>
                                        <span className="text-xs text-gray-500 font-mono">{placeholder.value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Conditional Rendering based on mailMode */}
            {formData.mailMode === 'template' ? (
                /* Template Selection */
                <div className="mb-4">
                    <div className="mb-2">
                        <span className="text-sm text-gray-700">or Select Template : </span>
                        <a 
                            href="#" 
                            onClick={handleViewTemplate}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Click To View
                        </a>
                    </div>
                    <select
                        name="template"
                        value={formData.template}
                        onChange={handleChange}
                        size={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        {mailTemplates.map((template) => (
                            <option key={template.MailTemplateId} value={template.MailTemplateId}>
                                {template.MailTemplateName}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                /* Compose Mail Textarea */
                <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">Compose Your Message:</label>
                    <RichTextEditor
                        className="w-full border border-gray-300 rounded-[10px] focus:outline-none resize-none"
                        name="composeContent"
                        value={formData.composeContent}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        rows="8"
                    />
                </div>
            )}

            {/* On Schedule Date And Time */}
            <div className="mt-6">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="onSchedule"
                        checked={formData.onSchedule}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">On Schedule Date And Time</label>
                </div>

                {formData.onSchedule && (
                    <div className="mt-3">
                        <label className="block text-sm text-gray-700 mb-1">Schedule Date & Time (dd-MMM-yyyy hh:MM:ss)</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="scheduledDateTime"
                                value={formData.scheduledDateTime}
                                onChange={handleChange}
                                onClick={() => {
                                    // Open native picker when the textbox is clicked (also works via the icon)
                                    if (pickerRef.current) {
                                        if (typeof pickerRef.current.showPicker === 'function') {
                                            pickerRef.current.showPicker();
                                        } else {
                                            pickerRef.current.click();
                                        }
                                    }
                                }}
                                placeholder="18-Jan-2026 14:30:00"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />

                            {/* Inline calendar icon inside the input (absolute) */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (pickerRef.current) {
                                        if (typeof pickerRef.current.showPicker === 'function') {
                                            pickerRef.current.showPicker();
                                        } else {
                                            pickerRef.current.click();
                                        }
                                    }
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white rounded"
                                title="Pick date & time"
                            >
                                <Calendar className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Hidden native picker wired to pickerRef - keeps seconds as 00 */}
                            <input
                                type="datetime-local"
                                ref={pickerRef}
                                onChange={handlePickerChange}
                                value={parseFormattedToLocal(formData.scheduledDateTime)}
                                min={getLocalDateTimeLocal()}
                                className="sr-only"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter scheduled date/time in format dd-MMM-yyyy hh:MM:ss or use the calendar</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSending}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSending ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        'Send Email'
                    )}
                </button>
            </div>

            {/* Template Preview Modal */}
            {showTemplatePreview && selectedTemplatePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Template Preview: {selectedTemplatePreview.MailTemplateName}
                            </h3>
                            <button
                                onClick={closeTemplatePreview}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Template Details:</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Template ID:</span>
                                        <span className="ml-2 text-gray-800">{selectedTemplatePreview.MailTemplateId}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">DLT Template ID:</span>
                                        <span className="ml-2 text-gray-800">{selectedTemplatePreview.DLT_TemplateID}</span>
                                    </div>
                                    {selectedTemplatePreview.MailTemplateURL && (
                                        <div>
                                            <span className="font-medium text-gray-600">Template URL:</span>
                                            <a 
                                                href={selectedTemplatePreview.MailTemplateURL} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="ml-2 text-blue-600 hover:underline"
                                            >
                                                {selectedTemplatePreview.MailTemplateURL}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Template Content:</h4>
                                <div 
                                    className="border border-gray-300 rounded p-4 bg-gray-50 text-sm"
                                    dangerouslySetInnerHTML={{ __html: selectedTemplatePreview.MailTemplateContent }}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={closeTemplatePreview}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendMassMailForm;
