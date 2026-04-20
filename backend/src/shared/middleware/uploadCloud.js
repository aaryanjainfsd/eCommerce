import streamifier from "streamifier";
import { isValidObjectId } from "mongoose";
import cloudinary from "../../shared/config/cloudinary.js";
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

function buildCloudFolder(isMultiple, productCode) {
    const rootFolder = isMultiple ? "productMultipleImages" : "mainProductImage";
    const folderName = productCode ? sanitizeFolderName(productCode) : "default";
    return `${rootFolder}/${folderName}`;
}

export async function mainImgUploadCloudMw(req, res, next) {
    try {
        if (!req.file || !req.file.buffer) {
            req.uploadedImage = null;
            return next();
        }

        const productCode = await resolveProductCode(req);
        const folder = buildCloudFolder(false, productCode);

        const uploadResult = await new Promise((resolve, reject) => {
            const cloudinaryStream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(cloudinaryStream);
        });

        req.uploadedImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };

        return next();
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return next(error);
    }
}


export async function multipleImgsUploadCloudMw(req, res, next)
{
    try {
        if (!req.files || !req.files.length) {
            req.uploadedImages = [];
            return next();
        }

        const productCode = await resolveProductCode(req);
        const folder = buildCloudFolder(true, productCode);

        const uploadResults = await Promise.all(
            req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const cloudinaryStream = cloudinary.uploader.upload_stream(
                        { folder },
                        (error, result) => {
                            if (error) {
                                return reject(error);
                            }
                            return resolve(result);
                        }
                    );
                    streamifier.createReadStream(file.buffer).pipe(cloudinaryStream);
                });
            })
        );

        req.uploadedImages = uploadResults.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));

        return next();
    }
    catch(error)
    {
        console.error("Cloudinary upload error:", error);
        return next(error);
    }
}