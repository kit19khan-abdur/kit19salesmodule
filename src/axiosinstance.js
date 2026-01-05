import axios from "axios";

const axiosinstance = axios.create({
    baseURL: process.env.REACT_KIT19_API_URL,
    headers: {
        'content-Type': 'application/json'
    }
})

const serviceInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVICES_API_BASE_URL,
    headers: {
        'content-Type': 'application/json'
    }
})


const wcfInstance = axios.create({
    baseURL: process.env.REACT_APP_WCF_API_BASE_URL,
    headers: {
        'content-Type': 'application/json'
    }
})

export { axiosinstance, serviceInstance, wcfInstance };