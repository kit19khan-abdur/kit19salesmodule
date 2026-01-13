import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getDIDNumbers, getAppNames } from '../../utils/lead';
import { getSession } from '../../getSession';
const SendVoiceForm = forwardRef(({ lead = {} }, ref) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [dniNumber, setDniNumber] = useState('');
  const [appFlow, setAppFlow] = useState('');
  const [messageType, setMessageType] = useState('promotional');
  const [duration, setDuration] = useState('60');

  const fallbackMobileNumbers = ['8990005555', '9876543210', '8765432109'];
  const [mobileNumbers, setMobileNumbers] = useState(fallbackMobileNumbers);
  const fallbackDni = [
    'DNI-001 - Sales Department',
    'DNI-002 - Marketing Team',
    'DNI-003 - Support Center'
  ];
  const [dniNumbers, setDniNumbers] = useState(fallbackDni);
  const fallbackAppFlows = [
    'Welcome Flow',
    'Follow Up Flow',
    'Promotional Flow',
    'Transactional Flow'
  ];
  const [appOptions, setAppOptions] = useState(fallbackAppFlows);

  const handleNumberToggle = (number) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // expose a method for parent to read current form values
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      // map selectedNumbers to MobileNo, MobileNo1, MobileNo2
      const [m0 = '', m1 = '', m2 = ''] = selectedNumbers.concat([ '', '', '' ]);
      return {
        MobileNo: m0 || '',
        MobileNo1: m1 || '',
        MobileNo2: m2 || '',
        Route: '',
        AppFlow: appFlow || '',
        DnidNo: dniNumber || '',
        Duration: duration || '',
        Voice_Source: messageType || '',
        EntityName: lead ? (lead.Type || 'lead') : 'lead',
        EntityId: lead ? (lead.ID || lead.LeadId || lead.Id || lead.id || '') : ''
      };
    }
  }));

  useEffect(() => {
    // update mobileNumbers when lead changes
    const leadNums = [
      lead?.MobileNo,
      lead?.MobileNo1,
      lead?.MobileNo2,
      lead?.CsvMobileNo,
      lead?.Mobile1,
      lead?.Mobile2
    ].filter(Boolean).map(n => String(n).trim());
    const unique = Array.from(new Set(leadNums));
    if (unique.length > 0) setMobileNumbers(unique);

    let mounted = true;
    const fetchDids = async () => {
      try {
        const { TokenId, userId, parentId } = getSession();
        const payload = {
          Token: TokenId,
          Message: "",
          LoggedUserId: userId,
          MAC_Address: "",
          IP_Address: "",
          Details: { ParentId: parentId || 0 },
          BroadcastName: ""
        };
        const resp = await getDIDNumbers(payload);
        let data = resp?.Details ?? resp?.d ?? resp ?? [];
        if (data && typeof data === 'string') {
          try { data = JSON.parse(data); } catch(e) { /* ignore */ }
        }
        if (data && data.data) data = data.data;

        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => {
            if (typeof item === 'string') return item;
            // common server shapes: { Code, Text } or { DIDNumber, Name } etc.
            const code = item.Code || item.DID || item.DIDNumber || item.CodeNo || item.CodeName || '';
            const text = item.Text || item.Name || item.Value || item.DisplayName || '';
            const label = (code && text) ? `${code} - ${text}` : (text || code || JSON.stringify(item));
            return label;
          });
          if (mounted) setDniNumbers(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch DID numbers, using fallback:', error);
      }
    };
    fetchDids();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchApps = async () => {
      try {
        const { TokenId, userId, parentId } = getSession();
        const payload = {
          Token: TokenId,
          Message: "",
          LoggedUserId: userId,
          MAC_Address: "",
          IP_Address: "",
          Details: { ParentId: parentId || 0 },
          BroadcastName: ""
        };
        const resp = await getAppNames(payload);
        let data = resp?.Details ?? resp?.d ?? resp ?? [];
        if (data && typeof data === 'string') {
          try { data = JSON.parse(data); } catch(e) { /* ignore */ }
        }
        if (data && data.data) data = data.data;

        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => {
            if (typeof item === 'string') return item;
            // server shapes: { Code, Text } or { AppId, Name }
            const code = item.Code || item.AppId || item.Id || item.CodeNo || '';
            const text = item.Text || item.Name || item.AppName || item.Value || item.DisplayName || '';
            const label = (code && text) ? `${text}` : (text || code || JSON.stringify(item));
            return label;
          });
          if (mounted) setAppOptions(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch App Names, using fallback:', error);
      }
    };
    fetchApps();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full max-h-[600px] overflow-y-auto px-1">
      {/* Choose Mobile Numbers */}
      <div className="mb-6">
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

      {/* DNI Number Dropdown */}
      <div className="mb-6">
        <select
          value={dniNumber}
          onChange={(e) => setDniNumber(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Please select DNI number</option>
          {dniNumbers.map((dni, index) => (
            <option key={index} value={dni}>
              {dni}
            </option>
          ))}
        </select>
      </div>

      {/* App Flow Dropdown */}
      <div className="mb-6">
        <select
          value={appFlow}
          onChange={(e) => setAppFlow(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Please select App flow</option>
          {appOptions.map((flow, index) => (
            <option key={index} value={flow}>
              {flow}
            </option>
          ))}
        </select>
      </div>

      {/* Message Type Radio Buttons */}
      <div className="mb-6 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="messageType"
            value="promotional"
            checked={messageType === 'promotional'}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Promotional</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="messageType"
            value="transactional"
            checked={messageType === 'transactional'}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Transactional</span>
        </label>
      </div>

      {/* Duration Input */}
      <div className="mb-4">
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (Default 60 seconds)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
});

export default SendVoiceForm;
