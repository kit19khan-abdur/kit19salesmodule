import { serviceInstance } from "../axiosinstance";

export const getFollowupList = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetFollowupList', payload);
        return response.data;
    } catch (error) {
        console.error('getFollowupList error:', error);
        throw error;
    }
};

export const getFollowupDetailList = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetFollowupDetailList', payload);
        return response.data;
    } catch (error) {
        console.error('getFollowupDetailList error:', error);
        throw error;
    }
};

export const updateFollowup = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/UpdateFollowup', payload);
        return response.data;
    } catch (error) {
        console.error('updateFollowup error:', error);
        throw error;
    }
};

export const deleteFollowup = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/DeleteFollowup', payload);
        return response.data;
    } catch (error) {
        console.error('deleteFollowup error:', error);
        throw error;
    }
};

export const getFollowupStats = async (payload) => {
    try {
        const response = await serviceInstance.post('UserCRM/GetFollowupStats', payload);
        return response.data;
    } catch (error) {
        console.error('getFollowupStats error:', error);
        throw error;
    }
};
