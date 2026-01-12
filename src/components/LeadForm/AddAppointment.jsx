import React, { useState, useRef, useEffect } from 'react'
import { Calendar, Edit3, ChevronDown } from 'lucide-react'
import RichTextEditor from '../common/RichTextEditor'
import { getSession } from '../../getSession'
import { getUserFromHashedList } from '../../utils/lead'

const AddAppointment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    remarks: '',
    startDateTime: '',
    endDateTime: '',
    where: '',
    completeAddress: '',
    owner: '',
    collaborators: []
  })

  const [isCollaboratorsOpen, setIsCollaboratorsOpen] = useState(false)
  const collaboratorsRef = useRef(null)
  const startInputRef = useRef(null)
  const endInputRef = useRef(null)

  const [owners, setOwners] = useState([])
  const [collaboratorOptions, setCollaboratorOptions] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchUsers = async () => {
      setIsUsersLoading(true)
      try {
        const { userId, TokenId } = getSession()
        const details = { UserId: userId || 0 }
        const payload = {
          Token: TokenId,
          Message: '',
          LoggedUserId: userId,
          MAC_Address: '',
          IP_Address: '',
          Details: details,
          BroadcastName: ''
        }
        const resp = await getUserFromHashedList(payload)
        let raw = resp?.Details ?? resp?.d ?? resp ?? []
        if (raw && raw.data) raw = raw.data
        // If API wraps array in another property try common names
        if (raw && !Array.isArray(raw)) {
          raw = raw.ResultList ?? raw.Users ?? raw.UserList ?? raw.Data ?? raw.Items ?? raw
        }
        const usersArray = Array.isArray(raw) ? raw : []
        const mapToOption = (u) => {
          const id = u.Code ?? u.Id ?? u.ID ?? u.UserId ?? u.Value ?? u.ValueId ?? ''
          const label = u.Text ?? u.TextN ?? u.Name ?? u.FullName ?? u.DisplayName ?? u.LoginName ?? String(id)
          return { value: String(id), label: String(label) }
        }
        if (mounted) {
          const options = usersArray.map(mapToOption)
          setOwners(options)
          setCollaboratorOptions(options)
        }
      } catch (error) {
        console.error('fetch users error:', error)
      } finally {
        if (mounted) setIsUsersLoading(false)
      }
    }
    fetchUsers()
    return () => { mounted = false }
  }, [])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCollaborator = (collaborator) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.includes(collaborator)
        ? prev.collaborators.filter(c => c !== collaborator)
        : [...prev.collaborators, collaborator]
    }))
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collaboratorsRef.current && !collaboratorsRef.current.contains(event.target)) {
        setIsCollaboratorsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatToDisplay = (val) => {
    if (!val) return ''
    const dt = new Date(val)
    if (isNaN(dt)) return String(val)
    const dd = String(dt.getDate()).padStart(2, '0')
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const m = months[dt.getMonth()] || ''
    const yyyy = dt.getFullYear()
    const hh = String(dt.getHours()).padStart(2, '0')
    const mm = String(dt.getMinutes()).padStart(2, '0')
    return `${dd}-${m}-${yyyy} ${hh}:${mm}`
  }

  return (
    <div className="p-4 max-h-[70vh] overflow-y-auto">
      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="NewAppointment_20260106120931"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <div className="relative">
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Start Typing the details about the appointment"
            rows="3"
          />
          {/* <button className="absolute bottom-2 right-2 p-1.5 hover:bg-gray-100 rounded transition">
            <Edit3 className="w-4 h-4 text-gray-400" />
          </button> */}
        </div>
      </div>

      {/* Remarks */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarks
        </label>
        <div className="relative">
          <textarea
            value={formData.remarks}
            onChange={(e) => handleChange('remarks', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="about the task..."
            rows="3"
          />
          {/* <button className="absolute bottom-2 right-2 p-1.5 hover:bg-gray-100 rounded transition">
            <Edit3 className="w-4 h-4 text-gray-400" />
          </button> */}
        </div>
      </div>

      {/* Start Date and Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date and Time<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            value={formData.startDateTime ? formatToDisplay(formData.startDateTime) : ''}
            onClick={() => startInputRef.current && (startInputRef.current.showPicker ? startInputRef.current.showPicker() : startInputRef.current.click())}
            placeholder="Select date and time"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          />
          <button
            type="button"
            onClick={() => startInputRef.current && (startInputRef.current.showPicker ? startInputRef.current.showPicker() : startInputRef.current.click())}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Open date picker"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <input
            ref={startInputRef}
            type="datetime-local"
            value={formData.startDateTime}
            onChange={(e) => handleChange('startDateTime', e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-none"
          />
        </div>
      </div>

      {/* End Date and Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date and Time<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            value={formData.endDateTime ? formatToDisplay(formData.endDateTime) : ''}
            onClick={() => endInputRef.current && (endInputRef.current.showPicker ? endInputRef.current.showPicker() : endInputRef.current.click())}
            placeholder="Select date and time"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          />
          <button
            type="button"
            onClick={() => endInputRef.current && (endInputRef.current.showPicker ? endInputRef.current.showPicker() : endInputRef.current.click())}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Open date picker"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <input
            ref={endInputRef}
            type="datetime-local"
            value={formData.endDateTime}
            onChange={(e) => handleChange('endDateTime', e.target.value)}
            className="absolute inset-0 opacity-0 pointer-events-none"
          />
        </div>
      </div>

      {/* Where */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Where <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.where}
          onChange={(e) => handleChange('where', e.target.value)}
          placeholder="Enter location of appointment"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Complete Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Complete Address
        </label>
        <textarea
          value={formData.completeAddress}
          onChange={(e) => handleChange('completeAddress', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Please enter complete address"
          rows="3"
        />
      </div>

      {/* Owner */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Owner
        </label>
        <select
          value={formData.owner}
          onChange={(e) => handleChange('owner', e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{isUsersLoading ? 'Loading...' : 'Select Owner'}</option>
          {owners.map((owner) => (
            <option key={owner.value} value={owner.value}>
              {owner.label}
            </option>
          ))}
        </select>
      </div>

      {/* Collaborators */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Collaborators
        </label>
        <div className="relative" ref={collaboratorsRef}>
          <button
            type="button"
            onClick={() => setIsCollaboratorsOpen(!isCollaboratorsOpen)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white"
          >
            <span className={formData.collaborators.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
              {formData.collaborators.length === 0
                ? 'Nothing selected'
                : `Selected: ${collaboratorOptions.filter(o => formData.collaborators.includes(o.value)).map(o => o.label).join(', ')}`}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCollaboratorsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCollaboratorsOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-500 rounded shadow-lg max-h-48 overflow-y-auto">
              {collaboratorOptions.map((collaborator) => (
                <label
                  key={collaborator.value}
                  className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${formData.collaborators.includes(collaborator.value) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.collaborators.includes(collaborator.value)}
                    onChange={() => toggleCollaborator(collaborator.value)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">{collaborator.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddAppointment
