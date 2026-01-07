import React, { useState, useMemo } from 'react'
import RichTextEditor from '../../../components/common/RichTextEditor'
import RichTextEditorArea from '../../../components/common/RichTextEditorArea'

const SMSForm = () => {
  const [tab, setTab] = useState('indian') // 'indian' or 'nonIndian'
  const [selectedNumbers, setSelectedNumbers] = useState(['9729723338'])
  const [senders] = useState(['kmukesh343(Transactional : 5015)(Muke...)', 'default_sender'])
  const [selectedSender, setSelectedSender] = useState(senders[0])
  const [apps] = useState(['KITAPP', 'OTHERAPP'])
  const [selectedApp, setSelectedApp] = useState(apps[0])
  const [templates] = useState(['Template 1', 'Template 2', 'Template 3'])
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [senderId, setSenderId] = useState('')
  const [message, setMessage] = useState('')
  const [isUnicode, setIsUnicode] = useState(false)
  const [urlTrack, setUrlTrack] = useState(false)

  const toggleNumber = (number) => {
    setSelectedNumbers(prev => prev.includes(number) ? prev.filter(n => n !== number) : [...prev, number])
  }

  const charCount = useMemo(() => message.length, [message])
  const maxChars = tab === 'indian' ? (isUnicode ? 70 : 160) : 2000

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex border-b">
          <button onClick={() => setTab('indian')} className={`px-4 py-2 -mb-px ${tab==='indian'? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}>Indian SMS</button>
          <button onClick={() => setTab('nonIndian')} className={`px-4 py-2 -mb-px ${tab==='nonIndian'? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-600'}`}>Non-Indian SMS</button>
        </div>
      </div>

      {tab === 'indian' && (
        <div>
          <h4 className="text-lg font-medium mb-3">Choose Mobile Numbers</h4>
          <div className="mb-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={selectedNumbers.includes('9729723338')} onChange={() => toggleNumber('9729723338')} className="w-4 h-4 rounded-[4px]" />
              <span>9729723338</span>
            </label>
          </div>

          <div className="p-3 mb-3 border rounded bg-blue-50 text-sm text-blue-800">Only DLT registered entities can send SMS. To know more <a className="underline">Click here !</a></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Sender</label>
              <select value={selectedSender} onChange={e => setSelectedSender(e.target.value)} className="w-full border rounded px-3 py-2">
                {senders.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">App</label>
              <select value={selectedApp} onChange={e => setSelectedApp(e.target.value)} className="w-full border rounded px-3 py-2">
                {apps.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Select Template</label>
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="w-full border rounded px-3 py-2">
                {templates.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <div className="relative">
                <RichTextEditorArea className="w-full border rounded px-3 py-2 h-28" value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" rows={4} />
                {/* <div className="absolute bottom-2 right-2 text-xs text-gray-500">{charCount} / {maxChars}</div> */}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2"><input className='rounded-[4px]' type="checkbox" checked={isUnicode} onChange={() => setIsUnicode(!isUnicode)} /> IsUnicode</label>
          </div>

        </div>
      )}

      {tab === 'nonIndian' && (
        <div>
          <div className="mb-3 text-sm text-gray-700">Note: Your wallet balance should be at least 1.5 times of the estimated batch cost to perform this action</div>
          <h4 className="text-lg font-medium mb-3">Choose Mobile Numbers</h4>
          <div className="mb-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={selectedNumbers.includes('9729723338')} onChange={() => toggleNumber('9729723338')} className="w-4 h-4 rounded-[4px]" />
              <span>9729723338</span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">SenderId</label>
              <input value={senderId} onChange={e => setSenderId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter SenderId" />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Compose SMS</label>
              <RichTextEditorArea className="w-full border rounded px-3 py-2 h-28" value={message} onChange={e => setMessage(e.target.value)} placeholder="Compose SMS" rows="4" />
              {/* <div className="text-xs text-gray-500 mt-1">{charCount} / {maxChars}</div> */}
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">IsUnicode: <span className="ml-2 font-medium">{isUnicode ? 'True' : 'False'}</span></label>
              <label className="flex items-center gap-2 rounded-[4px]"><input className='rounded-[4px]' type="checkbox" checked={urlTrack} onChange={() => setUrlTrack(!urlTrack)} /> UrlTrack</label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SMSForm
