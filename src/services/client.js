import axios from 'axios'
// const API_BASE_URL = '/api'
const API_BASE_URL = 'http://localhost:3001/api'
const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})
client.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? token : '';
    return config;
})
export default client