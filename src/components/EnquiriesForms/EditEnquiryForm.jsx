import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditEnquiryForm = ({ enquiry, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: enquiry?.PersonName || '',
    company: enquiry?.CompanyName || '',
    mobile: enquiry?.MobileNo || '',
    countryCode: '+91',
    email: enquiry?.EmailId || '',
    country: enquiry?.Country || '',
    state: enquiry?.State || '',
    city: enquiry?.City || '',
    source: enquiry?.SourceName || '',
    medium: enquiry?.Medium || 'Web Form',
    campaign: enquiry?.Campaign || '',
    resiAddress: enquiry?.ResiAddress || '',
    officeAddress: enquiry?.OfficeAddress || '',
    remark: enquiry?.Remark || '',
    pinCode: enquiry?.PinCode || '0',
    tags: enquiry?.Tags || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSaveField = (fieldName) => {
    console.log(`Saving ${fieldName}:`, formData[fieldName]);
    alert(`${fieldName} saved successfully!`);
  };


  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        {/* Basic Details */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4 pb-3 border-b">Basic Details</h3>

          <div className="flex items-start gap-6 mb-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                  src="https://kit19.com/assets/custom/img/img_avatar.png"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              {/* Name */}
              <div className='relative'>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter name"
                />
                {formData.name && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('name')}
                    className="absolute right-2 top-[70%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save name"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Company */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
                {formData.company && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('company')}
                    className="absolute right-2 top-[70%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save company"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile1 */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile1</label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter mobile number"
                    />
                    {formData.mobile && (
                      <button
                        type="button"
                        onClick={() => handleSaveField('mobile')}
                        className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition z-10"
                        title="Save mobile"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Email1 */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email1</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter email"
                />
                {formData.email && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('email')}
                    className="absolute right-2 top-[70%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save email"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                  {formData.country && (
                    <button
                      type="button"
                      onClick={() => handleSaveField('country')}
                      className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                      title="Save country"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* State and City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                    {formData.state && (
                      <button
                        type="button"
                        onClick={() => handleSaveField('state')}
                        className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                        title="Save state"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                    {formData.city && (
                      <button
                        type="button"
                        onClick={() => handleSaveField('city')}
                        className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                        title="Save city"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Details */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4 pb-3 border-b">Other Details</h3>

          {/* Enquiry ID */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Enquiry ID :</span>
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                {enquiry?.ID || 'New'}
              </span>
            </div>
          </div>

          {/* Source and Medium */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <div className="relative">
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Source</option>
                  <option value="Partner Event 2026">Partner Event 2026</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                </select>
                {formData.source && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('source')}
                    className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save source"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
              <div className="relative">
                <select
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Web Form">Web Form</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                </select>
                {formData.medium && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('medium')}
                    className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save medium"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Campaign */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
            <div className="relative">
              <select
                name="campaign"
                value={formData.campaign}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Campaign</option>
                <option value="Partner Enrollment">Partner Enrollment</option>
                <option value="Product Launch">Product Launch</option>
                <option value="Holiday Sale">Holiday Sale</option>
              </select>
              {formData.campaign && (
                <button
                  type="button"
                  onClick={() => handleSaveField('campaign')}
                  className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                  title="Save campaign"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Resi. Address and Office Address */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resi. Address</label>
              <div className="relative">
                <textarea
                  name="resiAddress"
                  value={formData.resiAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Address"
                />
                {formData.resiAddress && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('resiAddress')}
                    className="absolute right-2 top-2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save resi address"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
              <div className="relative">
                <textarea
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Address"
                />
                {formData.officeAddress && (
                  <button
                    type="button"
                    onClick={() => handleSaveField('officeAddress')}
                    className="absolute right-2 top-2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                    title="Save office address"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Remark */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
            <div className="relative">
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Enter remarks"
              />
              {formData.remark && (
                <button
                  type="button"
                  onClick={() => handleSaveField('remark')}
                  className="absolute right-2 top-2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                  title="Save remark"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Pin code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin code</label>
            <div className="relative">
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter pin code"
              />
              {formData.pinCode && (
                <button
                  type="button"
                  onClick={() => handleSaveField('pinCode')}
                  className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                  title="Save pin code"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Enquiry Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry Tags</label>
            <div className="relative">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                placeholder="Search tags"
              />
              {formData.tags && (
                <button
                  type="button"
                  onClick={() => handleSaveField('tags')}
                  className="absolute right-2 top-[50%] -translate-y-1/2 p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition"
                  title="Save tags"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-xs text-green-700">
              Please press comma, tab, or enter key for generating the tag name, or you can also generate a tag by copy and paste with comma separated value.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEnquiryForm;
