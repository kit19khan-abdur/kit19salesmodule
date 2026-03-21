import { serviceInstance, wcfInstance } from "../axiosinstance"

export const getEnquiryList = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetEnquiryListNew', payload)
        return response.data
    }
    catch (error) {
        console.error('getEnquiryList error:', error);
        throw error;
    }
}

export const getEnquiryList_WithPredefinedAndCustomFilter = async (payload) => {
    try
     {
        // use the configured serviceInstance and relative path so the dev proxy and
        // REACT_APP_SERVICES_API_BASE_URL are honored (avoid hardcoded localhost)
        const response = await serviceInstance.post('http://localhost:62194/UserCRM/GetEnquiryListNe', payload)
        return response.data
    }
    catch (error) {
        console.error('getEnquiryList_WithPredefinedAndCustomFilter error:', error);
        throw error;
    }
}


export const getEnquiryActivities = async (payload) => {
    try {
        const response = await wcfInstance.post('UserCRMCampaign/Service/CRMService.asmx/GetEnquiryActivity', payload)
        return response.data
    } catch (error) {
        console.error('getEnquiryActivities error:', error);
        throw error;
    }
}

export const getCallLogt = async (entityName, entityId, start, length) => {
    try {
        const response = await wcfInstance.post('UserCRMCampaign/Service/CRMService.asmx/getCallLog', {
            EntityName: entityName,
            EntityID: entityId,
            Start: start,
            Limit: length
        })
        return response.data
    } catch (error) {
        console.error('getCallLogt error:', error);
        throw error;
    }
}

export const getPhysiscalAppointmentWidgetList = async (entityId, entityName) =>{
    try {
        const response = await wcfInstance.post('UserCRMCampaign/Service/ToDoService.asmx/GetPhysicalAppointmentWidgetList', {
            EntityId: entityId,
            EntityName: entityName
        })
        return response.data
    } catch (error) {
        console.error('getPhysiscalAppointmentWidgetList error:', error);
        throw error;
    }
}

export const getVirtulAPList  = async (filterText) =>{
    try {
        const response = await wcfInstance.post('UserCRMCampaign/ToDo/Appointment.aspx/GetTaskHistoryListByUserId',{
            FilterText: filterText // " AND LeadId = 7302567"
        })
        return response.data
    } catch (error) {
        console.error('getVirtulAPList error:', error);     
        throw error;
    }
}

export const getLeadConflictionDetailList = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/LeadConflictionDetailList', payload)
        return response.data
    } catch (error) {
        console.error('getLeadConflictionDetailList error:', error);
        throw error;
    }
}

export const exportEnquiryData = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/ExportDataByEntity', payload)
        return response.data
    } catch (error) {
        console.error('exportEnquiryData error:', error);
        throw error;
    }
}

export const getLeadShowData = async (payload) => {
    try {
        const response = await serviceInstance.post('http://localhost:62194/UserCRM/ShowData', payload)
        return response.data
    } catch (error) {
        console.error('getLeadShowData error:', error);
        throw error;
    }
}
export const mergeEnquiryToLead = async (payload) => {
    try {
        const response = await serviceInstance.post('http://localhost:62194/UserCRM/MergeEnquiryToLead', payload)
        return response.data
    } catch (error) {
        // Log rich error info to help debug backend validation failures (417, 400, etc.)
        try {
            if (error.response) {
                console.error('mergeEnquiryToLead response error:', {
                    status: error.response.status,
                    headers: error.response.headers,
                    data: error.response.data
                });
            } else {
                console.error('mergeEnquiryToLead error (no response):', error.message || error);
            }
        } catch (logErr) {
            console.error('Failed to log mergeEnquiryToLead error details:', logErr);
        }
        throw error;
    }
}