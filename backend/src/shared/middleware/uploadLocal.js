import fs from "fs";
import path from "path";
import { isValidObjectId } from "mongoose";
import ProductModel from "../models/Product.model.js";

function buildProductIdentifierQuery(identifier) {
    if (isValidObjectId(identifier)) {
        return { _id: identifier };
    }

    return { "data.productCode": identifier };
}

function sanitizeFolderName(value = "") {
    return value
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function createProductCode() {
    return `PRD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

async function resolveProductCode(req) {
    if (req.body?.productCode?.trim()) {
        return req.body.productCode.trim();
    }

    const productId = req.params?.productId || req.params?.id;
    if (!productId) {
        if (req.body?.productCode?.trim()) {
            return req.body.productCode.trim();
        }

        console.log("resolveProductCode: No productId in params, generating productCode for new upload");
        const generatedCode = createProductCode();
        req.body = req.body || {};
        req.body.productCode = generatedCode;
        return generatedCode;
    }

    console.log("resolveProductCode: Looking for product with identifier:", productId);
    const product = await ProductModel.findOne(buildProductIdentifierQuery(productId));
    console.log("resolveProductCode: Found product:", product ? { id: product._id, productCode: product.data?.productCode } : null);

    if (!product) {
        console.log("resolveProductCode: Product not found");
        return null;
    }

    if (!product.data.productCode) {
        console.log("resolveProductCode: Product missing productCode, generating one");
        const generatedCode = createProductCode();
        await ProductModel.findByIdAndUpdate(product._id, { "data.productCode": generatedCode });
        console.log("resolveProductCode: Generated and saved productCode:", generatedCode);
        return generatedCode;
    }

    return product.data.productCode;
}

function buildUploadDir(isMultiple, productCode) {
    const rootFolder = isMultiple ? "productMultipleImages" : "mainProductImage";
    const folderName = productCode ? sanitizeFolderName(productCode) : "default";
    return path.join(process.cwd(), "src", "shared", "uploads", rootFolder, folderName);
}

export async function mainImgUploadLocalMw(req, res, next) {
    try {
        if (!req.file || !req.file.buffer) {
            req.localImage = null;
            return next();
        }

        const productCode = await resolveProductCode(req);
        const uploadDir = buildUploadDir(false, productCode);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = path.extname(req.file.originalname);
        const fileName = `image-${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, req.file.buffer);

        req.localImage = {
            url: `/uploads/mainProductImage/${productCode ? sanitizeFolderName(productCode) : "default"}/${fileName}`,
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

        const productCode = await resolveProductCode(req);
        const uploadDir = buildUploadDir(true, productCode);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        req.localImages = req.files.map((file, index) => {
            const ext = path.extname(file.originalname);
            const fileName = `image-${Date.now()}-${index}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, file.buffer);

            return {
                url: `/uploads/productMultipleImages/${productCode ? sanitizeFolderName(productCode) : "default"}/${fileName}`,
                path: filePath
            };
        });

        return next();
    } catch (error) {
        console.error("Local multiple upload error:", error);
        return next(error);
    }
}
