import React, { useState } from 'react';
import RichTextEditor from '../common/RichTextEditor';
import { FileText } from 'lucide-react';

const SendMailForm = () => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [fromAccounts, setFromAccounts] = useState(['', '', '']);
  const [mailMode, setMailMode] = useState('template'); // 'template' or 'compose'
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [mailBody, setMailBody] = useState('');

  const availableEmails = [
    'webhui897@gmail.com',
    'contact@example.com',
    'support@company.com'
  ];

  const emailAccounts = [
    'abhshek.kumar@Support.appmails.in.net',
    'sales@company.com',
    'marketing@business.com'
  ];

  const templates = [
    { id: 1, name: 'mailtempbirthday', type: 'Enquiry' },
    { id: 2, name: 'MailTemp123', type: 'Enquiry' },
    { id: 3, name: 'WelcomeTemplate', type: 'Lead' },
    { id: 4, name: 'FollowUpTemplate', type: 'Follow-up' }
  ];

  const handleEmailToggle = (email) => {
    setSelectedEmails(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleAccountChange = (index, value) => {
    const newAccounts = [...fromAccounts];
    newAccounts[index] = value;
    setFromAccounts(newAccounts);
  };

  return (
    <div className="w-full max-h-[600px] overflow-y-auto px-1">
      {/* Choose Emails Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Emails</h3>
        <div className="space-y-2">
          {availableEmails.map((email, index) => (
            <label
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedEmails.includes(email)}
                onChange={() => handleEmailToggle(email)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{email}</span>
            </label>
          ))}
        </div>
      </div>

      {/* From Account Dropdowns */}
      <div className="mb-6 space-y-3">
        {fromAccounts.map((account, index) => (
          <div key={index}>
            <select
              value={account}
              onChange={(e) => handleAccountChange(index, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">--Select Accounts--</option>
              {emailAccounts.map((acc, idx) => (
                <option key={idx} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Mail Mode Selection */}
      <div className="mb-6 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="mailMode"
            value="template"
            checked={mailMode === 'template'}
            onChange={(e) => setMailMode(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Select Template</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="mailMode"
            value="compose"
            checked={mailMode === 'compose'}
            onChange={(e) => setMailMode(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Compose Mail</span>
        </label>
      </div>

      {/* Subject Field */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
            <FileText className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Template Selection or Compose Area */}
      {mailMode === 'template' ? (
        <div className="mb-6">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-h-32"
            size="4"
          >
            <option value="">-- None --</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ( {template.type} )
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-6">
          <RichTextEditor
            value={mailBody}
            onChange={(e) => setMailBody(e.target.value)}
            placeholder="Compose your email here..."
            rows={8}
          />
        </div>
      )}

    </div>
  );
};

export default SendMailForm;
