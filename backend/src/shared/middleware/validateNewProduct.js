// backend/middlewear/validateNewProduct.js
import ProductModel from "../models/Product.model.js";

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
        const { name, sku } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ message: "Product name is required." });
        }

        if (!sku?.trim()) {
            return res.status(400).json({ message: "Product SKU is required." });
        }

        if (!req.body.client_id) {
            return res.status(400).json({ message: "client_id is required." });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required." });
        }

        const slug = req.body.slug?.trim() || createSlug(name);
        req.body.slug = slug;
        req.body.sku = sku.trim();

        const existingSlug = await ProductModel.findOne({
            "foreignKeys.client_id": req.body.client_id,
            "data.slug": slug
        });
        if (existingSlug) {
            return res.status(409).json({
                message: "Slug already exists for this client. Please choose a different product name."
            });
        }

        const existingSku = await ProductModel.findOne({
            "foreignKeys.client_id": req.body.client_id,
            "data.sku": req.body.sku
        });
        if (existingSku) {
            return res.status(409).json({
                message: "SKU already exists for this client. Please choose a different SKU."
            });
        }

        return next();
    } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({ message: "Validation failed", error: err.message });
    }
}
