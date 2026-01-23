import axiosInstance from "../../../shared/config/axiosConfig";

export async function registerUserService(userData) {
	try 
    {
		const response = await axiosInstance.post("/auth/register", userData);
		return response.data;
	}
    catch (error) 
    {
		throw error.response?.data || error;
	}
}

export async function loginUserService(loginData)
{
	try
	{
		const response = await axiosInstance.post("/auth/login", loginData, { withCredentials: true });
		return response.data;
	}
	catch (error)
	{
		throw error.response?.data || error;
	}
}