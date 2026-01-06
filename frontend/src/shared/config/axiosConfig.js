import axios from "axios";

// Configure axios instance with base URL and timeout settings
const instance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000, 
});
export default instance;
