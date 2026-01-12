import React, { useState, useEffect } from 'react';
import { Wand2 } from 'lucide-react';
import { serviceInstance } from '../../axiosinstance';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { getSession } from '../../getSession';

const SendSMSForm = ({ selectedEnquiry, onFormChange }) => {
  const [activeTab, setActiveTab] = useState('indian');
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [senderId, setSenderId] = useState('');
  const [appType, setAppType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [isUnicode, setIsUnicode] = useState(false);
  const [urlTrack, setUrlTrack] = useState(false);
  const [composeSMS, setComposeSMS] = useState('');
  const [senderIdNonIndian, setSenderIdNonIndian] = useState('');

    
    /*'8990005555', '9876543210', '8765432109'*/
//  const mobileNumbers  
//   [ 
//      selectedNumbers.length > 0 ? selectedNumbers[0] : '',
//      selectedNumbers.length > 1 ? selectedNumbers[1] : '',
//      selectedNumbers.length > 2 ? selectedNumbers[2] : ''
//   ]  

  // const mobileNumbers = selectedNumbers.slice(0, 3);
 
    const fallbackMobileNumbers = ['7266895785', '7530824177', '7317458804'];
    const mobileNumbers = selectedEnquiry && selectedEnquiry.CsvMobileNo
      ? [selectedEnquiry.CsvMobileNo, ...fallbackMobileNumbers].slice(0, 3)
      : fallbackMobileNumbers;
    /*
    const mobileNumbers = [
  ...selectedNumbers.slice(0, 3),
  ...Array(3).fill('')
    ].slice(0, 3);
    */

     console.log("Selected Numbers:", selectedNumbers);


  const [senderList, setSenderList] = useState([]);
  const senderIds = [
    'Abhi01(Transactional : 15007)(Abhishek I)',
    'KITAPP(Promotional : 12345)(Kit19)',
    'SALES(Transactional : 67890)(Sales Team)'
  ];

  // Fetch sender ID list from backend
  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const session = getSession();
        const payload = {
          Token: session.token,
          Details: JSON.stringify({ UserId: session.userId || 0 })
        };

        const resp = await serviceInstance.post(API_ENDPOINTS.ENQUIRIES.GET_SENDER_LIST, payload);
        if (resp?.data?.Status === 1) {
          setSenderList(resp.data.Details || []);
        } else {
          console.warn('GetSenderList failed', resp?.data);
        }
      } catch (err) {
        console.error('Error fetching sender list', err);
      }
    };

    fetchSenders();
  }, []);

  /*
  const formatSenderId = (sender) =>
  `${sender.code}(${sender.type} : ${sender.id})(${sender.owner})`;

  <select value={senderId} onChange={(e) => setSenderId(e.target.value)}>
  <option value="">Select Sender ID</option>
  {senderIds.map((sender, index) => (
    <option key={index} value={sender.code}>
      {formatSenderId(sender)}
    </option>
   ))}
 </select>
 */


  const templates = [
    'Welcome Message',
    'Order Confirmation',
    'Payment Reminder',
    'Follow Up'
  ];

  const handleNumberToggle = (number) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // Auto-select enquiry mobile when a row is selected
  useEffect(() => {
    if (selectedEnquiry && selectedEnquiry.CsvMobileNo) {
      setSelectedNumbers([selectedEnquiry.CsvMobileNo]);
    }
  }, [selectedEnquiry]);

  // Notify parent about form changes
  useEffect(() => {
    if (typeof onFormChange === 'function') {
      onFormChange({
        activeTab,
        selectedNumbers,
        senderId,
        senderIdNonIndian,
        appType,
        selectedTemplate,
        message: activeTab === 'indian' ? message : composeSMS,
        isUnicode,
        urlTrack
      });
    }
  }, [activeTab, selectedNumbers, senderId, senderIdNonIndian, appType, selectedTemplate, message, composeSMS, isUnicode, urlTrack, onFormChange]);

  return (
    <div className="w-full max-h-[600px] overflow-y-auto px-1">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab('indian')}
          className={`px-6 py-2 font-medium text-sm transition-colors ${
            activeTab.toLowerCase() === 'indian'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Indian SMS
        </button>
        <button
          onClick={() => setActiveTab('non-indian')}
          className={`px-6 py-2 font-medium text-sm transition-colors ${
            activeTab.toLowerCase === 'non-indian'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Non-Indian SMS
        </button>
      </div>

      {activeTab.toLowerCase() === 'indian' ? (
        <div className="space-y-4">
          {/* Choose Mobile Numbers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Mobile Numbers</h3>
            <div className="space-y-2">
              {mobileNumbers.map((number, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={mobileNumbers.includes(number) && number !== ''}
                    onChange={() => handleNumberToggle(number)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700-">{number}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Alert Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-teal-700">
              No template has been created for given sender ID. For creation{' '}
              <a href="#" className="text-green-600 font-medium hover:underline">
                Click here !
              </a>
            </p>
          </div>

          {/* Sender ID Dropdown */}
          <div>
            <select
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Sender ID</option>
              {(senderList.length > 0 ? senderList : senderIds).map((s, index) => {
                const value = typeof s === 'string' ? s : (s.SenderId || s.Sender || s.Code || JSON.stringify(s));
                const label = typeof s === 'string' ? s : (s.SenderName || s.SenderId || s.Code || JSON.stringify(s));
                return (
                  <option key={index} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* App Type Dropdown */}
          <div>
            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select App</option>
              <option value="KITAPP">KITAPP</option>
              <option value="SALESAPP">SALESAPP</option>
              <option value="MARKETAPP">MARKETAPP</option>
            </select>
          </div>

          {/* Template Dropdown */}
          <div>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Template</option>
              {templates.map((template, index) => (
                <option key={index} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </div>

          {/* Message Textarea */}
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              rows="5"
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <button className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded">
              <Wand2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* IsUnicode Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isUnicode}
              onChange={(e) => setIsUnicode(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">IsUnicode</span>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Your wallet balance should be at least 1.5 times of the estimated batch cost to perform this action
            </p>
          </div>

          {/* Choose Mobile Numbers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Mobile Numbers</h3>
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
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{number}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Enter SenderId */}
          <div>
            <input
              type="text"
              value={senderIdNonIndian}
              onChange={(e) => setSenderIdNonIndian(e.target.value)}
              placeholder="Enter SenderId"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Compose SMS */}
          <div className="relative">
            <textarea
              value={composeSMS}
              onChange={(e) => setComposeSMS(e.target.value)}
              placeholder="Compose SMS"
              rows="5"
              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <button className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded">
              <Wand2 className="w-5 h-5 text-gray-500" />
            </button>
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {composeSMS.length} / 2000
            </div>
          </div>

          {/* Insert Placeholder Button */}
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
            </svg>
            Click Icon to Insert Placeholder
          </button>

          {/* IsUnicode Display */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">IsUnicode:</span>
            <span>False</span>
          </div>

          {/* UrlTrack Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={urlTrack}
              onChange={(e) => setUrlTrack(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">UrlTrack</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default SendSMSForm;
