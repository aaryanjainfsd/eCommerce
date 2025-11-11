import axios from "axios";

const instance = axios.create({
    baseURL: "https://react-ecommerce-ajb4.onrender.com/api",
    withCredentials: true,
});
export default instance;
