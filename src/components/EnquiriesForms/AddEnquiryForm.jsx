import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Save } from 'lucide-react';
import { CountryCodeSelect } from '../common';
import { serviceInstance } from '../../axiosinstance';
import { getSession } from '../../getSession';

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

  const [sourceOptions, setSourceOptions] = useState([]);
  const [isLoadingSource, setIsLoadingSource] = useState(false);

  const [mediumOptions, setMediumOptions] = useState([]);
  const [isLoadingMedium, setIsLoadingMedium] = useState(false);

  const [campaignOptions, setCampaignOptions] = useState([]);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);

  const [stateOptions, setStateOptions] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const [cityOptions, setCityOptions] = useState([]);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const [userOptions, setUserOptions] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch source settings on component mount
  useEffect(() => {
    const fetchSourceSettings = async () => {
      try {
        setIsLoadingSource(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({
            ParentId: session.parentId // 0 for root level sources
          })
        };

        const response = await serviceInstance.post('/Common/GetUserSourceSettingsByParentId', requestData);

        if (response?.data?.Status === 1) {
          const sources = response.data.Details || [];
          console.log('Source settings response:', sources); // Debug log
          setSourceOptions(sources);
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch source settings:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching source settings:', error);
      } finally {
        setIsLoadingSource(false);
      }
    };

    fetchSourceSettings();
  }, []);

  // Fetch medium settings on component mount
  useEffect(() => {
    const fetchMediumSettings = async () => {
      try {
        setIsLoadingMedium(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({
            ParentId: session.parentId // 0 for root level medium
          })
        };

        const response = await serviceInstance.post('/Common/GetUserMediumSettingsByParentId', requestData);

        if (response?.data?.Status === 1) {
          const mediums = response.data.Details || [];
          console.log('Medium settings response:', mediums); // Debug log
          setMediumOptions(mediums);
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch medium settings:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching medium settings:', error);
      } finally {
        setIsLoadingMedium(false);
      }
    };

    fetchMediumSettings();
  }, []);

  // Fetch campaign settings on component mount
  useEffect(() => {
    const fetchCampaignSettings = async () => {
      try {
        setIsLoadingCampaign(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({
            ParentId: session.parentId // 0 for root level campaign
          })
        };

        const response = await serviceInstance.post('/Common/GetUserCampaignSettingsByParentId', requestData);

        if (response?.data?.Status === 1) {
          const campaigns = response.data.Details || [];
          console.log('Campaign settings response:', campaigns); // Debug log
          setCampaignOptions(campaigns);
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch campaign settings:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching campaign settings:', error);
      } finally {
        setIsLoadingCampaign(false);
      }
    };

    fetchCampaignSettings();
  }, []);

  // Fetch country list on component mount
  useEffect(() => {
    const fetchCountryList = async () => {
      try {
        setIsLoadingCountry(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({})
        };

        const response = await serviceInstance.post('/Common/GetCountryList', requestData);

        if (response?.data?.Status === 1) {
          const countries = response.data.Details || [];
          console.log('Country list response:', countries); // Debug log
          setCountryOptions(countries);
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch country list:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching country list:', error);
      } finally {
        setIsLoadingCountry(false);
      }
    };

    fetchCountryList();
  }, []);

  // Fetch state list when country changes
  useEffect(() => {
    const fetchStateList = async () => {
      if (!formData.country) {
        // Clear states if no country is selected
        setStateOptions([]);
        setFormData(prev => ({ ...prev, state: '', city: '' })); // Also clear city
        return;
      }

      try {
        setIsLoadingState(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({
            CountryId: formData.country
          })
        };

        const response = await serviceInstance.post('/Common/GetStateListByCountryId', requestData);

        if (response?.data?.Status === 1) {
          const states = response.data.Details || [];
          console.log('State list response:', states); // Debug log
          setStateOptions(states);
          // Clear selected state and city when country changes
          setFormData(prev => ({ ...prev, state: '', city: '' }));
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch state list:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching state list:', error);
      } finally {
        setIsLoadingState(false);
      }
    };

    fetchStateList();
  }, [formData.country]); // Trigger when country changes

  // Fetch city list when state changes
  useEffect(() => {
    const fetchCityList = async () => {
      if (!formData.state) {
        // Clear cities if no state is selected
        setCityOptions([]);
        setFormData(prev => ({ ...prev, city: '' }));
        return;
      }

      try {
        setIsLoadingCity(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({
            StateId: formData.state
          })
        };

        const response = await serviceInstance.post('/Common/GetCityListByStateId', requestData);

        if (response?.data?.Status === 1) {
          const cities = response.data.Details || [];
          console.log('City list response:', cities); // Debug log
          setCityOptions(cities);
          // Clear selected city when state changes
          setFormData(prev => ({ ...prev, city: '' }));
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch city list:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching city list:', error);
      } finally {
        setIsLoadingCity(false);
      }
    };

    fetchCityList();
  }, [formData.state]); // Trigger when state changes

  // Fetch user list on component mount
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        setIsLoadingUsers(true);
        const session = getSession();

        const requestData = {
          Token: session.token,
          Details: JSON.stringify({
            UserId: session.userId
          })
        };

        const response = await serviceInstance.post('/Common/GetUserListByUserId', requestData);

        if (response?.data?.Status === 1) {
          const users = response.data.Details || [];
          console.log('User list response:', users); // Debug log
          setUserOptions(users);
        } else if (response?.data?.Status === -1) {
          console.error('Invalid token');
        } else {
          console.error('Failed to fetch user list:', response?.data?.Message);
        }
      } catch (error) {
        console.error('Error fetching user list:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUserList();
  }, []);

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

  const funcToCheckPrefixZero = (mobileNo, whichMobile) => {
    let errorMSG = '';
    if (mobileNo) {
      const parts = mobileNo.split(' ');
      if (parts.length > 1) {
        const num = parts[1].trim();
        if (num.charAt(0) === '0') {
          if (whichMobile === 1) errorMSG = 'Please remove 0 prefix from first mobile no \n ';
          else if (whichMobile === 2) errorMSG = 'Please remove 0 prefix from second mobile no \n ';
          else errorMSG = 'Please remove 0 prefix from third mobile no \n ';
        }
      }
    }
    return errorMSG;
  };

  const validateEnquiry = () => {
    let ErrMsg = '';
    const RegexEmailID = /^[\w-.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const InRegexMobileNo = /^(\+[0-9]{1,5})\s([0-9]{10})$/;
    const RegexMobileNo = /^(\+[0-9]{1,5})\s([0-9]{5,15})$/;

    const personName = (formData.name || '').trim();
    const mobiles = formData.mobiles || [];
    const emails = formData.emails || [];

    const mobileVals = mobiles.map(m => `${(m.countryCode || '').trim()} ${(m.number || '').trim()}`.trim());
    const emailVals = emails.map(e => (e || '').trim());

    const mobile1 = mobileVals[0] || '';
    const mobile2 = mobileVals[1] || '';
    const mobile3 = mobileVals[2] || '';

    const emailId1 = emailVals[0] || '';
    const emailId2 = emailVals[1] || '';
    const emailId3 = emailVals[2] || '';

    if (personName === '') ErrMsg += 'Please enter Person Name\n';

    // Owner: if addToLead is checked require selectedUser
    if (formData.addToLead && (!formData.selectedUser || formData.selectedUser === '')) {
      ErrMsg += 'Please select owner\n';
    }

    // At least one contact (mobile or email)
    if (!mobile1 && !mobile2 && !mobile3 && !emailId1 && !emailId2 && !emailId3) {
      ErrMsg += 'Please enter atleast one Mobile no.(with Country Code) or Email-ID\n';
    } else {
      // mobile1 validations
      const ccode1 = mobile1.split(' ')[0] || '';
      if (ccode1 === '+91' || ccode1 === '') {
        if (mobile1 && !InRegexMobileNo.test(mobile1)) {
          ErrMsg += 'Please Enter Valid 10 Digits First Mobile No. with Country Code\n';
        }
        if (mobile1 && InRegexMobileNo.test(mobile1)) {
          ErrMsg += funcToCheckPrefixZero(mobile1, 1);
        }
      } else if (mobile1 && !RegexMobileNo.test(mobile1)) {
        ErrMsg += 'Please Enter Valid First Mobile No. with Country Code\n';
      }
      if (ccode1 !== '+91') {
        if (mobile1 && RegexMobileNo.test(mobile1)) {
          ErrMsg += funcToCheckPrefixZero(mobile1, 1);
        }
      }

      // mobile2 validations
      const ccode2 = mobile2.split(' ')[0] || '';
      if (ccode2 === '+91') {
        if (mobile2 && !InRegexMobileNo.test(mobile2)) {
          ErrMsg += 'Please Enter Valid 10 Digits Second Mobile No. with Country Code\n';
        }
        if (mobile2 && InRegexMobileNo.test(mobile2)) {
          ErrMsg += funcToCheckPrefixZero(mobile2, 2);
        }
      } else if (mobile2 && !RegexMobileNo.test(mobile2)) {
        ErrMsg += 'Please Enter Valid Second Mobile No. with Country Code\n';
      }
      if (ccode2 !== '+91') {
        if (mobile2 && RegexMobileNo.test(mobile2)) {
          ErrMsg += funcToCheckPrefixZero(mobile2, 2);
        }
      }

      // mobile3 validations
      const ccode3 = mobile3.split(' ')[0] || '';
      if (ccode3 === '+91') {
        if (mobile3 && !InRegexMobileNo.test(mobile3)) {
          ErrMsg += 'Please Enter Valid 10 Digits Third Mobile No. with Country Code\n';
        }
        if (mobile3 && InRegexMobileNo.test(mobile3)) {
          ErrMsg += funcToCheckPrefixZero(mobile3, 3);
        }
      } else if (mobile3 && !RegexMobileNo.test(mobile3)) {
        ErrMsg += 'Please Enter Valid Third Mobile No. with Country Code\n';
      }
      if (ccode3 !== '+91') {
        if (mobile3 && RegexMobileNo.test(mobile3)) {
          ErrMsg += funcToCheckPrefixZero(mobile3, 3);
        }
      }

      // email validations
      if ((emailId1 && !RegexEmailID.test(emailId1)) || (emailId2 && !RegexEmailID.test(emailId2)) || (emailId3 && !RegexEmailID.test(emailId3))) {
        ErrMsg += 'Please Enter Valid Email-ID\n';
      }
    }

    if (!formData.source || formData.source === '') {
      ErrMsg += 'Please select Source\n';
    }

    if (ErrMsg) {
      alert(ErrMsg);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEnquiry()) return;
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
                          <CountryCodeSelect
                            value={mobile.countryCode}
                            onChange={(e) => handleMobileChange(index, 'countryCode', e.target.value)}
                            name={`countryCode-${index}`}
                            size="md"
                          />
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
                    disabled={isLoadingSource}
                  >
                    <option value="">
                      {isLoadingSource ? 'Loading sources...' : 'Select Source (Required)'}
                    </option>
                    {sourceOptions.map((source, index) => {
                      // Try multiple possible field names for ID and Name
                      const sourceId = source.Code || source.Id || source.id || source.SourceSettingId || index;
                      const sourceName = source.Text || source.Name || source.name || source.SourceSettingName || 'Unknown';
                      
                      return (
                        <option key={sourceId} value={sourceId}>
                          {sourceName}
                        </option>
                      );
                    })}  
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
                    disabled={isLoadingMedium}
                  >
                    <option value="">
                      {isLoadingMedium ? 'Loading mediums...' : 'Select Medium'}
                    </option>
                    {mediumOptions.map((medium, index) => {
                      // Try multiple possible field names for ID and Name
                      const mediumId = medium.Code || medium.Id || medium.id || medium.MediumSettingId || index;
                      const mediumName = medium.Text || medium.Name || medium.name || medium.MediumSettingName || 'Unknown';
                      
                      return (
                        <option key={mediumId} value={mediumId}>
                          {mediumName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="campaign"
                    value={formData.campaign}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    disabled={isLoadingCampaign}
                  >
                    <option value="">
                      {isLoadingCampaign ? 'Loading campaigns...' : 'Select Campaign'}
                    </option>
                    {campaignOptions.map((campaign, index) => {
                      // Using Code and Text as specified in the API response structure
                      const campaignId = campaign.Code || campaign.Id || campaign.id || index;
                      const campaignName = campaign.Text || campaign.Name || campaign.name || 'Unknown';
                      
                      return (
                        <option key={campaignId} value={campaignId}>
                          {campaignName}
                        </option>
                      );
                    })}
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
                    disabled={isLoadingCountry}
                  >
                    <option value="">
                      {isLoadingCountry ? 'Loading countries...' : 'Select Country'}
                    </option>
                    {countryOptions.map((country, index) => {
                      // Using Id and Text as specified in the API response structure
                      const countryId = country.Id || country.id || index;
                      const countryName = country.Text || country.Name || country.name || 'Unknown';
                      
                      return (
                        <option key={countryId} value={countryId}>
                          {countryName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    disabled={!formData.country || isLoadingState}
                  >
                    <option value="">
                      {!formData.country 
                        ? 'Select Country First' 
                        : isLoadingState 
                        ? 'Loading states...' 
                        : 'Select State'}
                    </option>
                    {stateOptions.map((state, index) => {
                      // Using Id and Text as specified in the API response structure
                      const stateId = state.Id || state.id || index;
                      const stateName = state.Text || state.Name || state.name || 'Unknown';
                      
                      return (
                        <option key={stateId} value={stateId}>
                          {stateName}
                        </option>
                      );
                    })}
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
                    disabled={!formData.state || isLoadingCity}
                  >
                    <option value="">
                      {!formData.state 
                        ? 'Select State First' 
                        : isLoadingCity 
                        ? 'Loading cities...' 
                        : 'Select City'}
                    </option>
                    {cityOptions.map((city, index) => {
                      // Using Id and Text as specified in the API response structure
                      const cityId = city.Id || city.id || index;
                      const cityName = city.Text || city.Name || city.name || 'Unknown';
                      
                      return (
                        <option key={cityId} value={cityId}>
                          {cityName}
                        </option>
                      );
                    })}
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
                      disabled={isLoadingUsers}
                    >
                      <option value="">
                        {isLoadingUsers ? 'Loading users...' : 'Select User'}
                      </option>
                      {userOptions.map((user, index) => {
                        // Using Code and Text as specified in the API response structure
                        const userId = user.Code || user.Id || user.id || index;
                        const userName = user.Text || user.Name || user.name || 'Unknown';
                        
                        return (
                          <option key={userId} value={userId}>
                            {userName}
                          </option>
                        );
                      })}
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
