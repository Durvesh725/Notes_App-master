import axios from 'axios'
import { ACCESS_TOKEN } from "./constants"
const apiUrl = "/choreo-apis/organized--notes-app/backend/v1"

// Axios instance with a base URL from the environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl
    // import env file to use backend url
});

// Axios request interceptor to add the Authorization header to each request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api