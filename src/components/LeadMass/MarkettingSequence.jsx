import React, { useState } from 'react'

const MarkettingSequence = ({ onClose = () => {}, onSave = (payload) => {}, sequences = [], initial = {}, selectedCount = 0 }) => {
  const [sequenceId, setSequenceId] = useState(initial.sequenceId || '')
  const [schedule, setSchedule] = useState(initial.schedule || false)
  const [scheduleAt, setScheduleAt] = useState(initial.scheduleAt || '')
  const [error, setError] = useState('')

  const seqOptions = sequences.length ? sequences : [{ id: 'tryy1', name: 'tryy1' }]

  const validate = () => {
    setError('')
    if (!sequenceId) { setError('Please select a sequence'); return false }
    if (schedule && !scheduleAt) { setError('Schedule date/time is required when scheduling'); return false }
    return true
  }

  const handleSave = () => {
    if (!validate()) return
    const payload = { sequenceId, schedule, scheduleAt, selectedCount }
    onSave(payload)
  }

  return (
    <div className="w-full max-w-xl">
      <div className="mb-3 text-sm text-blue-800 bg-blue-50 border border-blue-100 p-2 rounded">Info! You are about to perform a mass action on {selectedCount} selected record(s)</div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Sequence <span className="text-red-600">*</span></label>
          <select value={sequenceId} onChange={e => setSequenceId(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">--Select Sequence--</option>
            {seqOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date and Time</label>
          <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className="rounded-[3px] mr-2" />
            On Schedule Date And Time
          </label>

        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        {schedule && (
          <div>
            <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkettingSequence
