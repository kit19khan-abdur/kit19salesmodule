import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ArrowRight, Plus } from 'lucide-react';
import AddFollowup from '../../pages/Enquiries/Forms/AddFollowup';
import AddFollowupForm from '../../pages/Enquiries/Forms/AddFollowupForm';
import PopUpModal from '../PopUpModal/PopUpModal';
import Button from '../common/Button';
import { getLeadConflictionDetailList, getLeadShowData, mergeEnquiryToLead } from '../../utils/enquiry';
import { getSession } from '../../getSession';
import toast from 'react-hot-toast';

const MergeLead  = ({ isOpen, onClose, enquiryData, onMerged }) => {
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedFields, setSelectedFields] = useState({});
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [pendingMerge, setPendingMerge] = useState(null); // holds mergeData for after followup
  const [pendingOpenFollowup, setPendingOpenFollowup] = useState(false); // tracks if followup is part of merge
  // const [followupData, setFollowupData] = useState(null); // stores submitted followup
   const [followupData, setFollowupData] = useState({
          AssignedTo: 0,
          FupValue:  '',
          FollowUpStatus:  0,
          NextStatusDate:  '',
          Remarks:  '',
          Products:  '',
          AmountPaid:  0,
          IsReAssign:  false,
          NotifyBySMS: false,
          NotifyByEmail:  false,
          SmsScheduelDateTime:  '',
          EmailScheduelDateTime: ''			
   }); // stores submitted followup
  const [leadOptions, setLeadOptions] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState(null);
  const [fullLeadData, setFullLeadData] = useState(null);
  const [isLoadingLeadDetails, setIsLoadingLeadDetails] = useState(false);
  const [mergeData, setMergeData] = useState({
    name: '',
    company: '',
    phone: '',
    phoneCode: '',
    mobile1: '',
    mobile1Code: '',
    mobile2: '',
    mobile2Code: '',
    email: '',
    email1: '',
    email2: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    residentialAddress: '',
    officeAddress: '',
  });

  // Fetch lead conflict details when component mounts or enquiryData changes
  useEffect(() => {
    const fetchLeadConflictionDetails = async () => {
      const session = getSession();
      if (!session || !session.TokenId || !session.parentId) {
        toast.error('Session expired. Please login again.');
        return;
      }

      if (!enquiryData || !enquiryData.EnquiryId) {
        return;
      }

      setIsLoadingLeads(true);

      try {
        const details = {
          ParentId: session.parentId,
          EnquiryId: enquiryData.EnquiryId
        };

        const payload = {
          Token: session.TokenId,
          Message: '',
          LoggedUserId: session.userId,
          MAC_Address: '',
          IP_Address: '102.16.32.189',
          Details: JSON.stringify(details),
          BroadcastName: ''
        };

        const response = await getLeadConflictionDetailList(payload);

        if (response && response.Status === 1 && response.Details) {
          // Handle both JSON string and object/array responses
          let leads;
          if (typeof response.Details === 'string') {
            try {
              leads = JSON.parse(response.Details);
            } catch (e) {
              console.error('Error parsing response.Details:', e);
              leads = [];
            }
          } else {
            // Already an object/array
            leads = response.Details;
          }

          // Ensure leads is an array
          if (!Array.isArray(leads)) {
            leads = [];
          }
          
          // Map API response to dropdown options
          const options = leads.map(lead => ({
            id: lead.ID,
            leadNo: lead.LeadNo,
            name: `${lead.PersonName || ''} - Lead #${lead.LeadNo}`,
            data: lead // Store full data for field population
          }));

          setLeadOptions(options);

          // Auto-select first lead if available
          if (options.length > 0) {
            setSelectedLeadId(options[0].id);
          }
        } else {
          toast.error(response?.Message || 'Failed to load lead conflict details');
        }
      } catch (error) {
        console.error('Error fetching lead conflict details:', error);
        toast.error('Failed to load lead conflict details');
      } finally {
        setIsLoadingLeads(false);
      }
    };

    if (isOpen) {
      fetchLeadConflictionDetails();
    }
  }, [isOpen, enquiryData]);

  // Fetch full lead details when selectedLeadId changes
  useEffect(() => {
    const fetchLeadDetails = async () => {
      const session = getSession();
      if (!session || !session.TokenId || !session.parentId) {
        return;
      }

      if (!selectedLeadId) {
        setFullLeadData(null);
        return;
      }

      setIsLoadingLeadDetails(true);

      try {
        const details = {
          LeadId: selectedLeadId,
          ParentId: session.parentId
        };

        const payload = {
          Token: session.TokenId,
          Message: '',
          LoggedUserId: session.userId,
          MAC_Address: '',
          IP_Address: '102.16.32.189',
          Details: JSON.stringify(details),
          BroadcastName: ''
        };

        const response = await getLeadShowData(payload);

        if (response && response.Status === 1 && response.Details) {
          // Handle both JSON string and object responses
          let leadDetails;
          if (typeof response.Details === 'string') {
            try {
              leadDetails = JSON.parse(response.Details);
            } catch (e) {
              console.error('Error parsing lead details:', e);
              leadDetails = {};
            }
          } else {
            leadDetails = response.Details;
          }

          setFullLeadData(leadDetails);
        } else {
          toast.error(response?.Message || 'Failed to load lead details');
          setFullLeadData(null);
        }
      } catch (error) {
        console.error('Error fetching lead details:', error);
        toast.error('Failed to load lead details');
        setFullLeadData(null);
      } finally {
        setIsLoadingLeadDetails(false);
      }
    };

    fetchLeadDetails();
  }, [selectedLeadId]);

  // Get selected lead data - use fullLeadData if available, otherwise fallback to basic data
  const selectedLead = leadOptions.find(lead => lead.id === selectedLeadId);
  const leadData = fullLeadData || selectedLead?.data || {};

  // small list of country codes/short names - extend as needed
  const countryCodes = [
    { code: '+91', short: 'IN', name: 'India' },
    { code: '+1', short: 'US', name: 'United States' },
    { code: '+44', short: 'GB', name: 'United Kingdom' },
    { code: '+61', short: 'AU', name: 'Australia' },
    { code: '+966', short: 'SA', name: 'Saudi Arabia' },
  ];

  // Initialize mergeData phone codes and numbers when lead/enquiry data is available.
  // Avoid using `leadData` object directly in deps because a fallback `{}` creates a new
  // reference each render and would retrigger this effect continuously. Instead depend
  // on stable identifiers and `fullLeadData`, and derive the lead object inside the effect.

 
         



  useEffect(() => {
    const leadObj = fullLeadData || leadOptions.find(lead => lead.id === selectedLeadId)?.data || {};

    setMergeData(prev => ({
      ...prev,
      phone: prev.phone || enquiryData?.MobileNo || leadObj?.MobileNo || '',
      phoneCode: prev.phoneCode || enquiryData?.CountryCode || leadObj?.CountryCode || '',
      mobile1: prev.mobile1 || enquiryData?.MobileNo1 || leadObj?.MobileNo1 || '',
      mobile1Code: prev.mobile1Code || enquiryData?.CountryCode1 || leadObj?.CountryCode1 || '',
      mobile2: prev.mobile2 || enquiryData?.MobileNo2 || leadObj?.MobileNo2 || '',
      mobile2Code: prev.mobile2Code || enquiryData?.CountryCode2 || leadObj?.CountryCode2 || ''
    }));
  }, [fullLeadData, selectedLeadId, enquiryData, leadOptions]);

  // Update followupData when enquiryData changes
  useEffect(() => {
    if(!enquiryData) return;
  
    setFollowupData((prev) => ({
      ...prev,
      AssignedTo: enquiryData.AssignedTo ?? 0,
      FupValue: enquiryData.FupValue ?? "",
      FollowUpStatus: enquiryData.FollowUpStatus ?? 0,
      NextStatusDate: enquiryData.NextStatusDate ?? "",
      Remarks: enquiryData.Remarks ?? "",
      Products: enquiryData.Products ?? "",
      AmountPaid: enquiryData.AmountPaid ?? 0,
      IsReAssign: enquiryData.IsReAssign ?? false,
      NotifyBySMS: enquiryData.NotifyBySMS ?? false,
      NotifyByEmail: enquiryData.NotifyByEmail ?? false,
      SmsScheduelDateTime: enquiryData.SmsScheduleDateTime ?? "",
      EmailScheduelDateTime: enquiryData.EmailScheduleDateTime ?? ""
    }));
  }, [enquiryData]);

  const fieldsList = [
    { 
      id: 'name', 
      enquiry: { label: enquiryData?.PersonName || '', value: enquiryData?.PersonName || '' },
      lead: { label: leadData.PersonName || '', value: leadData.PersonName || '' },
      placeholder: 'Name'
    },
    { 
      id: 'company', 
      enquiry: { label: enquiryData?.CompanyName || '', value: enquiryData?.CompanyName || '' },
      lead: { label: leadData.CompanyName || '', value: leadData.CompanyName || '' },
      placeholder: 'Company'
    },
    { 
      id: 'phone', 
      enquiry: { label: enquiryData?.MobileNo || '', value: enquiryData?.MobileNo || '' },
      lead: { label: leadData.MobileNo || '', value: leadData.MobileNo || '' },
      placeholder: 'Phone'
    },
    { 
      id: 'mobile1', 
      enquiry: { label: enquiryData?.MobileNo1 || '', value: enquiryData?.MobileNo1 || '' },
      lead: { label: leadData.MobileNo1 || '', value: leadData.MobileNo1 || '' },
      placeholder: 'Mobile1'
    },
    { 
      id: 'mobile2', 
      enquiry: { label: enquiryData?.MobileNo2 || '', value: enquiryData?.MobileNo2 || '' },
      lead: { label: leadData.MobileNo2 || '', value: leadData.MobileNo2 || '' },
      placeholder: 'Mobile2'
    },
    { 
      id: 'email', 
      enquiry: { label: enquiryData?.EmailID || '', value: enquiryData?.EmailID || '' },
      lead: { label: leadData.EmailID || '', value: leadData.EmailID || '' },
      placeholder: 'Email'
    },
    { 
      id: 'email1', 
      enquiry: { label: enquiryData?.EmailID1 || '', value: enquiryData?.EmailID1 || '' },
      lead: { label: leadData.EmailID1 || '', value: leadData.EmailID1 || '' },
      placeholder: 'Email1'
    },
    { 
      id: 'email2', 
      enquiry: { label: enquiryData?.EmailID2 || '', value: enquiryData?.EmailID2 || '' },
      lead: { label: leadData.EmailID2 || '', value: leadData.EmailID2 || '' },
      placeholder: 'Email2'
    },
    { 
      id: 'country', 
      enquiry: { label: enquiryData?.Country || '', value: enquiryData?.Country || '' },
      lead: { label: leadData.Country || '', value: leadData.Country || '' },
      placeholder: 'Country'
    },
    { 
      id: 'state', 
      enquiry: { label: enquiryData?.State || '', value: enquiryData?.State || '' },
      lead: { label: leadData.State || '', value: leadData.State || '' },
      placeholder: 'State'
    },
    { 
      id: 'city', 
      enquiry: { label: enquiryData?.City || '', value: enquiryData?.City || '' },
      lead: { label: leadData.City || '', value: leadData.City || '' },
      placeholder: 'City'
    },
    { 
      id: 'pincode', 
      enquiry: { label: enquiryData?.PinCode || '', value: enquiryData?.PinCode || '' },
      lead: { label: leadData.PinCode || '', value: leadData.PinCode || '' },
      placeholder: 'Pincode'
    },
    { 
      id: 'residentialAddress', 
      enquiry: { label: enquiryData?.ResidentialAddress || '', value: enquiryData?.ResidentialAddress || '' },
      lead: { label: leadData.ResidentialAddress || '', value: leadData.ResidentialAddress || '' },
      placeholder: 'Residential Address'
    },
    { 
      id: 'officeAddress', 
      enquiry: { label: enquiryData?.OfficeAddress || '', value: enquiryData?.OfficeAddress || '' },
      lead: { label: leadData.OfficeAddress || '', value: leadData.OfficeAddress || '' },
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
  }
  ;

  const handleMergeDataChange = (fieldId, value) => {
    setMergeData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };


  // New: Open followup form first, then merge after followup is submitted
  const handleMergeAndFollowup = () => {
    //setPendingMerge({ ...mergeData });
    //setPendingOpenFollowup(true);
      // setShowFollowupForm(true);
  };

  const handleOpenFollowupPanel = () => {
    // Save current mergeData before opening followup form
    setPendingMerge({ ...mergeData });
    setPendingOpenFollowup(true);
    setShowFollowupForm(true);
  };

  // Called when followup form is submitted (Save)
  const handleFollowupSave = (data) => {
    console.log('Followup data received:', data);
    
    if (!data || data === undefined) {
      alert('Data is undefined');
      return;
    }

    // Update the followupData state
    setFollowupData(data);

    // After followup is submitted, trigger merge with followup data
    handleMergeToLead(true, data, mergeData);
    
    // Close the followup form
    setShowFollowupForm(false);
    setPendingMerge(null);
    setPendingOpenFollowup(false);
  };

  // openFollowup: true if called after followup, false for direct merge
  // followupFormData: data from followup form (if any)
  // mergeDataOverride: mergeData to use (if any)
  const handleMergeToLead = async (openFollowup = false, followupFormData = null, mergeDataOverride = null) => {
    const session = getSession();
    if (!session || !session.TokenId) {
      toast.error('Session expired. Please login again.');
      return;
    }

    if (!selectedLeadId) {
      toast.error('Please select a lead to merge into.');
      return;
    }

    setIsMerging(true);
    setMergeError(null);


    try {
      const md = mergeDataOverride || mergeData;
      const enquiry = {
        EnquiryId: enquiryData?.EnquiryId || 0,
        PersonName: md.name || '',
        PersonImage: '',
        CountryCode1: md.phoneCode || '',
        CountryCode2: md.mobile1Code || '',
        CountryCode3: md.mobile2Code || '',
        MobileNo1: md.phone || '',
        MobileNo2: md.mobile1 || '',
        MobileNo3: md.mobile2 || '',
        EmailId1: md.email || '',
        EmailId2: md.email1 || '',
        EmailId3: md.email2 || '',
        Medium: '',
        Campaign: '',
        SourceName: '',
        InitialRemarks: '',
        CompanyName: md.company || '',
        CountryName: md.country || '',
        State: md.state || '',
        City: md.city || '',
        Pincode: md.pincode || '',
        ResidentialAddress: md.residentialAddress || '',
        OficeAddress: md.officeAddress || '',
        EnquiryTags: '',
        WhereAddress: '',
        lstCustomField: []
      };

      // If followupFormData is provided, use it for followUp, else use default
      let followUp;
      if (followupFormData) {
        followUp = {
          LeadId: selectedLeadId || 0,
          AssignedTo: followupFormData.AssignedTo || session.userId || 0,
          ParentID: session.parentId || 0,
          FupValue: followupFormData.FupValue || '',
          FollowUpStatus: followupFormData.FollowUpStatus || 0,
          NextStatusDate: followupFormData.NextStatusDate || '',
          Remarks: followupFormData.Remarks || '',
          Products: followupFormData.Products || '',
          AmountPaid: followupFormData.AmountPaid || 0,
          CreatedBy: session.userId || 0,
          IsReAssign: followupFormData.IsReAssign || false,
          NotifyBySMS: followupFormData.NotifyBySMS || false,
          NotifyByEmail: followupFormData.NotifyByEmail || false,
          SmsScheduelDateTime: followupFormData.SmsScheduelDateTime || '',
          EmailScheduelDateTime: followupFormData.EmailScheduelDateTime || ''
        };
      } else {
        followUp = {
          LeadId: selectedLeadId || 0,
          AssignedTo: session.userId || 0,
          ParentID: session.parentId || 0,
          FupValue: '',
          FollowUpStatus: 0,
          NextStatusDate: '',
          Remarks: '',
          Products: '',
          AmountPaid: 0,
          CreatedBy: session.userId || 0,
          IsReAssign: false,
          NotifyBySMS: false,
          NotifyByEmail: false,
          SmsScheduelDateTime: '',
          EmailScheduelDateTime: ''
        };
      }

      const enquiryToLead = {
        LeadId: selectedLeadId || 0,
        Enquiry: enquiry,
        followUp: followUp
      };

      // Some backend endpoints expect the Details field as an object (not a JSON string).
      // Use a plain object here to match the pattern used by other successful calls
      // (e.g. GetEnquiryList passes Details as an object). If the server requires a
      // string, we can switch back, but 417 responses have been observed when stringifying.
      const payload = {
        Token: session.TokenId,
        Message: '',
        LoggedUserId: session.userId,
        MAC_Address: '',
        IP_Address: '102.16.32.189',
        Details: enquiryToLead,
        BroadcastName: ''
      };

      // debug: print payload to browser console (dev only) so we can inspect what is sent
      try {
        // eslint-disable-next-line no-console
        console.debug('mergeEnquiryToLead payload:', payload);
      } catch (e) {
        // ignore console errors
      }

      const response = await mergeEnquiryToLead(payload);
      if (response && response.Status === 1) {
        toast.success(response.Message || 'Merged successfully');
        // notify parent (if provided) so it can refresh lists or update UI
        try {
          if (typeof onMerged === 'function') {
            onMerged(response);
          }
        } catch (cbErr) {
          console.error('onMerged callback error:', cbErr);
        }

        // If this was a direct merge (no followup), close. If this was a followup flow, close after merge.
        onClose();
      } else {
        setMergeError(response?.Message || 'Merge failed');
        toast.error(response?.Message || 'Merge failed');
      }
    } catch (error) {
      console.error('Merge error:', error);
      setMergeError(error?.message || 'Merge failed');
      toast.error(error?.message || 'Merge failed');
    } finally {
      setIsMerging(false);
    }
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
              disabled={isLoadingLeads}
            >
              {isLoadingLeads ? (
                <option>Loading leads...</option>
              ) : leadOptions.length === 0 ? (
                <option>No conflicting leads found</option>
              ) : (
                <>
                  <option value="">Select a lead</option>
                  {leadOptions.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </>
              )}
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

                {/* Merge Field (Input / Select for phone numbers) */}
                <div className="px-6 py-2">
                  {['phone', 'mobile1', 'mobile2'].includes(field.id) ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={mergeData[`${field.id}Code`] || ''}
                        onChange={(e) => handleMergeDataChange(`${field.id}Code`, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>
                            {`${c.code} (${c.short}) ${c.name}`}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={mergeData[field.id]}
                        onChange={(e) => handleMergeDataChange(field.id, e.target.value)}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {/* Display country short name if selected */}
                      <div className="text-sm text-gray-600 pl-2">
                        {(() => {
                          const code = mergeData[`${field.id}Code`];
                          const found = countryCodes.find(cc => cc.code === code);
                          return found ? found.short : '';
                        })()}
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={mergeData[field.id]}
                      onChange={(e) => handleMergeDataChange(field.id, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
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
          <button
            onClick={() => handleMergeToLead(false)}
            disabled={isMerging}
            className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium ${isMerging ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isMerging ? 'Merging...' : 'Merge to Lead'}
          </button>
          <button
            type="button"
            onClick={() => handleOpenFollowupPanel(true)}
            className="px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition font-medium"
          >
            open Add Followup
          </button>
          <button
            type="button"
            onClick={() => handleMergeToLead(true, followupData, null)}
            disabled={isMerging}
            className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium ${isMerging ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isMerging ? 'Merging...' : 'Merge & Add Follow up'}
          </button>
        </div>
      </div>

      <PopUpModal
        isOpen={showFollowupForm}
        
        title="Add Lead Follow-up"
        size="lg"
        footer={null}
        header={null}
      >

       <div style={{ overflowY: 'auto' }}>
         
        <AddFollowupForm
          selectedCount={enquiryData}
          onSave={handleFollowupSave}
          onCancel={() => {
            setShowFollowupForm(false);
            setPendingMerge(null);
            setPendingOpenFollowup(false);
          }}
       />
        </div>
      </PopUpModal>


    </>
  );
};

export default MergeLead;
