import axios from 'axios'
import { ACCESS_TOKEN } from "./constants"

// Axios instance with a base URL from the environment variable
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL   
    // import env file to use backend url
})

// Axios request interceptor to add the Authorization header to each request
api.interceptor.request.use(
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