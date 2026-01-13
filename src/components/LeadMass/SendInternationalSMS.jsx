import React, { useState, useRef, useEffect } from 'react'

const SendInternationalSMS = ({ onClose = () => {}, onSend = (payload) => {}, senders = [], placeholders = [] , initial = {} }) => {
  const [senderId, setSenderId] = useState(initial.senderId || '')
  const [message, setMessage] = useState(initial.message || '')
  const [isUnicode, setIsUnicode] = useState(false)
  const [urlTrack, setUrlTrack] = useState(initial.urlTrack || false)
  const [url, setUrl] = useState(initial.url || '')
  const [schedule, setSchedule] = useState(initial.schedule || false)
  const [scheduleAt, setScheduleAt] = useState(initial.scheduleAt || '')
  const [error, setError] = useState('')

  const [showPlaceholders, setShowPlaceholders] = useState(false)
  const phRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (phRef.current && !phRef.current.contains(e.target)) setShowPlaceholders(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    setIsUnicode(/[^\u0000-\u007f]/.test(message))
  }, [message])

  const defaultSenders = senders.length ? senders : [{ id: '', name: '' }]
  const defaultPlaceholders = placeholders.length ? placeholders : [{ key: 'first_name', label: 'First Name' }, { key: 'last_name', label: 'Last Name' }]

  const insertPlaceholder = (ph) => {
    const pos = (document.activeElement && document.activeElement.selectionStart) || message.length
    const newMsg = message.slice(0, pos) + `#${ph}#` + message.slice(pos)
    setMessage(newMsg)
    setShowPlaceholders(false)
  }

  const validate = () => {
    setError('')
    if (!senderId) { setError('SenderID is required'); return false }
    if (!message.trim()) { setError('Message is required'); return false }
    if (message.length > 2000) { setError('Message exceeds 2000 character limit'); return false }
    if (urlTrack && !url.trim()) { setError('Enter URL when UrlTrack is enabled'); return false }
    if (schedule && !scheduleAt) { setError('Schedule date/time required when scheduling'); return false }
    return true
  }

  const handleSend = () => {
    if (!validate()) return
    const payload = { senderId, message, isUnicode, urlTrack, url, schedule, scheduleAt }
    onSend(payload)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="space-y-4">
        <div className="text-sm text-[#ab810b] font-semibold">Note: Your wallet balance should be at least 1.5 times of the estimated batch cost to perform this action</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SenderID</label>
          <select value={senderId} onChange={e => setSenderId(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">Select SenderID</option>
            {defaultSenders.map(s => <option key={s.id} value={s.id}>{s.id ? `${s.id} - ${s.name}` : s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compose SMS</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border px-3 py-2 rounded h-32 resize-none" placeholder="Message" />
          <div className="text-right text-sm text-gray-500 mt-1">{message.length} / 2000</div>
        </div>

        <div className="flex relative items-center gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowPlaceholders(s => !s) }}
            className="text-sm text-blue-600 flex items-center gap-2"
          >
            <span className="text-xl">📄</span>
            Click Icon to Insert Placeholder
          </button>

          <div className="text-sm">IsUnicode: <strong>{isUnicode ? 'True' : 'False'}</strong></div>
        {showPlaceholders && (
          <div className="absolute top-0 inset-0 z-50 flex items-start justify-center p-4">
            <div ref={phRef} className="bg-white border rounded shadow-lg p-4 w-full max-w-sm relative">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold">CHOOSE PLACEHOLDER</div>
                <button type="button" onClick={() => setShowPlaceholders(false)} className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded">×</button>
              </div>
              <select className="w-full border px-3 py-2 rounded" onChange={e => insertPlaceholder(e.target.value)}>
                <option value="">Nothing selected</option>
                {defaultPlaceholders.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>
        )}
        </div>


        <div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={urlTrack} onChange={() => setUrlTrack(v => !v)} className="  rounded-[3px]  mr-2" />
            UrlTrack
          </label>
        </div>

        {urlTrack && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL" className="w-full border px-3 py-2 rounded" />
          </div>
        )}

        <div className="mt-2">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className=" rounded-[3px] mr-2" />
            On Schedule Date And Time
          </label>
        </div>

        {schedule && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date and Time*</label>
            <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
        )}


        {error && <div className="text-red-600 text-sm">{error}</div>}

      </div>
    </div>
  )
}

export default SendInternationalSMS
