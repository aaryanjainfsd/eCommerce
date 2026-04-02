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

export async function toggleClientStatus(clientId)
{
    try
    {
        const response = await axiosInstance.patch(`shared/clients/toggleClientStatus/${clientId}`, {}, { withCredentials: true });
        return response;
    }
    catch(error)
    {
        throw error.response?.data || error;
    }
}

export async function permanentlyDeleteClient(clientId)
{
    try
    {
        const response = await axiosInstance.delete(`shared/clients/deleteClient/${clientId}`, { withCredentials: true });
        return response;
    }
    catch(error)
    {
        throw error.response?.data || error;
    }
}

export const removeClient = toggleClientStatus;

