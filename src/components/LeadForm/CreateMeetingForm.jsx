import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const CreateMeetingForm = () => {
  const [meetingTemplate, setMeetingTemplate] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [timezone, setTimezone] = useState('GMT +5:30');
  const [isRecurring, setIsRecurring] = useState(false);
  const [host, setHost] = useState('Abhi01');
  const [addCoHost, setAddCoHost] = useState(false);
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
