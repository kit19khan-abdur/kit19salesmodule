import React, { useState } from 'react'

const VoiceBroadCast = ({ onClose = () => {}, onSend = (payload) => {}, initialRecipients = { mobile1: true, mobile2: false, mobile3: false }, selectedCount = 0 }) => {
  const [schedule, setSchedule] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')
  const [recipients, setRecipients] = useState(initialRecipients)
  const [transactionalType, setTransactionalType] = useState('promotional')
  const [dni, setDni] = useState('')
  const [appFlow, setAppFlow] = useState('')
  const [error, setError] = useState('')

  const dniOptions = ['', 'DNI-001', 'DNI-002', 'DNI-003']
  const appFlowOptions = ['', 'Flow A', 'Flow B', 'Flow C']

  const toggleRecipient = (key) => setRecipients(prev => ({ ...prev, [key]: !prev[key] }))

  const validate = () => {
    setError('')
    if (!Object.values(recipients).some(Boolean)) {
      setError('Select at least one recipient (Mobile1/2/3).')
      return false
    }
    if (!dni) {
      setError('Choose DNI Number.')
      return false
    }
    if (!appFlow) {
      setError('Choose App Flow.')
      return false
    }
    if (schedule && !scheduleAt) {
      setError('Select schedule date and time.')
      return false
    }
    return true
  }

  const handleBroadcast = () => {
    if (!validate()) return
    const payload = { recipients, transactionalType, dni, appFlow, schedule, scheduleAt }
    onSend(payload)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-3 text-sm text-blue-700 bg-blue-50 p-3 rounded">Info! You are about to perform a mass action on {selectedCount} record(s)</div>

      <div className="mb-3">
        <label className="inline-flex items-center mr-4">
          <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className=" rounded-[3px] mr-2" />
          On Schedule Date And Time
        </label>
      </div>

      {schedule && (
        <div className="mb-4">
          <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
      )}

      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input type="checkbox" checked={recipients.mobile1} onChange={() => toggleRecipient('mobile1')} className=" rounded-[3px] mr-2" />
          Mobile1
        </label>
        <label className="inline-flex items-center mr-4">
          <input type="checkbox" checked={recipients.mobile2} onChange={() => toggleRecipient('mobile2')} className=" rounded-[3px] mr-2" />
          Mobile2
        </label>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={recipients.mobile3} onChange={() => toggleRecipient('mobile3')} className=" rounded-[3px] mr-2" />
          Mobile3
        </label>
      </div>

      <div className="mb-3">
        <div className="mb-2 font-medium">Transactional Type :</div>
        <label className="inline-flex items-center mr-4">
          <input type="radio" name="txn-type" value="promotional" checked={transactionalType === 'promotional'} onChange={() => setTransactionalType('promotional')} className="mr-2" />
          Promotional
        </label>
        <label className="inline-flex items-center">
          <input type="radio" name="txn-type" value="transactional" checked={transactionalType === 'transactional'} onChange={() => setTransactionalType('transactional')} className="mr-2" />
          Transactional
        </label>
      </div>

      <div className="space-y-3">
        <select value={dni} onChange={e => setDni(e.target.value)} className="w-full border px-3 py-2 rounded">
          {dniOptions.map(d => <option key={d} value={d}>{d || '---Choose DNI Number---'}</option>)}
        </select>

        <select value={appFlow} onChange={e => setAppFlow(e.target.value)} className="w-full border px-3 py-2 rounded">
          {appFlowOptions.map(a => <option key={a} value={a}>{a || '---Choose App Flow---'}</option>)}
        </select>
      </div>

      {error && <div className="text-red-600 text-sm mt-3">{error}</div>}

    </div>
  )
}

export default VoiceBroadCast
