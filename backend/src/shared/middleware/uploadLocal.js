import fs from "fs";
import path from "path";
import ProductModel from "../models/Product.model.js";

function sanitizeFolderName(value = "") {
    return value
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

async function resolveSku(req) {
    if (req.body?.sku?.trim()) {
        return req.body.sku.trim();
    }

    const productId = req.params?.productId || req.params?.id;
    if (!productId) {
        return null;
    }

    const product = await ProductModel.findById(productId);
    return product?.data?.sku || null;
}

function buildUploadDir(isMultiple, sku) {
    const rootFolder = isMultiple ? "productMultipleImages" : "mainProductImage";
    const skuFolder = sku ? sanitizeFolderName(sku) : "default";
    return path.join(process.cwd(), "src", "shared", "uploads", rootFolder, skuFolder);
}

export async function mainImgUploadLocalMw(req, res, next) {
    try {
        if (!req.file || !req.file.buffer) {
            req.localImage = null;
            return next();
        }

        const sku = await resolveSku(req);
        const uploadDir = buildUploadDir(false, sku);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(req.file.originalname);
        const fileName = `image-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, req.file.buffer);

        req.localImage = {
            url: `/uploads/main product images/${sku ? sanitizeFolderName(sku) : "default"}/${fileName}`,
            path: filePath
        };

        return next();
    } catch (error) {
        console.error("Local upload error:", error);
        return next(error);
    }
}

export async function multipleImgsUploadLocalMw(req, res, next) {
    try {
        if (!req.files || req.files.length === 0) {
            req.localImages = [];
            return next();
        }

        const sku = await resolveSku(req);
        const uploadDir = buildUploadDir(true, sku);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        req.localImages = req.files.map((file, index) => {
            const ext = path.extname(file.originalname);
            const fileName = `image-${Date.now()}-${index}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, file.buffer);

            return {
                url: `/uploads/multiple product images/${sku ? sanitizeFolderName(sku) : "default"}/${fileName}`,
                path: filePath
            };
        });

        return next();
    } catch (error) {
        console.error("Local multiple upload error:", error);
        return next(error);
    }
}
