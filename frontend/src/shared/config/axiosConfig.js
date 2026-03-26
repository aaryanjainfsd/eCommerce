import axios from "axios";

// Configure axios instance with base URL and timeout settings
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', // Use environment variable or fallback to localhost
    timeout: 10000,
});
export default instance;
