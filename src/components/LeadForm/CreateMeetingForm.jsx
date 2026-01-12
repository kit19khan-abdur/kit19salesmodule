import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const CreateMeetingForm = () => {
  const [meetingTemplate, setMeetingTemplate] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [timezone, setTimezone] = useState('GMT +5:30');
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState('');
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState('Days');
  const [repeatEndsType, setRepeatEndsType] = useState('onDate'); // 'onDate' or 'after'
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [repeatAfterCount, setRepeatAfterCount] = useState(1);
  const [host, setHost] = useState('Abhi01');
  const [addCoHost, setAddCoHost] = useState(false);
  const [coHostQuery, setCoHostQuery] = useState('');
  const [coHosts, setCoHosts] = useState([]);
  const [showCoHostSuggestions, setShowCoHostSuggestions] = useState(false);
  const [participants, setParticipants] = useState('');

  const templates = [
    'Sales Meeting Template',
    'Follow-up Meeting Template',
    'Demo Meeting Template',
    'Client Meeting Template'
  ];

  const hosts = [
    'Abhi01',
    'Sales Team',
    'Marketing Team',
    'Support Team'
  ];

  // Sample users for co-host suggestions (id-name format used in UI)
  const users = [
    '34594-Mohit.cheema',
    '34594-Manish.Singh',
    '34594-Rachit.Kumar',
    '34594-Perumal.R',
    '34594-kmukesh343'
  ];

  const timezones = [
    '( GMT +5:30 ) India Standard Time (Asia/Kolkata)',
    '( GMT +0:00 ) UTC',
    '( GMT -5:00 ) Eastern Time (US & Canada)',
    '( GMT +8:00 ) Singapore Time'
  ];

  return (
    <div className="w-full max-h-[600px] overflow-y-auto px-1">
      {/* Meeting Template */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Template</label>
        <select
          value={meetingTemplate}
          onChange={(e) => setMeetingTemplate(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Meeting Settings</option>
          {templates.map((template, index) => (
            <option key={index} value={template}>
              {template}
            </option>
          ))}
        </select>
      </div>

      {/* Meeting Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Name</label>
        <input
          type="text"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          placeholder="Enter Meeting Name"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Meeting starts on */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meeting starts on (local time)
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Meeting Ends on */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Meeting Ends on (local time)
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Timezone */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {timezones.map((tz, index) => (
            <option key={index} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Recurring Meeting */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700">Recurring Meeting</span>
        </label>
      </div>

      {/* Recurring options (visible only when recurring is checked) */}
      {isRecurring && (
        <div className="mb-4 border rounded p-3">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat type</label>
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Repeat Type</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat every</label>
            <div className="flex items-center gap-3">
              <select
                value={repeatEvery}
                onChange={(e) => setRepeatEvery(parseInt(e.target.value, 10))}
                className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <select
                value={repeatUnit}
                onChange={(e) => setRepeatUnit(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                <option>Days</option>
                <option>Weeks</option>
                <option>Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ends</label>
            <div className="flex items-center gap-3 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeatEnds"
                  checked={repeatEndsType === 'onDate'}
                  onChange={() => setRepeatEndsType('onDate')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">On Select date</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="repeatEnds"
                  checked={repeatEndsType === 'after'}
                  onChange={() => setRepeatEndsType('after')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">After</span>
              </label>
            </div>

            {repeatEndsType === 'onDate' ? (
              <div className="w-full">
                <input
                  type="date"
                  value={repeatEndDate}
                  onChange={(e) => setRepeatEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <select
                  value={repeatAfterCount}
                  onChange={(e) => setRepeatAfterCount(parseInt(e.target.value, 10))}
                  className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">Times</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Host */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Host</label>
        <select
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {hosts.map((h, index) => (
            <option key={index} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>

      {/* Add Co-Host */}
      <div className="mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={addCoHost}
            onChange={(e) => setAddCoHost(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700">Add Co-Host</span>
        </label>
      </div>

      {/* Co-Host selector (shows only when checkbox checked) */}
      {addCoHost && (
        <div className="mb-4 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Co-Host(s)</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {coHosts.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full text-sm">
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => setCoHosts(prev => prev.filter(item => item !== c))}
                  className="text-gray-500 hover:text-red-600"
                  title="Remove co-host"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={coHostQuery}
            onChange={(e) => { setCoHostQuery(e.target.value); setShowCoHostSuggestions(true); }}
            onFocus={() => setShowCoHostSuggestions(true)}
            onBlur={() => setTimeout(() => setShowCoHostSuggestions(false), 150)}
            placeholder="Search co-host by id or name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {showCoHostSuggestions && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-auto">
              {users
                .filter(u => u.toLowerCase().includes(coHostQuery.toLowerCase()) && !coHosts.includes(u))
                .map((u, i) => (
                  <div
                    key={i}
                    onMouseDown={(ev) => {
                      // use onMouseDown to avoid losing focus before click
                      ev.preventDefault();
                      setCoHosts(prev => [...prev, u]);
                      setCoHostQuery('');
                      setShowCoHostSuggestions(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {u}
                  </div>
                ))
              }
              {users.filter(u => u.toLowerCase().includes(coHostQuery.toLowerCase()) && !coHosts.includes(u)).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Participant(s) */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Participant(s)</label>
        <input
          type="text"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          placeholder="Search by name, email number"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default CreateMeetingForm;
