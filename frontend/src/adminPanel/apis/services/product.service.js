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

export async function fetchProductsAPI() {
    try {
        const response = await axiosInstance.get("/shared/products/get");
        return response.data.products;
    } catch (error) {
        throw error.response?.data || error;
    }   
}

export async function addMoreProductImagesAPI(productId, formData) {
    try {
        const response = await axiosInstance.post(`/shared/products/add-images/${productId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}