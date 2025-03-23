import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:9988";

const apiNoAccessClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiNoAccessClient.interceptors.request.use((config) => {
    return config;
}, (error) => Promise.reject(error));


export default apiNoAccessClient;
