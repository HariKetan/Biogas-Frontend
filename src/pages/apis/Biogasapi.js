import axios from "axios";

// Use environment variable for API URL with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default axios.create({
    baseURL: API_BASE_URL
});

