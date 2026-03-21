import React, { useState, useEffect } from 'react';
import { serviceInstance } from '../../axiosinstance';
import API_ENDPOINTS from '../../config/apiEndpoints';
import { getSession } from '../../getSession';

const SendVoiceForm = ({ selectedEnquiry, onFormChange }) => {
  const [mobileNumbers, setMobileNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [dniNumber, setDniNumber] = useState('');
  const [dniList, setDniList] = useState([]);
  const [appFlow, setAppFlow] = useState('');
  const [appFlowOptions, setAppFlowOptions] = useState([]);
  const [messageType, setMessageType] = useState('promotional');
  const [duration, setDuration] = useState('60');
  const appFlows = [
    'Welcome Flow',
    'Follow Up Flow',
    'Promotional Flow',
    'Transactional Flow'
  ];

  // Fetch DNI list from backend
  useEffect(() => {
    const fetchDni = async () => {
      try {
        const session = getSession();
        const payload = {
          Token: session.token,
          Details: JSON.stringify({ UserId: session.userId || 0 })
        };

        const resp = await serviceInstance.post(API_ENDPOINTS.ENQUIRIES.VOICE_DNI, payload);
        if (resp?.data?.Status === 1) {
          // Expecting array of objects with VoiceID and DniNm
          setDniList(resp.data.Details || []);
        } else {
          console.warn('VoiceDni fetch failed', resp?.data);
        }
      } catch (err) {
        console.error('Error fetching DNI list', err);
      }
    };

    fetchDni();
  }, []);

  // Fetch App Flow list from backend (uses parent ID)
  useEffect(() => {
    const fetchAppFlows = async () => {
      try {
        const session = getSession();
        const payload = {
          Token: session.token,
          Details: JSON.stringify({ strParentID: session.parentId || 0 })
        };

  // Use relative path so dev server proxy (setupProxy.js) forwards to kit19.com and avoids CORS/preflight redirect.
  const endpoint = '/UserCRMCampaign/Service/TriggerCampaign.asmx/FuncToGetList_AppFlow';
  const resp = await serviceInstance.post(endpoint, payload);
        // Normalize a variety of possible response shapes to an array of { AppID, AppName }
        try {
          const data = resp?.data;
          let list = null;

          // Common shapes: { Status:1, Details: [...] }
          if (data?.Status === 1 && Array.isArray(data.Details)) {
            list = data.Details;
          }

          // Some ASMX services return { d: [...] } or { d: '{...}' }
          if (!list && data?.d) {
            if (typeof data.d === 'string') {
              try {
                const parsed = JSON.parse(data.d);
                if (Array.isArray(parsed)) list = parsed;
                else if (parsed?.Details) list = parsed.Details;
              } catch (e) {
                // data.d might be XML string; fall through to XML parsing below
              }
            } else if (Array.isArray(data.d)) { 
              list = data.d;
            }
          }

          // If the endpoint directly returned an array
          if (!list && Array.isArray(data)) {
            list = data;
          }
          

          // If it's a string (likely XML from ASMX), try to parse XML
          if (!list && typeof data === 'string' && data.trim().startsWith('<')) {
            try {
              const parser = new DOMParser();
              const xml = parser.parseFromString(data, 'text/xml');
              const nodes = Array.from(xml.getElementsByTagName('drpAppflow'));
              if (nodes.length > 0) {
                list = nodes.map(node => {
                  const get = (tag) => {
                    const el = node.getElementsByTagName(tag)[0];
                    return el ? (el.textContent || '').trim() : '';
                  };
                  return { AppID: get('AppID'), AppName: get('AppName') };
                });
              }
            } catch (e) {
              // parsing failed
            }
          }

          // Final tolerant fallback: try to extract Details if present
          if (!list && data?.Details && Array.isArray(data.Details)) {
            list = data.Details;
          }

          // Normalize each item to { AppID, AppName }
          const normalized = Array.isArray(list)
            ? list.map(item => ({
                AppID: item?.AppID ?? item?.AppId ?? (item?.AppID !== undefined ? String(item.AppID) : ''),
                AppName: item?.AppName ?? item?.Appname ?? (item?.AppName !== undefined ? String(item.AppName) : '')
              }))
            : [];

          setAppFlowOptions(normalized);
        } catch (err) {
          console.error('Error normalizing AppFlow response', err, resp?.data);
          setAppFlowOptions([]);
        }
      } catch (err) {
        console.error('Error fetching AppFlow list', err);
      }
    };

    fetchAppFlows();
  }, []);

  const handleNumberToggle = (number) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // Build mobileNumbers array from selectedEnquiry when it changes
  useEffect(() => {
    const parseNumbersFromEnquiry = (enq) => {
      if (!enq) return [];
      // Try comma/pipe/semicolon separated CSV first
      const csv = enq.CsvMobileNo || enq.CsvMobile || enq.MobileCSV || enq.MobileNumbers || enq.MobileNos;
      if (csv && typeof csv === 'string') {
        return csv
          .split(/[,|;]+/) // split by comma, pipe or semicolon
          .map(s => s.trim())
          .filter(s => s);
      }

      // Fallback to individual fields
      const candidates = [
        enq.MobileNo,
        enq.MobileNo1,
        enq.MobileNo2,
        enq.Mobile1,
        enq.Mobile2,
        enq.Mobile,
        enq.ContactNo
      ];
      return Array.from(new Set(candidates.filter(Boolean).map(n => String(n).trim())));
    };

    const parsed = parseNumbersFromEnquiry(selectedEnquiry);
    setMobileNumbers(parsed.length ? parsed : []);

    // Auto-select the first number if available and nothing selected yet
    setSelectedNumbers(prev => (prev && prev.length > 0) ? prev : (parsed.length ? [parsed[0]] : []));
  }, [selectedEnquiry]);

  // Notify parent of form changes
  useEffect(() => {
    if (typeof onFormChange === 'function') {
      onFormChange({
        selectedNumbers,
        dniNumber,
        appFlow,
        messageType,
        duration
      });
    }
  }, [selectedNumbers, dniNumber, appFlow, messageType, duration, onFormChange]);

return (
  <div className="w-full max-h-[600px] overflow-y-auto px-1">
    {/* Choose Mobile Numbers */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Choose Mobile Numbers
      </h3>

      <div className="space-y-2">
        {mobileNumbers
          .filter(
            (number) =>
              number !== null &&
              number !== undefined &&
              String(number).trim() !== ""
          )
          .map((number, index) => (
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
          {(dniList.length > 0 ? dniList : []).map((dni, index) => {
            // Prefer VoiceID as the option value and DniNm as the label.
            // Fall back to other fields if those aren't present to remain tolerant to differing response shapes.
            const value = dni?.VoiceID ?? dni?.VoiceId ?? dni?.Dni ?? dni?.DniNm ?? '';
            const label = dni?.DniNm ?? dni?.Dni ?? `${dni?.VoiceID ?? dni?.VoiceId ?? ''}`;
            return (
              <option key={index} value={value}>
                {label}
              </option>
            );
          })}
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
          {(appFlowOptions.length > 0 ? appFlowOptions : []).map((opt, index) => (
            <option key={index} value={opt?.AppID ?? opt?.AppId ?? opt?.AppID?.toString?.() ?? ''}>
              {opt?.AppName ?? opt?.Appname ?? opt?.AppName?.toString?.() ?? ''}
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
};

export default SendVoiceForm;
