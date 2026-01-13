import React, { useState, useRef, useEffect } from 'react'

const AddTaskForm = ({ onClose = () => {}, onSave = (payload) => {}, users = [] , initial = {} }) => {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [remarks, setRemarks] = useState(initial.remarks || '')
  const [activityType, setActivityType] = useState(initial.activityType || 'Facebook Chat')
  const [dueAt, setDueAt] = useState(initial.dueAt || '')
  const [owner, setOwner] = useState(initial.owner || '')
  const [collaborators, setCollaborators] = useState(initial.collaborators || [])
  const [showCollab, setShowCollab] = useState(false)
  const collabRef = useRef(null)
  const [schedule, setSchedule] = useState(initial.schedule || false)
  const [scheduleAt, setScheduleAt] = useState(initial.scheduleAt || '')
  const [error, setError] = useState('')

  const activityOptions = [
    'Facebook Chat',
    'Call',
    'Email',
    'Meeting'
  ]

  const userOptions = users.length ? users : [
    { id: '34594', name: 'Mohit.cheema (Mohit Cheema)' },
    { id: '34595', name: 'Manish.Singh (Surjit kaur)' },
    { id: '34596', name: 'Rachit.Kumar (naseem khan)' }
  ]

  const toggleCollaborator = (id) => {
    setCollaborators(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (collabRef.current && !collabRef.current.contains(e.target)) setShowCollab(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const validate = () => {
    setError('')
    if (!title.trim()) { setError('Title is required'); return false }
    if (!dueAt && !schedule) { setError('Due Date and Time is required (or enable schedule)'); return false }
    if (schedule && !scheduleAt) { setError('Schedule date/time required when scheduling'); return false }
    return true
  }

  const handleSave = () => {
    if (!validate()) return
    const payload = { title, description, remarks, activityType, dueAt, owner, collaborators, schedule, scheduleAt }
    onSave(payload)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className='text-[#f00]'>*</span></label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded h-24 resize-none" placeholder="Start Typing the details about the task." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full border px-3 py-2 rounded h-20 resize-none" placeholder="about the task..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sales Activity Type</label>
          <select value={activityType} onChange={e => setActivityType(e.target.value)} className="w-full border px-3 py-2 rounded">
            {activityOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date and Time*</label>
          <input type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
          <select value={owner} onChange={e => setOwner(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">Nothing selected</option>
            {userOptions.map(u => <option key={u.id} value={u.id}>{u.id}-{u.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Collaborators</label>
          <div className="relative" ref={collabRef}>
            <button
              type="button"
              onClick={() => setShowCollab(s => !s)}
              className="w-full text-left border rounded px-3 py-2 flex items-center justify-between"
            >
              <div className="truncate text-sm">
                {collaborators && collaborators.length > 0
                  ? userOptions.filter(u => collaborators.includes(u.id)).map(u => u.name).join(', ')
                  : 'Select collaborators'}
              </div>
              <div className="ml-2 text-gray-500">▾</div>
            </button>

            {showCollab && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-48 overflow-auto">
                {userOptions.length > 0 ? (
                  userOptions.map(u => {
                    const selected = collaborators.includes(u.id)
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleCollaborator(u.id)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-100 ${selected ? 'bg-blue-50' : ''}`}
                      >
                        <div className="truncate text-sm">{u.id}-{u.name}</div>
                        {selected && <div className="text-blue-600">✓</div>}
                      </button>
                    )
                  })
                ) : (
                  <div className="text-sm text-gray-500 p-2">No users</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className=" rounded-[3px] mr-2" />
            On Schedule Date And Time
          </label>
        </div>

        {schedule && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CreateTask on Schedule Date and Time*</label>
            <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

      </div>
    </div>
  )
}

export default AddTaskForm
