import React, { useState } from 'react'

const UpdateForm = ({ onClose = () => {}, onUpdate = (payload) => {}, fieldOptions = [], selectedCount = 0 }) => {
  const [field, setField] = useState('')
  const [value, setValue] = useState('')
  const [entries, setEntries] = useState([])
  const [schedule, setSchedule] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')
  const [error, setError] = useState('')

  const defaultFieldOptions = fieldOptions.length ? fieldOptions : [
    { key: 'PersonName', label: 'PersonName' },
    { key: 'Company', label: 'Company' },
    { key: 'Phone', label: 'Phone' },
    { key: 'Email', label: 'Email' }
  ]

  const handleAdd = () => {
    setError('')
    if (!field) {
      setError('Please select a field')
      return
    }
    if (!value.trim()) {
      setError('Please enter a value')
      return
    }
    // prevent duplicate field entries
    if (entries.some(e => e.field === field)) {
      setError('This field is already added')
      return
    }
    setEntries(prev => [...prev, { field, value }])
    setField('')
    setValue('')
  }

  const handleRemove = (idx) => {
    setEntries(prev => prev.filter((_, i) => i !== idx))
  }

  const validate = () => {
    setError('')
    if (entries.length === 0) {
      setError('Add at least one field to update')
      return false
    }
    if (schedule && !scheduleAt) {
      setError('Select schedule date and time')
      return false
    }
    return true
  }

  const handleUpdate = () => {
    if (!validate()) return
    const payload = { entries, schedule, scheduleAt }
    onUpdate(payload)
  }

  return (
    <div className="w-full max-w-2xl">

      <div className="mb-3">
        <select value={field} onChange={e => setField(e.target.value)} className="w-full border px-3 py-2 rounded mb-2">
          <option value="">Please Select Field</option>
          {defaultFieldOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        <input value={value} onChange={e => setValue(e.target.value)} placeholder="Enter field value" className="w-full border px-3 py-2 rounded" />
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={handleAdd} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded">
          <span className="text-xl">+</span>
          Add
        </button>
      </div>

      <div className="mb-4 border-t pt-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="py-2">Field Name</th>
              <th className="py-2">Field Value</th>
              <th className="py-2">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={3} className="py-4 text-gray-500">No fields added</td></tr>
            ) : entries.map((e, idx) => (
              <tr key={e.field} className="border-t">
                <td className="py-3">{e.field}</td>
                <td className="py-3">{e.value}</td>
                <td className="py-3 text-right">
                  <button onClick={() => handleRemove(idx)} className="px-2 py-1 bg-gray-800 text-white rounded">-</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <label className="inline-flex items-center mr-4">
          <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className=" rounded-[3px] mr-2" />
          On Schedule Date And Time
        </label>
      </div>

      {schedule && (
        <div className="mt-3">
          <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
      )}

      {error && <div className="text-red-600 text-sm mt-3">{error}</div>}

    </div>
  )
}

export default UpdateForm
