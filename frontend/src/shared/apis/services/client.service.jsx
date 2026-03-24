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

export async function addClientWithCredentials(clientData)
{
    try
    {
        /*
         * This endpoint creates BOTH records in one backend transaction:
         *   1) client document
         *   2) credential document
         *
         * Why this is better than two separate API calls:
         * If the first request succeeds but the second fails, the table will show a
         * client row with no username/password status. Using one combined endpoint
         * prevents that partial-save problem for newly added clients.
         */
        const response = await axiosInstance.post("admin/clients/addClientWithCredentials", clientData, { withCredentials: true });
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
        const response = await axiosInstance.get("admin/clients/getAllClients", { withCredentials: true });
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

