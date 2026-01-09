import { serviceInstance, wcfInstance } from "../axiosinstance"

export const getLeadList = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetLeadListNew', payload)
        return response.data
    }
    catch (error) {
        console.error('getLeadList error:', error);
        throw error;
    }
}

export const getLeadDetailList = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetLeadDetailListNew', payload)
        return response.data
    }
    catch (error) {
        console.error('getLeadDetailList error:', error);
        throw error;
    }
}

export const getLeadActivities = async (payload) => {
    try {
        // const response = await wcfInstance.post('UserCRMCampaign/Service/IMSService.asmx/GetLeadActivity', payload)
       const response = await serviceInstance.post('UserCRM/GetLeadActivity', payload)
        return response.data
    } catch (error) {
        console.error('getLeadActivities error:', error);
        throw error;
    }
}

export const getCallLogt = async (payload) => {
    try {
        // const response = await wcfInstance.post('UserCRMCampaign/Service/CRMService.asmx/getCallLog', {
        const response = await serviceInstance.post('UserCRM/GetCallLog', payload)
        return response.data
    } catch (error) {
        console.error('getCallLogt error:', error);
        throw error;
    }
}

export const getPhysiscalAppointmentWidgetList = async (entityId, entityName) =>{
    try {
        const response = await serviceInstance.post('UserCRMCampaign/Service/ToDoService.asmx/GetPhysicalAppointmentWidgetList', {
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

export const getTaskHistoryListByUserId_new = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetTaskHistoryListByUserId_new', payload);
        return response.data;
    } catch (error) {
        console.error('getTaskHistoryListByUserId_new error:', error);
        throw error;
    }
}

export const getWebformDetailsByLeadId = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetWebformDetailsByLeadId', payload);
        return response.data;
    } catch (error) {
        console.error('getWebformDetailsByLeadId error:', error);
        throw error;
    }
}

export const getPipelineHistoryByLeadID = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/PipelineHistoryByLeadID', payload);
        return response.data;
    } catch (error) {
        console.error('getPipelineHistoryByLeadID error:', error);
        throw error;
    }
}

export const getTawkToChatLogsByLeadId = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetTawkToChatLogsByLeadId', payload);
        return response.data;
    } catch (error) {
        console.error('getTawkToChatLogsByLeadId error:', error);
        throw error;
    }
}

export const getFollowupsByLeadId = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetData', payload);
        return response.data;
    } catch (error) {
        console.error('getFollowupsByLeadId error:', error);
        throw error;
    }
}

export const getNotesByLeadId = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetNotes', payload);
        return response.data;
    } catch (error) {
        console.error('GetNotes error:', error);
        throw error;
    }
}

export const getDocumentsByLeadId = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetDocuments', payload);
        return response.data;
    } catch (error) {
        console.error('getDocumentsByLeadId error:', error);
        throw error;
    }
}

export const getNotifications = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/DisplayNotification', payload);
        return response.data;
    } catch (error) {
        console.error('getNotifications error:', error);
        throw error;
    }
}

export const updateDialerData = async (payload) => {
    try {
        const response = await serviceInstance.post('DialerSetting/UpdateDialerData', payload);
        return response.data;
    } catch (error) {
        console.error('updateDialerData error:', error);
        throw error;
    }
}

export const getScheduleCallAction = async (payload) => {
    try {
        const response = await serviceInstance.post('DialerSetting/GetScheduleCallAction', payload);
        return response.data;
    } catch (error) {
        console.error('getScheduleCallAction error:', error);
        throw error;
    }
}
