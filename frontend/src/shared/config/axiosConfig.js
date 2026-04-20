import axios from "axios";

// Configure axios instance with base URL and timeout settings
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000', // Use environment variable or fallback to localhost
    timeout: 10000,
});

// Create a separate instance for file uploads with longer timeout
export const uploadInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
    timeout: 60000, // 60 seconds for uploads
});

export default instance;
