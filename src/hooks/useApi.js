import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {axiosinstance} from '../axiosinstance';
import API_ENDPOINTS from '../config/apiEndpoints';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/helpers';

// ========== ENQUIRIES ==========

export const useEnquiries = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['enquiries', filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await axiosinstance.get(`${API_ENDPOINTS.ENQUIRIES.LIST}?${params}`);
        return response.data;
      } catch (err) {
        // Fallback to mock data for local/dev when API unavailable
        const now = new Date();
        const mock = Array.from({ length: 12 }).map((_, i) => ({
          id: 1000 + i,
          personName: ['chandan mahajan','rajendra narode','sudhakar mahajan','ravindra chanke s','rahul shrof sry2','IVRCALL','dn tiwari','alok kumar','sneha patel','mohit singh','pankaj borse','raj kapoor'][i % 12],
          mobile: ['+91 8349863588','+91 6267936172','+91 8390373742','+91 8770691613','+91 9827727117','+91 9770030806','+91 9876543210','+91 9123456789','+91 9988776655','+91 9012345678','+91 8899001122','+91 7700111222'][i % 12],
          email: `user${i}@example.com`,
          source: ['Walk-In','IVR CALL','Website','Referral'][i % 4],
          type: i % 3 === 0 ? 'Lead' : 'Open',
          createdBy: ['47212-Anilkoli','47212-pankaj borse','kapilsomaiya1055358'][i % 3],
          createdAt: new Date(now.getTime() - i * 1000 * 60 * 60 * 24).toISOString(),
          remarks: i % 2 === 0 ? 'Remarks' : 'Answered Call',
          company: ['Acme Corp','Global Solutions','Sunrise Pvt Ltd','TechWorks','Bright Minds','IVR Systems','Tiwari Co','Kumar & Sons','Patel Traders','Mohit LLC','Borse Industries','Kapoor Enterprises'][i % 12],
          address: ['123 MG Road, Pune','45 Nehru St, Mumbai','12 Park Ave, Delhi','88 Lakeview, Bangalore','7 Marine Dr, Chennai','Sector 12, Noida','Plot 9, Lucknow','Sector 5, Gurgaon','98 High St, Surat','22 Rose St, Jaipur','5 Broadway, Kolkata','33 Hill Rd, Ahmedabad'][i % 12],
          country: ['India','India','India','India','India','India','India','India','India','India','India','India'][i % 12],
          state: ['Maharashtra','Maharashtra','Delhi','Karnataka','Tamil Nadu','Uttar Pradesh','Uttar Pradesh','Haryana','Gujarat','Rajasthan','West Bengal','Gujarat'][i % 12],
          city: ['Pune','Mumbai','Delhi','Bengaluru','Chennai','Noida','Lucknow','Gurgaon','Surat','Jaipur','Kolkata','Ahmedabad'][i % 12],
          pincode: ['411001','400001','110001','560001','600001','201301','226001','122001','395003','302001','700001','380001'][i % 12]
        }));

        return {
          data: mock,
          totalItems: mock.length,
          totalPages: 1
        };
      }
    },
    ...options
  });
};

export const useEnquiry = (id, options = {}) => {
  return useQuery({
    queryKey: ['enquiry', id],
    queryFn: async () => {
      const response = await axiosinstance.get(API_ENDPOINTS.ENQUIRIES.GET(id));
      return response.data;
    },
    enabled: !!id,
    ...options
  });
};

export const useCreateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      // Map local form data to UserCRM/AddEnquiry payload
      const token = process.env.REACT_APP_USERCRM_TOKEN || 'YOUR_TOKEN';
      const details = {
        EnquiryId: data.EnquiryId || 0,
        PersonName: data.name || data.personName || '',
        PersonImage: data.avatarFileName || data.PersonImage || '',
        CountryCode1: data.countryCode || data.CountryCode || data.CountryCode1 || '+91',
        MobileNo1: data.phone || data.mobile || data.MobileNo || '',
        EmailId1: data.email || data.EmailID || '',
        SourceName: data.source || data.SourceName || '',
        CountryCode2: data.countryCode2 || data.CountryCode2 || '',
        MobileNo2: data.mobile2 || data.MobileNo2 || '',
        CountryCode3: data.countryCode3 || data.CountryCode3 || '',
        MobileNo3: data.mobile3 || data.MobileNo3 || '',
        EmailId2: data.email1 || data.EmailID1 || '',
        EmailId3: data.email2 || data.EmailID2 || '',
        Medium: data.medium || data.Medium || '',
        Campaign: data.campaign || data.Campaign || '',
        InitialRemarks: data.remarks || data.InitialRemarks || data.remark || '',
        CompanyName: data.company || data.CompanyName || '',
        CountryName: data.country || data.Country || data.CountryName || '',
        State: data.state || data.State || '',
        City: data.city || data.City || '',
        Pincode: data.pinCode || data.pincode || data.PinCode || '',
        ResidentialAddress: data.residentialAddress || data.residentialAddress || '',
        OficeAddress: data.officialAddress || data.officeAddress || data.OficeAddress || '',
        ParentId: data.parentId || data.ParentId || 0,
        CreatedBy: data.userId || data.CreatedBy || null,
        WhereAddress: data.whereAddress || '',
        WhereLatitude: data.whereLatitude || 0.0,
        WhereLongitude: data.whereLongitude || 0.0,
        EnquiryTags: Array.isArray(data.tags) ? data.tags.join(',') : (typeof data.tags === 'string' ? data.tags : ''),
        lstCustomField: []
      };

      // Map custom fields if provided
      if (data.customFields) {
        if (Array.isArray(data.customFields)) {
          details.lstCustomField = data.customFields.map(cf => ({ FieldId: cf.FieldId || 0, FieldName: cf.FieldName || cf.label || '', FieldValue: cf.FieldValue || cf.value || '' }));
        } else if (typeof data.customFields === 'object') {
          details.lstCustomField = Object.entries(data.customFields).map(([k, v], idx) => ({ FieldId: 0, FieldName: String(k), FieldValue: v }));
        }
      }

      const body = { Token: token, Details: details };
      const response = await axiosinstance.post('UserCRM/AddEnquiry', body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useUpdateEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosinstance.put(API_ENDPOINTS.ENQUIRIES.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['enquiry', variables.id] });
      toast.success('Enquiry updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useDeleteEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axiosinstance.delete(API_ENDPOINTS.ENQUIRIES.DELETE(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiry deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useMergeEnquiries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.ENQUIRIES.MERGE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Enquiries merged successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== ENQUIRY CUSTOM FIELDS & PREFERENCES ==========

export const useEnquiryCustomFields = (options = {}) => {
  return useQuery({
    queryKey: ['enquiryCustomFields'],
    queryFn: async () => {
      const response = await axiosinstance.get(API_ENDPOINTS.CUSTOM_FIELDS.BY_ENTITY('enquiry'));
      return response.data;
    },
    ...options
  });
};

export const useCreateCustomField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.CUSTOM_FIELDS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiryCustomFields'] });
      toast.success('Custom field created');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useUpdateCustomField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosinstance.put(API_ENDPOINTS.CUSTOM_FIELDS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiryCustomFields'] });
      toast.success('Custom field updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useDeleteCustomField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosinstance.delete(API_ENDPOINTS.CUSTOM_FIELDS.DELETE(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiryCustomFields'] });
      toast.success('Custom field deleted');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useEnquiryColumnPrefs = (userId, options = {}) => {
  return useQuery({
    queryKey: ['enquiryColumns', userId],
    queryFn: async () => {
      const response = await axiosinstance.get(`/users/${userId}/preferences/enquiries-columns`);
      return response.data;
    },
    enabled: !!userId,
    ...options
  });
};

export const useSaveEnquiryColumnPrefs = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prefs) => {
      const response = await axiosinstance.post(`/users/${userId}/preferences/enquiries-columns`, prefs);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiryColumns', userId] });
      toast.success('Column preferences saved');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useBulkEnquiries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, action, payload, all = false, filters = {} }) => {
      const body = { ids, action, payload, all, filters };
      const response = await axiosinstance.post('/enquiries/bulk', body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast.success('Bulk action completed');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== LEADS ==========

export const useLeads = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams(filters).toString();
        const response = await axiosinstance.get(`${API_ENDPOINTS.LEADS.LIST}?${params}`);
        return response.data;
      } catch (err) {
        // Fallback to mock data for local/dev when API unavailable
        const now = new Date();
        const mock = Array.from({ length: 12 }).map((_, i) => ({
          id: 2000 + i,
          personName: ['Vijay Achar','Rahul Sharma','Kavita Singh','Suresh Patel','Amit Kumar','Neha Gupta','Rohan Das','Pooja Reddy','Anil Joshi','Sunita Rao','Vikram Roy','Maya Nair'][i % 12],
          mobile: ['+91 916232933037','+91 9663556377','+91 9663941181','+91 9980879009','+91 9743681177','+91 9148335368','+91 9876543210','+91 9123456789','+91 9988776655','+91 9012345678','+91 8899001122','+91 7700111222'][i % 12],
          countryCode: ['+91','+91','+91','+91','+91','+91','+91','+91','+91','+91','+91','+91'][i % 12],
          email: `lead${i}@example.com`,
          source: ['Chat','Website','Referral','Walk-In'][i % 4],
          type: i % 3 === 0 ? 'Converted' : 'Open',
          createdBy: ['47212-Anilkoli','47212-pankaj borse','kapilsomaiya1055358'][i % 3],
          createdAt: new Date(now.getTime() - i * 1000 * 60 * 60 * 24).toISOString(),
          remarks: i % 2 === 0 ? 'Initial contact' : 'Followed up',
          company: ['Acme Corp','Global Solutions','Sunrise Pvt Ltd','TechWorks','Bright Minds','IVR Systems','Tiwari Co','Kumar & Sons','Patel Traders','Mohit LLC','Borse Industries','Kapoor Enterprises'][i % 12],
          address: ['123 MG Road, Pune','45 Nehru St, Mumbai','12 Park Ave, Delhi','88 Lakeview, Bangalore','7 Marine Dr, Chennai','Sector 12, Noida','Plot 9, Lucknow','Sector 5, Gurgaon','98 High St, Surat','22 Rose St, Jaipur','5 Broadway, Kolkata','33 Hill Rd, Ahmedabad'][i % 12],
          country: ['India','India','India','India','India','India','India','India','India','India','India','India'][i % 12],
          state: ['Maharashtra','Maharashtra','Delhi','Karnataka','Tamil Nadu','Uttar Pradesh','Uttar Pradesh','Haryana','Gujarat','Rajasthan','West Bengal','Gujarat'][i % 12],
          city: ['Pune','Mumbai','Delhi','Bengaluru','Chennai','Noida','Lucknow','Gurgaon','Surat','Jaipur','Kolkata','Ahmedabad'][i % 12],
          pincode: ['411001','400001','110001','560001','600001','201301','226001','122001','395003','302001','700001','380001'][i % 12],
          followupStatus: ['Call-Back','Pending','Done'][i % 3],
          followupDateTime: new Date(now.getTime() + i * 1000 * 60 * 60).toISOString(),
          assignedTo: ['50442-Jyoti','47212-Anilkoli','50442-Vijay'][i % 3]
        }));

        return {
          items: mock,
          totalItems: mock.length,
          totalPages: 1
        };
      }
    },
    ...options
  });
};

export const useLead = (id, options = {}) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await axiosinstance.get(API_ENDPOINTS.LEADS.GET(id));
      return response.data;
    },
    enabled: !!id,
    ...options
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.LEADS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosinstance.put(API_ENDPOINTS.LEADS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      toast.success('Lead updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useAssignLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, assignedTo }) => {
      const response = await axiosinstance.post(API_ENDPOINTS.LEADS.ASSIGN(id), { assignedTo });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead assigned successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== FOLLOW-UPS ==========

export const useFollowups = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['followups', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosinstance.get(`${API_ENDPOINTS.FOLLOWUPS.LIST}?${params}`);
      return response.data;
    },
    ...options
  });
};

export const useCreateFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.FOLLOWUPS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followups'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Follow-up created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

export const useUpdateFollowup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosinstance.put(API_ENDPOINTS.FOLLOWUPS.UPDATE(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followups'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Follow-up updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== ACTIVITIES ==========

export const useActivities = (leadId, options = {}) => {
  return useQuery({
    queryKey: ['activities', leadId],
    queryFn: async () => {
      const response = await axiosinstance.get(API_ENDPOINTS.ACTIVITIES.BY_LEAD(leadId));
      return response.data;
    },
    enabled: !!leadId,
    ...options
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.ACTIVITIES.CREATE, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities', variables.leadId] });
      toast.success('Activity logged successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== DEALS ==========

export const useDeals = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosinstance.get(`${API_ENDPOINTS.DEALS.LIST}?${params}`);
      return response.data;
    },
    ...options
  });
};

export const useDealPipeline = (options = {}) => {
  return useQuery({
    queryKey: ['deal-pipeline'],
    queryFn: async () => {
      const response = await axiosinstance.get(API_ENDPOINTS.DEALS.PIPELINE);
      return response.data;
    },
    ...options
  });
};

export const useMoveDealStage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stageId }) => {
      const response = await axiosinstance.post(API_ENDPOINTS.DEALS.MOVE_STAGE(id), { stageId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal-pipeline'] });
      toast.success('Deal stage updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== TASKS ==========

export const useTasks = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosinstance.get(`${API_ENDPOINTS.TASKS.LIST}?${params}`);
      return response.data;
    },
    ...options
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.TASKS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== QUOTATIONS ==========

export const useQuotations = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['quotations', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await axiosinstance.get(`${API_ENDPOINTS.QUOTATIONS.LIST}?${params}`);
      return response.data;
    },
    ...options
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axiosinstance.post(API_ENDPOINTS.QUOTATIONS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      toast.success('Quotation created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });
};

// ========== DASHBOARD ==========

export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axiosinstance.get(API_ENDPOINTS.DASHBOARD.STATISTICS);
      return response.data;
    },
    ...options
  });
};
