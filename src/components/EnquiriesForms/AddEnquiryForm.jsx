import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Save } from 'lucide-react';

const AddEnquiryForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    avatar: null,
    name: '',
    mobiles: [{ countryCode: '+91', number: '' }],
    emails: [''],
    source: '',
    medium: '',
    campaign: '',
    initialRemarks: '',
    tags: '',
    company: '',
    country: '',
    state: '',
    city: '',
    pinCode: '',
    residentialAddress: '',
    officialAddress: '',
    addToLead: false,
    selectedUser: ''
  });

  const [collapsedSections, setCollapsedSections] = useState({
    basic: false,
    enquiry: true,
    company: true,
    autoLead: true
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addMobileField = () => {
    if (formData.mobiles.length < 3) {
      setFormData(prev => ({
        ...prev,
        mobiles: [...prev.mobiles, { countryCode: '+91', number: '' }]
      }));
    }
  };

  const addEmailField = () => {
    if (formData.emails.length < 3) {
      setFormData(prev => ({
        ...prev,
        emails: [...prev.emails, '']
      }));
    }
  };

  const removeMobileField = (index) => {
    if (formData.mobiles.length > 1) {
      setFormData(prev => ({
        ...prev,
        mobiles: prev.mobiles.filter((_, i) => i !== index)
      }));
    }
  };

  const removeEmailField = (index) => {
    if (formData.emails.length > 1) {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }));
    }
  };

  const handleMobileChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      mobiles: prev.mobiles.map((mobile, i) => 
        i === index ? { ...mobile, [field]: value } : mobile
      )
    }));
  };

  const handleEmailChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => i === index ? value : email)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveField = (fieldName) => {
    console.log(`Saving ${fieldName}:`, formData[fieldName]);
    alert(`${fieldName} saved successfully!`);
  }; 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Section */}
        <div className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => toggleSection('basic')}
          >
            <h3 className="text-base font-semibold text-gray-700">
              Basic <span className="text-red-500">*</span>
            </h3>
            {collapsedSections.basic ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          {!collapsedSections.basic && (
            <div className="p-4">
            
            <div className="flex items-start gap-6 mb-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2">
                  {formData.avatar ? (
                    <img src={URL.createObjectURL(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img src="https://kit19.com/assets/custom/img/img_avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  name="avatar"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
                <label htmlFor="avatar-upload" className="cursor-pointer px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50">
                  Choose file
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  (jpg, png, bmp & gif images<br />max size 1mb)
                </p>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    placeholder="Name (Required)"
                    required
                  />
                </div>

                {/* Mobile and Email Row */}
                <div className="space-y-3">
                  {/* Mobile Fields */}
                  <div className="space-y-2">
                    {formData.mobiles.map((mobile, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex gap-2 flex-1 relative">
                          <select
                            value={mobile.countryCode}
                            onChange={(e) => handleMobileChange(index, 'countryCode', e.target.value)}
                            className="w-20 px-2 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="+91">🇮🇳</option>
                            <option value="+1">🇺🇸</option>
                            <option value="+44">🇬🇧</option>
                          </select>
                          <input
                            type="tel"
                            value={mobile.number}
                            onChange={(e) => handleMobileChange(index, 'number', e.target.value)}
                            className="flex-1 px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                            placeholder={`Mobile ${index + 1} ${index === 0 ? '(Required)' : ''}`}
                            required={index === 0}
                          />
                        </div>
                        {index === 0 && formData.mobiles.length < 3 && (
                          <button
                            type="button"
                            onClick={addMobileField}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition"
                            title="Add More Mobile"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        )}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeMobileField(index)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                            title="Remove Mobile"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        )}
                        {index === 0 && formData.mobiles.length >= 3 && (
                          <div className="w-10"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Email Fields */}
                  <div className="space-y-2">
                    {formData.emails.map((email, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <div className="flex-1 relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                            placeholder={`Email ${index + 1} ${index === 0 ? '(Required)' : ''}`}
                            required={index === 0}
                          />
                        </div>
                        {index === 0 && formData.emails.length < 3 && (
                          <button
                            type="button"
                            onClick={addEmailField}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition"
                            title="Add More Email"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        )}
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeEmailField(index)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition"
                            title="Remove Email"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        )}
                        {index === 0 && formData.emails.length >= 3 && (
                          <div className="w-10"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Source */}
                <div className="relative">
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    required
                  >
                    <option value="">Select Source (Required)</option>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Partner Event 2026">Partner Event 2026</option>
                  </select>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Enquiry Details Section */}
        <div className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => toggleSection('enquiry')}
          >
            <h3 className="text-base font-semibold text-gray-700">Enquiry Details</h3>
            {collapsedSections.enquiry ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          {!collapsedSections.enquiry && (
            <div className="p-4">

            
            <div className="space-y-4">
              {/* Medium and Campaign */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                  >
                    <option value="">Select Medium</option>
                    <option value="Web Form">Web Form</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                  >
                    <option value="">Select Campaign</option>
                    <option value="Partner Enrollment">Partner Enrollment</option>
                    <option value="Product Launch">Product Launch</option>
                  </select>
                </div>
              </div>

              {/* Initial Remarks */}
              <div className="relative">
                <textarea
                  name="initialRemarks"
                  value={formData.initialRemarks}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none pr-10"
                  placeholder="Initial Remarks"
                />
              </div>

              {/* Enquiry Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enquiry Tags</label>
                <div className="relative">
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2 pr-10"
                    placeholder="Search tags"
                  />
                </div>
                <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-xs text-green-700">
                  Please press comma, tab, or enter key for generating the tag name, or you can also generate a tag by copy and paste with comma separated value.
                </div>
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Company Details Section */}
        <div className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => toggleSection('company')}
          >
            <h3 className="text-base font-semibold text-gray-700">Company Details</h3>
            {collapsedSections.company ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          {!collapsedSections.company && (
            <div className="p-4">

            
            <div className="space-y-4">
              {/* Company */}
              <div className="relative">
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                  placeholder="Company"
                />
              </div>

              {/* Country and State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                  >
                    <option value="">State</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
              </div>

              {/* City and Pin Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                  >
                    <option value="">City</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    placeholder="Pin Code"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div className="relative">
                <textarea
                  name="residentialAddress"
                  value={formData.residentialAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none pr-10"
                  placeholder="Residential Address"
                />
              </div>

              {/* Official Address */}
              <div className="relative">
                <textarea
                  name="officialAddress"
                  value={formData.officialAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none pr-10"
                  placeholder="Official Address"
                />
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Auto Lead Section */}
        <div className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => toggleSection('autoLead')}
          >
            <h3 className="text-base font-semibold text-gray-700">Auto Lead</h3>
            {collapsedSections.autoLead ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          {!collapsedSections.autoLead && (
            <div className="p-4">
              <div className="flex items-start gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="addToLead"
                    checked={formData.addToLead}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Add To Lead</span>
                </label>

                {formData.addToLead && (
                  <div className="flex-1 relative">
                    <select
                      name="selectedUser"
                      value={formData.selectedUser}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    >
                      <option value="">Select User</option>
                      <option value="34594-Vikas.Rawat">34594-Vikas.Rawat (Mukesh Kumar)</option>
                      <option value="34594-Chintan.Gujrati">34594-Chintan.Gujrati (Chintan Gujrati)</option>
                      <option value="34594-Shubham.Giri">34594-Shubham.Giri (Shubham Giri)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEnquiryForm;
