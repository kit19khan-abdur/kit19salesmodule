import React, { useState } from 'react'

const SendMail = ({ onClose = () => {}, onSend = (payload) => {}, initialRecipients = { email1: true, email2: false, email3: false }, selectedCount = 0 }) => {
  const [recipients, setRecipients] = useState(initialRecipients)
  const [sender, setSender] = useState('kmukesh343(Transactional : 287673)(Mukesh Kumar)')
  const [fromEmail, setFromEmail] = useState('abcd@gmail.com')
  const [replyTo, setReplyTo] = useState('abcd@gmail.com')
  const [mode, setMode] = useState('template') // 'template' or 'compose'
  const [template, setTemplate] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [schedule, setSchedule] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')
  const [error, setError] = useState('')

  const senderOptions = [
    'kmukesh343(Transactional : 287673)(Mukesh Kumar)',
    'noreply(Transactional : 6001)(No Reply)'
  ]

  const emailOptions = [
    'abcd@gmail.com',
    'info@company.com'
  ]

  const templateList = [
    { id: '', label: '-- None --' },
    { id: 'pankajmail', label: 'pankajmail' },
    { id: 'stark_demo', label: 'Stark_demo' },
    { id: 'trtr', label: 'trtr' }
  ]

  const toggleRecipient = (key) => setRecipients(prev => ({ ...prev, [key]: !prev[key] }))

  const validate = () => {
    setError('')
    if (!Object.values(recipients).some(Boolean)) {
      setError('Select at least one recipient (Email1/Email2/Email3).')
      return false
    }
    if (!subject.trim()) {
      setError('Subject is required.')
      return false
    }
    if (mode === 'template' && !template) {
      setError('Please select a template or switch to Compose Mail.')
      return false
    }
    if (mode === 'compose' && !message.trim()) {
      setError('Message body is required when composing mail.')
      return false
    }
    if (schedule && !scheduleAt) {
      setError('Select schedule date and time.')
      return false
    }
    return true
  }

  const handleSend = () => {
    if (!validate()) return
    const payload = { recipients, sender, fromEmail, replyTo, mode, template, subject, message, schedule, scheduleAt }
    onSend(payload)
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-3 text-sm text-blue-700 bg-blue-50 p-3 rounded">Info! You are about to perform a mass action on {selectedCount} record(s)</div>

      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input type="checkbox" checked={recipients.email1} onChange={() => toggleRecipient('email1')} className=" rounded-[3px] mr-2" />
          Email1
        </label>
        <label className="inline-flex items-center mr-4">
          <input type="checkbox" checked={recipients.email2} onChange={() => toggleRecipient('email2')} className=" rounded-[3px] mr-2" />
          Email2
        </label>
        <label className="inline-flex items-center">
          <input type="checkbox" checked={recipients.email3} onChange={() => toggleRecipient('email3')} className=" rounded-[3px] mr-2" />
          Email3
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <select value={sender} onChange={e => setSender(e.target.value)} className="w-full border px-3 py-2 rounded">
            {senderOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <select value={fromEmail} onChange={e => setFromEmail(e.target.value)} className="w-full border px-3 py-2 rounded mb-2">
            {emailOptions.map(ea => <option key={ea} value={ea}>{ea}</option>)}
          </select>

          <select value={replyTo} onChange={e => setReplyTo(e.target.value)} className="w-full border px-3 py-2 rounded">
            {emailOptions.map(ea => <option key={ea} value={ea}>{ea}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input type="radio" name="mail-mode" checked={mode === 'template'} onChange={() => setMode('template')} className="mr-2" />
            Select Template
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="mail-mode" checked={mode === 'compose'} onChange={() => setMode('compose')} className="mr-2" />
            Compose Mail
          </label>
        </div>

        <div>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full border px-3 py-2 rounded" />
        </div>

        {mode === 'template' ? (
          <div>
            <div className="mb-2">
              <a href="#" className="text-blue-600 text-sm">Click To View</a>
            </div>
            <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full border px-3 py-2 rounded">
              {templateList.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <div className="border rounded">
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full h-40 p-3 resize-none" placeholder="Compose your email here..." />
            </div>
          </div>
        )}

        <div className="mt-3">
          <label className="inline-flex items-center mr-4">
            <input type="checkbox" checked={schedule} onChange={() => setSchedule(s => !s)} className=" rounded-[3px] mr-2" />
            On Schedule Date And Time
          </label>
        </div>

        {schedule && (
          <div className="mt-2">
            <input type="datetime-local" value={scheduleAt} onChange={e => setScheduleAt(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
        )}

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

      </div>
    </div>
  )
}

export default SendMail
