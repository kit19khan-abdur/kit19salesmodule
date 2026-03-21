import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { CountryCodeSelect } from '../common';
import { serviceInstance } from '../../axiosinstance';
import { getSession } from '../../getSession';

const EditEnquiryForm = ({ enquiry, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    mobile: '',
    countryCode: '+91',
    email: '',
    country: '',
    state: '',
    city: '',
    source: '',
    medium: 'Web Form',
    campaign: '',
    resiAddress: '',
    officeAddress: '',
    remark: '',
    pinCode: '0',
    tags: ''
  });
  // If an `enquiry` prop is provided, pre-fill common fields synchronously so
  // inputs are populated immediately when the modal opens. The fetch below
  // will still run and override with more complete details if available.
  useEffect(() => {
    if (!enquiry) return;
    setFormData(prev => ({
      ...prev,
      name: enquiry.PersonName || enquiry.PersonName || prev.name,
      company: enquiry.CompanyName || enquiry.Company || prev.company,
      mobile: enquiry.MobileNo || enquiry.Mobile || prev.mobile,
      countryCode: enquiry.CountryCode || prev.countryCode,
      email: enquiry.EmailId || enquiry.EmailID || prev.email,
      country: enquiry.Country || prev.country,
      state: enquiry.State || prev.state,
      city: enquiry.City || prev.city,
      source: enquiry.SourceName || enquiry.Source || prev.source
    }));
  }, [enquiry]);
  // Fetch EnquiryDetails by EnquiryID and bind to form fields
  useEffect(() => {
    // Use either ID or EnquiryId for compatibility
    const enquiryId = enquiry?.ID || enquiry?.EnquiryId;
    if (!enquiryId) return;
    const fetchEnquiryDetails = async () => {
      try {
        const session = getSession();
        const requestData = {
          Token: session.token,
          Details: JSON.stringify({ EnquiryID: enquiryId })
        };
        const response = await serviceInstance.post('http://localhost:62194/UserCRM/getEnquiryDetails', requestData);
        if (response?.data?.Status === 1 && response.data.Details) {
          // Details can be an array or object - handle both
          const details = Array.isArray(response.data.Details)
            ? response.data.Details[0]
            : response.data.Details;
          if (details) {
            setFormData({
              name: details.PersonName || '',
              company: details.CompanyName || '',
              mobile: details.MobileNo || '',
              countryCode: details.CountryCode || '+91',
              email: details.EmailId || details.EmailID || '',
              country: details.Country || '',
              state: details.State || '',
              city: details.City || '',
              source: details.SourceName || '',
              medium: details.MediumName || '',
              campaign: details.CampaignName || '',
              resiAddress: details.ResidentialAddress || '',
              officeAddress: details.OfficeAddress || '',
              remark: details.InitialRemarks || details.Remark || '',
              pinCode: details.Pincode || details.PinCode || '0',
              tags: details.Tags || '',
              personImage: details.PersonImage || '',
              address: details.Address || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching enquiry details:', error);
      }
    };
    fetchEnquiryDetails();
  }, [enquiry?.ID, enquiry?.EnquiryId]);

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
  const [isSaving, setIsSaving] = useState(false);

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
      if (!formData?.country) {
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
      if (!formData?.state) {
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enquiryId = enquiry?.ID || enquiry?.EnquiryId;
    if (!enquiryId) {
      alert('Enquiry ID is missing');
      return;
    }
    setIsSaving(true);
    try {
      const session = getSession();
      // Map formData to EnquiryUpdate_BO model
      const updatePayload = {
        EnquiryId: enquiryId,
        PersonName: formData.name || '',
        PersonImage: formData.personImage || '',
        CompanyName: formData.company || '',
        MobileNo: formData.mobile || '',
        Country: formData.country || '',
        State: formData.state || '',
        City: formData.city || '',
        ResidentialAddress: formData.resiAddress || '',
        OfficeAddress: formData.officeAddress || '',
        SourceName: formData.source || '',
        MediumName: formData.medium || '',
        CampaignName: formData.campaign || '',
        Address: formData.address || '',
        InitialRemarks: formData.remark || '',
        EmailId: formData.email || '',
        Pincode: formData.pinCode || '0',
        ParentId: session.parentId || 0,
        CustomField: []
      };
      const requestData = {
        Token: session.token,
        Details: JSON.stringify(updatePayload)
      };
      const response = await serviceInstance.post('http://localhost:62194/UserCRM/UpdateEnquiryData', requestData);
      if (response?.data?.Status === 1) {
        alert('Enquiry updated successfully!');
        if (onSubmit) onSubmit(formData);
        if (onClose) onClose();
      } else {
        alert(response?.data?.Message || 'Failed to update enquiry');
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
      alert('Something went wrong while updating enquiry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveField = (fieldName) => {
    console.log(`Saving ${fieldName}:`, formData[fieldName]);
    alert(`${fieldName} saved successfully!`);
  };


  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form id="editEnquiryForm" onSubmit={handleSubmit}>
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
                  <CountryCodeSelect
                    value={formData.countryCode}
                    onChange={handleChange}
                    name="countryCode"
                    size="md"
                  />
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
                  disabled={isLoadingSource}
                >
                  <option value="">
                    {isLoadingSource ? 'Loading sources...' : 'Select Source'}
                  </option>
                  {sourceOptions.map((source, index) => {
                    // Try multiple possible field names for ID and Name
                    const sourceId = source.SourceId || source.Id || source.id || source.SourceSettingId || index;
                    const sourceName = source.SourceName || source.Name || source.name || source.SourceSettingName || 'Unknown';
                    
                    return (
                      <option key={sourceId} value={sourceId}>
                        {sourceName}
                      </option>
                    );
                  })}
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
                  disabled={isLoadingMedium}
                >
                  <option value="">
                    {isLoadingMedium ? 'Loading mediums...' : 'Select Medium'}
                  </option>
                  {mediumOptions.map((medium, index) => {
                    // Try multiple possible field names for ID and Name
                    const mediumId = medium.MediumId || medium.Id || medium.id || medium.MediumSettingId || index;
                    const mediumName = medium.MediumName || medium.Name || medium.name || medium.MediumSettingName || 'Unknown';
                    
                    return (
                      <option key={mediumId} value={mediumId}>
                        {mediumName}
                      </option>
                    );
                  })}
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
