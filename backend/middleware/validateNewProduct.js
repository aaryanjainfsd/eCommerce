// backend/middlewear/validateNewProduct.js
import ProductModel from "../models/ProductModel.js";

export default async function validateNewProduct(req, res, next) {
    try {
        const { slug } = req.body;
        if (!slug) 
        {
            return res.status(400).json({ message: "slug is required" });
        } 
        else 
        {
            const existing = await ProductModel.findOne({ slug });
            if (existing) {
                return res.status(409).json({ message: "Slug already exists" }); 
            }
        }
        return next();
    } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({ message: "Validation failed", error: err.message });
    }
}
