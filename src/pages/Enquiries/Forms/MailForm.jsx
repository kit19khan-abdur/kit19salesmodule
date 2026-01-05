import React, { useState } from 'react'

const MailForm = () => {
  const [selectedEmails, setSelectedEmails] = useState([])
  const [accounts] = useState(['--Select Accounts--', 'abcd@gmail.com', 'xyz@gmail.com'])
  const [emailOptions] = useState(['abcd@gmail.com', 'efgh@gmail.com'])
  const [selectedAccount1, setSelectedAccount1] = useState(accounts[0])
  const [selectedAccount2, setSelectedAccount2] = useState(emailOptions[0])
  const [selectedAccount3, setSelectedAccount3] = useState(emailOptions[0])
  const [useTemplate, setUseTemplate] = useState(true)
  const [subject, setSubject] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('trtr ()')
  const templates = ['trtr ()', 'best ( Enquiry )', 'fdfdfd ( Enquiry )']

  const toggleEmail = (email) => {
    setSelectedEmails(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email])
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Choose Emails</h3>

      <div className="mb-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 rounded-[2px]" checked={selectedEmails.includes('dgagroup21@gmail.com')} onChange={() => toggleEmail('dgagroup21@gmail.com')} />
          <span className="text-sm">dgagroup21@gmail.com</span>
        </label>
      </div>

      {/* Two fields per row grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Select Account</label>
          <select value={selectedAccount1} onChange={e => setSelectedAccount1(e.target.value)} className="w-full border rounded px-3 py-2">
            {accounts.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <select value={selectedAccount2} onChange={e => setSelectedAccount2(e.target.value)} className="w-full border rounded px-3 py-2">
            {emailOptions.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Additional Email</label>
          <select value={selectedAccount3} onChange={e => setSelectedAccount3(e.target.value)} className="w-full border rounded px-3 py-2">
            {emailOptions.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Choose Template / Compose</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="mode" checked={useTemplate} onChange={() => setUseTemplate(true)} /> <span className="text-sm">Select Template</span></label>
            <label className="flex items-center gap-2"><input type="radio" name="mode" checked={!useTemplate} onChange={() => setUseTemplate(false)} /> <span className="text-sm">Compose Mail</span></label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">Subject</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Subject" />
      </div>

      {useTemplate ? (
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Templates</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {templates.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Compose</label>
          <textarea className="w-full border rounded px-3 py-2 h-36" placeholder="Write your email..." />
        </div>
      )}
    </div>
  )
}

export default MailForm
