import axiosinstance from './axiosinstance'
import { serviceinstance } from './instance'

export const loginUSER = async ({ LoginName, Password, Url = 'www.kit19.com', DeviceId = '10-60-4B-7A-92-E5' } = {}) => {
    const payload = {
        Status: '',
        Message: '',
        Details: {
            LoginName: LoginName || '',
            Password: Password || '',
            Url: Url || '',
            DeviceId: DeviceId || '',
        },
    }

    try {
            const response = await serviceinstance.post('Admin/GetDeviceToken', payload)
            const data = response?.data
            return data
    } catch (error) {
        console.error('Error in login User', error)
        throw error
    }
}