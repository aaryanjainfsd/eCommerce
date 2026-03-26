import axiosInstance from "../../../shared/config/axiosConfig";

/**
 * Verify if a username exists in the admin system
 * Used for real-time validation before password entry
 * @param {string} username - The username to verify
 * @returns {Promise} Response containing user info if username exists
 */
export async function verifyUsernameAPI(username)
{
    try
    {
        const response = await axiosInstance.post("/admin/auth/verify-username", { username }, { withCredentials: true });
        return response;
    }
    catch (error)
    {
        throw error.response?.data || error;
    }
}

/**
 * Login user with username and password
 * @param {Object} adminLoginData - Object containing username and password
 * @returns {Promise} Response containing user authentication data
 */
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

/**
 * Get authenticated user's profile information
 * @returns {Promise} Response containing user profile data
 */
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