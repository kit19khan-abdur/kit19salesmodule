import React, { useState } from 'react'

const AddCallList = ({ onClose = () => {}, onSave = (payload) => {}, callTypes = [], initial = {}, selectedCount = 0 }) => {
  const [callType, setCallType] = useState(initial.callType || '')
  const [scheduleMode, setScheduleMode] = useState(initial.scheduleMode || 'next_followup')
  const [specificAt, setSpecificAt] = useState(initial.specificAt || '')
  const [anyDay, setAnyDay] = useState(initial.anyDay || '')
  const [error, setError] = useState('')

  const types = callTypes.length ? callTypes : [
    { id: '', name: '---Select Call Type---' }
  ]

  const validate = () => {
    setError('')
    if (!callType) { setError('Please select call type'); return false }
    if (scheduleMode === 'specific' && !specificAt) { setError('Choose specific time'); return false }
    if (scheduleMode === 'anyday' && !anyDay) { setError('Choose date for "Any time on this day"'); return false }
    return true
  }

  const handleAdd = () => {
    if (!validate()) return
    const payload = { callType, scheduleMode, specificAt, anyDay, selectedCount }
    onSave(payload)
  }

  return (
    <div className="w-full max-w-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Call List <span className='text-[#f00]'>*</span></label>
          <select value={callType} onChange={e => setCallType(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">---Select Call Type---</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">Schedule Time <span className='text-[#f00]'>*</span></div>
          <div className="space-y-3">
            <label className="inline-flex items-center w-full">
              <input type="radio" name="scheduleMode" value="next_followup" checked={scheduleMode === 'next_followup'} onChange={e => setScheduleMode(e.target.value)} className="mr-3" />
              <div className="text-sm">Next follow up date time</div>
            </label>

            <label className="inline-flex items-center w-full">
              <input type="radio" name="scheduleMode" value="specific" checked={scheduleMode === 'specific'} onChange={e => setScheduleMode(e.target.value)} className="mr-3" />
              <div className="text-sm">Specific time</div>
            </label>
            {scheduleMode === 'specific' && (
              <div className="pl-8">
                <input type="datetime-local" value={specificAt} onChange={e => setSpecificAt(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Choose specific time" />
              </div>
            )}

            <label className="inline-flex items-center w-full">
              <input type="radio" name="scheduleMode" value="without" checked={scheduleMode === 'without'} onChange={e => setScheduleMode(e.target.value)} className="mr-3" />
              <div className="text-sm">Without date time</div>
            </label>

            <label className="inline-flex items-center w-full">
              <input type="radio" name="scheduleMode" value="anyday" checked={scheduleMode === 'anyday'} onChange={e => setScheduleMode(e.target.value)} className="mr-3" />
              <div className="text-sm">Any time on this day</div>
            </label>
            {scheduleMode === 'anyday' && (
              <div className="pl-8">
                <input type="date" value={anyDay} onChange={e => setAnyDay(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
            )}
          </div>
        </div>


        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
    </div>
  )
}

export default AddCallList
