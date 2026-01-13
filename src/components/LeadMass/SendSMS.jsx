import React, { useState } from 'react'

const SendSMS = ({ onClose = () => {}, onSend = (data) => {} , initialRecipients = { mobile1: true, mobile2: false, mobile3: false }, selectedCount = 0 }) => {
  const [recipients, setRecipients] = useState(initialRecipients)
  const [sender, setSender] = useState('kmukesh343(Transactional : 5013)(Mukesh Kumar)')
  const [account, setAccount] = useState('KITAPP')
  const [template, setTemplate] = useState('')
  const [message, setMessage] = useState('')
  const [isUnicode, setIsUnicode] = useState(false)
  const [trackUrl, setTrackUrl] = useState(false)
  const [error, setError] = useState('')

  const senderOptions = [
    'kmukesh343(Transactional : 5013)(Mukesh Kumar)',
    'noreply(Transactional : 6001)(No Reply)'
  ]

  const accountOptions = [
    'KITAPP',
    'DEFAULT'
  ]

  const templateOptions = [
    { id: '', label: 'Select Template' },
    { id: 't1', label: 'Welcome Template' },
    { id: 't2', label: 'Reminder Template' }
  ]

  const toggleRecipient = (key) => {
    setRecipients(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSend = () => {
    setError('')
    if (!Object.values(recipients).some(Boolean)) {
      setError('Select at least one recipient number')
      return
    }
    if (!message.trim()) {
      setError('Message cannot be empty')
      return
    }

    const payload = { recipients, sender, account, template, message, isUnicode, trackUrl }
    onSend(payload)
  }

  return (
    <div className=" w-full max-w-2xl">
      <div className="mb-3 text-sm text-blue-700 bg-blue-50 p-3 rounded">Info! You are about to perform a mass action on {selectedCount} record(s)</div>

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

      <div className="space-y-3">
        <div>
          <select value={sender} onChange={e => setSender(e.target.value)} className="w-full border px-3 py-2 rounded">
            {senderOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <select value={account} onChange={e => setAccount(e.target.value)} className="w-full border px-3 py-2 rounded">
            {accountOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full border px-3 py-2 rounded">
            {templateOptions.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" className="w-full border px-3 py-2 rounded h-28 resize-none" />
        </div>

        <div className="flex items-center gap-6">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={isUnicode} onChange={() => setIsUnicode(v => !v)} className=" rounded-[3px] mr-2" />
            IsUnicode
          </label>

          <label className="inline-flex items-center">
            <input type="checkbox" checked={trackUrl} onChange={() => setTrackUrl(v => !v)} className=" rounded-[3px] mr-2" />
            Track Url
          </label>
        </div>

        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={handleSend} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Track SMS</button>
        </div>
      </div>
    </div>
  )
}

export default SendSMS
