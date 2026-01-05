import axios from "axios";

export const serviceinstance = axios.create({
    baseURL: process.env.REACT_APP_SERVICES_API_BASE_URL,
    headers: {
        'content-Type': 'application/json'
    }
})