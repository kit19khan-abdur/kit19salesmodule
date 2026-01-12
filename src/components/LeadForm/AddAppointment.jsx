import React, { useState, useRef, useEffect } from 'react'
import { Calendar, Edit3, ChevronDown } from 'lucide-react'
import RichTextEditor from '../common/RichTextEditor'

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

  const owners = ['Abhi01 (Abhishek Kumar)', 'John Doe', 'Jane Smith']
  const collaboratorOptions = ['User 1', 'User 2', 'User 3', 'User 4']

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
            type="datetime-local"
            value={formData.startDateTime}
            onChange={(e) => handleChange('startDateTime', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* End Date and Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date and Time<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            value={formData.endDateTime}
            onChange={(e) => handleChange('endDateTime', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
          <option value="">Select Owner</option>
          {owners.map((owner) => (
            <option key={owner} value={owner}>
              {owner}
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
                : `Selected: ${formData.collaborators.join(', ')}`}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCollaboratorsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCollaboratorsOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-500 rounded shadow-lg max-h-48 overflow-y-auto">
              {collaboratorOptions.map((collaborator) => (
                <label
                  key={collaborator}
                  className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${formData.collaborators.includes(collaborator) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.collaborators.includes(collaborator)}
                    onChange={() => toggleCollaborator(collaborator)}
                    className="mr-2 rounded"
                  />
                  <span className="text-sm">{collaborator}</span>
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
