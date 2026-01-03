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