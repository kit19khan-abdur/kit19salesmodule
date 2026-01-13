import React, { useState } from 'react'

const AddRemoveTag = ({ onClose = () => {}, onSave = (payload) => {}, tags = [], initial = {}, mode = 'add', selectedCount = 0 }) => {
  const [tagId, setTagId] = useState(initial.tagId || '')
  const [schedule, setSchedule] = useState(initial.schedule || false)
  const [scheduleAt, setScheduleAt] = useState(initial.scheduleAt || '')
  const [error, setError] = useState('')

  const tagOptions = tags.length ? tags : [{ id: 'hgfh', name: 'hgfh' }]

  const validate = () => {
    setError('')
    if (!tagId) { setError('Please select a tag'); return false }
    if (schedule && !scheduleAt) { setError('Schedule date/time required when scheduling'); return false }
    return true
  }

  const handleSave = () => {
    if (!validate()) return
    const payload = { tagId, mode, schedule, scheduleAt, selectedCount }
    onSave(payload)
  }

  const title = mode === 'remove' ? 'Remove Tag To Mass' : 'Add Tag To Mass'

  return (
    <div className="w-full max-w-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{title}</label>
          <select value={tagId} onChange={e => setTagId(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">--Select Tag--</option>
            {tagOptions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {schedule && (<div>
          <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>)}

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className=" rounded-[3px] mr-2" />
            On Schedule Date And Time
          </label>

        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  )
}

export default AddRemoveTag
