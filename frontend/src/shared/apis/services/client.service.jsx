import axiosInstance from "../../../shared/config/axiosConfig";

export async function addClient(clientData)
{
    try 
    {
        const response = await axiosInstance.post("admin/clients/addClient", clientData, { withCredentials: true });
        return response;
    }
    catch(error) 
    {
        throw error.response?.data || error;
    }
}

export async function addClientCredentials(loginData)
{
    try
    {
        const response = await axiosInstance.post("admin/auth/register", loginData, { withCredentials: true });
        return response;
    }
    catch(error)
    {
        throw error.response?.data || error;
    }
}

