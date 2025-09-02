import axios from "axios";

// Use environment variable for API URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://172.235.9.104:3500/api/v1';

export default axios.create({
    baseURL: API_BASE_URL
});

