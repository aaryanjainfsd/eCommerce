import axiosInstance from "../../../shared/config/axiosConfig";

export async function SuperAdminLoginAPI(superAdminLoginData)
{
    try{
        const response = await axiosInstance.post("/superAdmin/auth/login", superAdminLoginData, { withCredentials: true });
        return response;
    }
    catch (error)
    {
        throw error.response?.data || error;
    }
}

export async function SuperAdminLogoutAPI()
{
    try {
        const response = await axiosInstance.post("/superAdmin/auth/logout", {}, { withCredentials: true });
        return response;
    }
    catch (error)
    {
        throw error.response?.data || error;
    }
}

