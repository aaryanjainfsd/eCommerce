import axiosInstance, { uploadInstance } from "../../../shared/config/axiosConfig";

export async function addProductAPI(formData) {
    try {
        const response = await uploadInstance.post("/shared/products/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function fetchProductsAPI(clientId) {
    try {
        const response = await axiosInstance.get("/shared/products/get", {
            params: clientId ? { client_id: clientId } : undefined,
        });
        return response.data.products;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function fetchProductAPI(productIdentifier) {
    try {
        const response = await axiosInstance.get(`/shared/products/get/${encodeURIComponent(productIdentifier)}`);
        return response.data.product;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function updateProductAPI(productIdentifier, formData) {
    try {
        const response = await uploadInstance.put(`/shared/products/update/${encodeURIComponent(productIdentifier)}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function deleteProductAPI(productIdentifier) {
    try {
        const response = await axiosInstance.delete(`/shared/products/delete/${encodeURIComponent(productIdentifier)}`);
        return response.data;
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
        console.log("Add more images response:", response.data);    
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}