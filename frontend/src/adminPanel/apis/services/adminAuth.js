import axiosInstance from "../../../shared/config/axiosConfig";

export async function loginUserAPI(adminLoginData)
{
    try
    {
        const response = await axiosInstance.post("/admin/auth/login", adminLoginData, { withCredentials: true });
        return response;
    }
    catch (error)
    {
        throw error.response?.data || error;
    }
}

export async function getUserProfileAPI()
{
    try
    {
        const response = await axiosInstance.get("/admin/auth/profile", { withCredentials: true });
        return response;
    }
    catch (error)
    {
        throw error.response?.data || error;
    }
}