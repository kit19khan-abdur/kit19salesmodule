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

  const enquiryFields = [
    { id: 'name', label: 'Karthick', value: 'Karthick' },
    { id: 'company', label: '', value: '' },
    { id: 'phone', label: '9790690380', value: '9790690380' },
    { id: 'mobile1', label: '', value: '' },
    { id: 'mobile2', label: '', value: '' },
    { id: 'email', label: '', value: '' },
    { id: 'email1', label: '', value: '' },
    { id: 'email2', label: '', value: '' },
    { id: 'country', label: '', value: '' },
    { id: 'state', label: '', value: '' },
    { id: 'city', label: '', value: '' },
    { id: 'pincode', label: '0', value: '0' },
    { id: 'residentialAddress', label: '', value: '' },
    { id: 'officeAddress', label: '', value: '' },
  ];

  const leadFields = [
    { id: 'name', label: 'Abdur', value: 'Abdur' },
    { id: 'mobile2', label: '', value: '' },
    { id: 'phone', label: '919790690380', value: '919790690380' },
    { id: 'email', label: '', value: '' },
    { id: 'email1', label: '', value: '' },
    { id: 'email2', label: '', value: '' },
    { id: 'country', label: '', value: '' },
    { id: 'state', label: '', value: '' },
    { id: 'city', label: '', value: '' },
    { id: 'pincode', label: '', value: '' },
    { id: 'residentialAddress', label: '', value: '' },
    { id: 'officeAddress', label: '', value: '' },
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
        <div className="relative grid grid-cols-3 gap-0 h-[calc(100vh-220px)]">
          {/* Scrollable Container for All Three Columns */}
          <div className="col-span-3 overflow-y-auto h-full">
            <div className="grid grid-cols-3 gap-0 relative">
              {/* Enquiry Details Column */}
              <div className="border-r border-gray-200 relative">
                <div className="p-6 pb-24">
                  <div className="flex flex-col items-center mb-6">
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

                  <div className="space-y-2">
                    {enquiryFields.map((field) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`field-${field.id}`}
                          value="enquiry"
                          checked={selectedFields[field.id] === 'enquiry'}
                          onChange={() => handleEnquiryFieldSelect(field.id, field.value)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">
                          {field.label || <span className="text-gray-400">Empty</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lead Details Column */}
              <div className="border-r border-gray-200 relative">
                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
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

                  <div className="space-y-2">
                    {leadFields.map((field) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`field-${field.id}`}
                          value="lead"
                          checked={selectedFields[field.id] === 'lead'}
                          onChange={() => handleLeadFieldSelect(field.id, field.value)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">
                          {field.label || <span className="text-gray-400">Empty</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Merge Details Column */}
              <div className="relative">
                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                      <img
                        src="https://docs.kit19.com/default/person.png"
                        alt="Merge"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-800">Merge Details</h3>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Karthick"
                      value={mergeData.name}
                      onChange={(e) => handleMergeDataChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={mergeData.company}
                      onChange={(e) => handleMergeDataChange('company', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="+91 9790690380"
                      value={mergeData.phone}
                      onChange={(e) => handleMergeDataChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Mobile1"
                      value={mergeData.mobile1}
                      onChange={(e) => handleMergeDataChange('mobile1', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Mobile2"
                      value={mergeData.mobile2}
                      onChange={(e) => handleMergeDataChange('mobile2', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Email"
                      value={mergeData.email}
                      onChange={(e) => handleMergeDataChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Email1"
                      value={mergeData.email1}
                      onChange={(e) => handleMergeDataChange('email1', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Email2"
                      value={mergeData.email2}
                      onChange={(e) => handleMergeDataChange('email2', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={mergeData.country}
                      onChange={(e) => handleMergeDataChange('country', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={mergeData.state}
                      onChange={(e) => handleMergeDataChange('state', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={mergeData.city}
                      onChange={(e) => handleMergeDataChange('city', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="0"
                      value={mergeData.pincode}
                      onChange={(e) => handleMergeDataChange('pincode', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Residential Address"
                      value={mergeData.residentialAddress}
                      onChange={(e) => handleMergeDataChange('residentialAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Office Address"
                      value={mergeData.officeAddress}
                      onChange={(e) => handleMergeDataChange('officeAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Plus Button - positioned between first and second column */}
              <div className="absolute top-[50%] left-[calc(33.333%-24px)] z-20">
                <button className="w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition shadow-lg">
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {/* Arrow Button - positioned between second and third column */}
              <div className="absolute top-[50%] left-[calc(66.666%-24px)] z-20">
                <button className="w-12 h-12 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 transition shadow-lg">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
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
