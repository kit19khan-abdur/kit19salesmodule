import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SendMailForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    selectedEmails: ['exyzz23@gmail.com'],
    account: '',
    fromEmail: 'abcd@gmail.com',
    toEmail: 'abcd@gmail.com',
    mailType: 'selectTemplate', // 'selectTemplate' or 'composeMail'
    subject: '',
    template: '',
    message: ''
  });

  const availableEmails = [
    'exyzz23@gmail.com',
    'test@gmail.com',
    'user@example.com'
  ];

  const emailOptions = [
    'abcd@gmail.com',
    'xyz@gmail.com',
    'test@example.com'
  ];

  const templateOptions = [
    'Please select mail template',
    'Welcome Email',
    'Follow-up Template',
    'Meeting Reminder',
    'Thank You Email'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailCheckbox = (email) => {
    setFormData(prev => ({
      ...prev,
      selectedEmails: prev.selectedEmails.includes(email)
        ? prev.selectedEmails.filter(e => e !== email)
        : [...prev.selectedEmails, email]
    }));
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[100vh] overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold text-gray-800">Send Mail</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Choose Emails */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Emails
          </label>
          <div className="space-y-2">
            {availableEmails.map((email) => (
              <div key={email} className="flex items-center">
                <input
                  type="checkbox"
                  id={email}
                  checked={formData.selectedEmails.includes(email)}
                  onChange={() => handleEmailCheckbox(email)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor={email} className="ml-2 text-sm text-gray-700 cursor-pointer">
                  {email}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Select Accounts Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
           Select Account <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.account}
            onChange={(e) => handleChange('account', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">--Select Accounts--</option>
            <option value="account1">Account 1</option>
            <option value="account2">Account 2</option>
          </select>
        </div>

        {/* From Email Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Email<span className="text-red-500">*</span>
          </label>
          <select
            value={formData.fromEmail}
            onChange={(e) => handleChange('fromEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            {emailOptions.map((email, index) => (
              <option key={index} value={email}>{email}</option>
            ))}
          </select>
        </div>

        {/* To Email Dropdown */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            To Email<span className="text-red-500">*</span>
          </label>
          <select
            value={formData.toEmail}
            onChange={(e) => handleChange('toEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem',
              paddingRight: '2.5rem'
            }}
          >
            {emailOptions.map((email, index) => (
              <option key={index} value={email}>{email}</option>
            ))}
          </select>
        </div>

        {/* Mail Type Radio Buttons */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="selectTemplate"
              name="mailType"
              value="selectTemplate"
              checked={formData.mailType === 'selectTemplate'}
              onChange={(e) => handleChange('mailType', e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="selectTemplate" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
              Select Template
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="composeMail"
              name="mailType"
              value="composeMail"
              checked={formData.mailType === 'composeMail'}
              onChange={(e) => handleChange('mailType', e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="composeMail" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
              Compose Mail
            </label>
          </div>
        </div>

        {/* Subject Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Conditional: Template Dropdown or Message Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
           {formData.mailType === 'selectTemplate' ? 'Template' : "Compose"}<span className="text-red-500">*</span>
          </label>
          {formData.mailType === 'selectTemplate' ? (
            <select
              value={formData.template}
              onChange={(e) => handleChange('template', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '1.5rem',
                paddingRight: '2.5rem'
              }}
            >
              {templateOptions.map((template, index) => (
                <option key={index} value={template}>{template}</option>
              ))}
            </select>
          ) : (

            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Message"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          )}
        </div>

      </form>
    </div>
  );
};

export default SendMailForm;
