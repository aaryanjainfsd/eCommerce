import axiosInstance from "../../../shared/config/axiosConfig";

export async function addClient(clientData)
{
    try 
    {
        const response = await axiosInstance.post("shared/clients/addClient", clientData, { withCredentials: true });
        return response;
    }
    catch(error) 
    {
        throw error.response?.data || error;
    }
}

export async function getAllClients()
{
    try
    {
        const response = await axiosInstance.get("shared/clients/getAllClients", { withCredentials: true });
        return response;
    }
    catch(error)
    {
        throw error.response?.data || error;
    }

}

export async function adminAuthCredentials(loginData)
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

export async function removeClient(clientId)
{
    try
    {
        const response = await axiosInstance.patch(`shared/clients/removeClient/${clientId}`, {}, { withCredentials: true });
        return response;
    }
    catch(error)
    {
        throw error.response?.data || error;
    }
}

