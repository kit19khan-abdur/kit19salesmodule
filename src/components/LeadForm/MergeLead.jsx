import React, { useState } from 'react';
import { X, ChevronLeft, ArrowRight, Plus } from 'lucide-react';
import AddFollowup from '../../pages/Enquiries/Forms/AddFollowup';
import AddFollowupForm from '../../pages/Enquiries/Forms/AddFollowupForm';
import PopUpModal from '../PopUpModal/PopUpModal';
import Button from '../common/Button';

const MergeLead = ({ isOpen, onClose, enquiryData }) => {
  const [selectedLeadId, setSelectedLeadId] = useState('136961');
  const [selectedFields, setSelectedFields] = useState({});
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [mergeData, setMergeData] = useState({
    name: 'Karthick',
    company: '',
    phone: '+91 9790690380',
    mobile1: 'Mobile1',
    mobile2: 'Mobile2',
    email: '',
    email1: '',
    email2: '',
    country: '',
    state: '',
    city: '',
    pincode: '0',
    residentialAddress: '',
    officeAddress: '',
  });

  // Mock data - replace with actual API data
  const leadOptions = [
    { id: '136961', name: 'Lead 136961' },
    { id: '136962', name: 'Lead 136962' },
    { id: '136963', name: 'Lead 136963' },
  ];

  const fieldsList = [
    { 
      id: 'name', 
      enquiry: { label: 'Karthick', value: 'Karthick' },
      lead: { label: 'Abdur', value: 'Abdur' },
      placeholder: 'Name'
    },
    { 
      id: 'company', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Company'
    },
    { 
      id: 'phone', 
      enquiry: { label: '9790690380', value: '9790690380' },
      lead: { label: '919790690380', value: '919790690380' },
      placeholder: 'Phone'
    },
    { 
      id: 'mobile1', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Mobile1'
    },
    { 
      id: 'mobile2', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Mobile2'
    },
    { 
      id: 'email', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Email'
    },
    { 
      id: 'email1', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Email1'
    },
    { 
      id: 'email2', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Email2'
    },
    { 
      id: 'country', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Country'
    },
    { 
      id: 'state', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'State'
    },
    { 
      id: 'city', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'City'
    },
    { 
      id: 'pincode', 
      enquiry: { label: '0', value: '0' },
      lead: { label: '', value: '' },
      placeholder: 'Pincode'
    },
    { 
      id: 'residentialAddress', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Residential Address'
    },
    { 
      id: 'officeAddress', 
      enquiry: { label: '', value: '' },
      lead: { label: '', value: '' },
      placeholder: 'Office Address'
    },
  ];

  const handleEnquiryFieldSelect = (fieldId, value) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldId]: 'enquiry'
    }));
    setMergeData(prev => ({
      ...prev,
      [fieldId]: value || ''
    }));
  };

  const handleLeadFieldSelect = (fieldId, value) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldId]: 'lead'
    }));
    setMergeData(prev => ({
      ...prev,
      [fieldId]: value || ''
    }));
  };

  const handleMergeDataChange = (fieldId, value) => {
    setMergeData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleMergeAndFollowup = () => {
    console.log('Merge & Add Followup clicked');
    setShowFollowupForm(true);
    console.log('showFollowupForm set to true');
  };

  const handleFollowupClose = () => {
    setShowFollowupForm(false);
    onClose();
  };

  // console.log('MergeLead render - showFollowupForm:', showFollowupForm);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-6xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Merge Enquiry to Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Enquiry ID Badge */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Enquiry ID.</span>
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
              {enquiryData?.EnquiryId || '370139811'}
            </span>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="ml-4 flex-1 max-w-md border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {leadOptions.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="relative h-[calc(100vh-220px)] overflow-y-auto">
          {/* Header Section with Profile Images */}
          <div className="grid grid-cols-3 border-b border-gray-200 sticky top-0 bg-white z-10">
            {/* Enquiry Details Header */}
            <div className="border-r border-gray-200 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                  <img
                    src="https://docs.kit19.com/default/person.png"
                    alt="Enquiry"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="details"
                    id="enquiry-details"
                    defaultChecked
                    className="w-4 h-4"
                  />
                  <label htmlFor="enquiry-details" className="font-semibold text-gray-800">
                    Enquiry Details
                  </label>
                </div>
              </div>
            </div>

            {/* Lead Details Header */}
            <div className="border-r border-gray-200 p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                  <img
                    src="https://docs.kit19.com/default/person.png"
                    alt="Lead"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="details"
                    id="lead-details"
                    className="w-4 h-4"
                  />
                  <label htmlFor="lead-details" className="font-semibold text-gray-800">
                    Lead Details
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Assigned To: <span className="font-medium">Abhi01 (Abhishek Kumar)</span>
                </p>
              </div>
            </div>

            {/* Merge Details Header */}
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                  <img
                    src="https://docs.kit19.com/default/person.png"
                    alt="Merge"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-800">Merge Details</h3>
              </div>
            </div>
          </div>

          {/* Fields Section - All in aligned rows */}
          <div className="relative">
            {fieldsList.map((field, index) => (
              <div 
                key={field.id} 
                className="grid grid-cols-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Enquiry Field */}
                <div className="border-r border-gray-200 px-6 py-3 flex items-center">
                  <input
                    type="radio"
                    name={`field-${field.id}`}
                    value="enquiry"
                    checked={selectedFields[field.id] === 'enquiry'}
                    onChange={() => handleEnquiryFieldSelect(field.id, field.enquiry.value)}
                    className="w-4 h-4 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 ml-3">
                    {field.enquiry.label || <span className="text-gray-400">Empty</span>}
                  </span>
                </div>

                {/* Lead Field */}
                <div className="border-r border-gray-200 px-6 py-3 flex items-center">
                  <input
                    type="radio"
                    name={`field-${field.id}`}
                    value="lead"
                    checked={selectedFields[field.id] === 'lead'}
                    onChange={() => handleLeadFieldSelect(field.id, field.lead.value)}
                    className="w-4 h-4 cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 ml-3">
                    {field.lead.label || <span className="text-gray-400">Empty</span>}
                  </span>
                </div>

                {/* Merge Field (Input) */}
                <div className="px-6 py-2">
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={mergeData[field.id]}
                    onChange={(e) => handleMergeDataChange(field.id, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}

            {/* Plus Button - positioned between first and second column */}
            <div className="absolute top-[50%] left-[calc(33.333%-24px)] ">
              <button className="w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition shadow-lg">
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* Arrow Button - positioned between second and third column */}
            <div className="absolute top-[50%] left-[calc(66.666%-24px)] ">
              <button className="w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition shadow-lg">
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-gray-200 flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition font-medium"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium">
            Merge to Lead
          </button>
          <button
            onClick={() => setShowFollowupForm(true)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
          >
            Merge & Add Follow up
          </button>
        </div>
      </div>

      <PopUpModal
        isOpen={showFollowupForm}
        onClose={handleFollowupClose}
        title="Add Lead"
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="secondary"
              onClick={handleFollowupClose}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleFollowupClose}
            >
              Save
            </Button>
          </div>
        }
      >
        <AddFollowupForm selectedCount={enquiryData} />
      </PopUpModal>


    </>
  );
};

export default MergeLead;
