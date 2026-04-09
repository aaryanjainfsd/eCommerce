// backend/middlewear/validateNewProduct.js
import ProductModel from "../models/ProductModel.js";

function createSlug(value = "") {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default async function validateNewProduct(req, res, next) {
    try {
        const { name } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "name is required" });
        }

        const slug = req.body.slug?.trim() || createSlug(name);
        req.body.slug = slug;

        const existing = await ProductModel.findOne({ slug });
        if (existing) {
            return res.status(409).json({
                message: "Slug already exists. Please use a different product name."
            });
        }

        return next();
    } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({ message: "Validation failed", error: err.message });
    }
}
