import axiosInstance from "../../../shared/config/axiosConfig";

export async function addProductAPI(formData) {
    try {
        const response = await axiosInstance.post("/shared/products/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
