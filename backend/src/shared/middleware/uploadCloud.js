import streamifier from "streamifier";
import cloudinary from "../../shared/config/cloudinary.js";
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

function buildCloudFolder(isMultiple, sku) {
    const rootFolder = isMultiple ? "productMultipleImages" : "mainProductImage";
    const folderName = sku ? sanitizeFolderName(sku) : "default";
    return `${rootFolder}/${folderName}`;
}

export async function mainImgUploadCloudMw(req, res, next) {
    try {
        if (!req.file || !req.file.buffer) {
            req.uploadedImage = null;
            return next();
        }

        const sku = await resolveSku(req);
        const folder = buildCloudFolder(false, sku);

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

        const sku = await resolveSku(req);
        const folder = buildCloudFolder(true, sku);

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