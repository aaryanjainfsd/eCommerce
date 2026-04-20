import { Types, isValidObjectId } from "mongoose";
import ProductMultipleImagesModel from "../models/ProductImages.model.js";
import ProductModel from '../models/Product.model.js';

function buildProductIdentifierQuery(identifier) {
    if (isValidObjectId(identifier)) {
        return { _id: identifier };
    }

    return { "data.productCode": identifier };
}

function createProductCode() {
    return `PRD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export async function getProducts(req, res) {
    try {
        const { client_id } = req.query;
        const matchStage = {};

        if (client_id) {
            if (!isValidObjectId(client_id)) {
                return res.status(400).json({
                    message: "Invalid client_id"
                });
            }

            matchStage["foreignKeys.client_id"] = new Types.ObjectId(client_id);
        }

        const products = await ProductModel.aggregate([
            ...(Object.keys(matchStage).length > 0
                ? [{ $match: matchStage }]
                : []),
            {
                $lookup: {
                    from: "client_product_images",
                    localField: "_id",
                    foreignField: "foreignKeys.product_id",
                    as: "imagesInfo"
                }
            },
            {
                $unwind: {
                    path: "$imagesInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    totalImagesUploaded: {
                        $add: [
                            {
                                $cond: [
                                    {
                                        $or: [
                                            { $ifNull: ["$data.images.cloud", false] },
                                            { $ifNull: ["$data.images.local", false] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            },
                            { $size: { $ifNull: ["$imagesInfo.images.local", []] } }
                        ]
                    }
                }
            },
            {
                $project: {
                    imagesInfo: 0
                }
            }
        ]);

        res.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
}

export async function addProduct(req, res) {
    try {
        const { client_id, ...rest } = req.body;

        if (!client_id) {
            return res.status(400).json({
                message: "client_id is required"
            });
        }

        const newProductPayload = {
            foreignKeys: {
                client_id,
                future_sample_id: `product_${Date.now()}`
            },
            data: {
                name: rest.name,
                slug: rest.slug,
                category: rest.category,
                sellingPrice: Number(rest.sellingPrice) || 0,
                stockQuantity: Number(rest.stockQuantity) || 0,
                sku: rest.sku,
                productCode: rest.productCode?.trim() || createProductCode(),
                stockStatus: rest.stockStatus || "In Stock",
                shortDescription: rest.shortDescription || "",
                brand: rest.brand || "",
                mrp: Number(rest.mrp) || 0,
                images: {
                    local: req.localImage?.url || "",
                    cloud: req.uploadedImage?.url || ""
                },
                productVisibility: rest.productVisibility || "Show on Storefront",
                productLabel: rest.productLabel || "Standard Product"
            }
        };

        const newProduct = await ProductModel.create(newProductPayload);

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct.toObject()
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { ...rest } = req.body;
        const query = buildProductIdentifierQuery(id);

        const existingProduct = await ProductModel.findOne(query);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (rest.slug) {
            const slugConflict = await ProductModel.findOne({
                _id: { $ne: existingProduct._id },
                "foreignKeys.client_id": existingProduct.foreignKeys.client_id,
                "data.slug": rest.slug.trim()
            });

            if (slugConflict) {
                return res.status(409).json({
                    message: "Slug already exists for this client. Please choose a different slug."
                });
            }
        }

        if (rest.sku) {
            const skuConflict = await ProductModel.findOne({
                _id: { $ne: existingProduct._id },
                "foreignKeys.client_id": existingProduct.foreignKeys.client_id,
                "data.sku": rest.sku.trim()
            });

            if (skuConflict) {
                return res.status(409).json({
                    message: "SKU already exists for this client. Please choose a different SKU."
                });
            }
        }

        const updateFields = {};

        Object.entries(rest).forEach(([key, value]) => {
            if (key === "image") return;
            updateFields[`data.${key}`] = value;
        });

        if (req.localImage) {
            updateFields["data.images.local"] = req.localImage.url;
        }

        if (req.uploadedImage) {
            updateFields["data.images.cloud"] = req.uploadedImage.url;
        }

        const updatedProduct = await ProductModel.findOneAndUpdate(
            query,
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct.toObject()
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const query = buildProductIdentifierQuery(id);

        const deletedProduct = await ProductModel.findOneAndDelete(query);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct.toObject()
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
}

export async function getSingleProduct(req, res) {
	try {
        console.log("Fetching product with ID:", req.params.id);
		const { id } = req.params;
        const query = buildProductIdentifierQuery(id);
		const product = await ProductModel.findOne(query);

		if (!product) {
			return res.status(404).json({
				message: "Product not found"
			});
		}
		return res.status(200).json({
			message: "Product fetched successfully",
            product: product.toObject()
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
}

export async function addMultipleProductImages(req, res) 
{
    try 
    {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required in the URL parameters"
            });
        }

        const product = await ProductModel.findOne(buildProductIdentifierQuery(productId));
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const localImageUrls = Array.isArray(req.localImages) ? req.localImages.map(img => img.url) : [];
        const cloudImageUrls = Array.isArray(req.uploadedImages) ? req.uploadedImages.map(img => img.url) : [];
        
        let productImages = await ProductMultipleImagesModel.findOne({"foreignKeys.product_id": product._id});

        if (!productImages) {
            productImages = new ProductMultipleImagesModel({
                foreignKeys: {
                    product_id: product._id
                },
                images: {
                    local: localImageUrls,
                    cloud: cloudImageUrls
                }
            });

            await productImages.save();
        } else {
            if (localImageUrls.length > 0) {
                productImages.images.local.push(...localImageUrls);
            }

            if (cloudImageUrls.length > 0) {    
                productImages.images.cloud.push(...cloudImageUrls);
            }   

            await productImages.save();
        }

        const totalImagesUploaded = (productImages.images.local?.length || 0) + (productImages.images.cloud?.length || 0);

        return res.status(200).json({
            message: "Product images added successfully",
            productImages: productImages,
            totalImagesUploaded
        });

    }
    catch(error)
    {
        console.error("Error adding product images:", error);
        res.status(500).json({
            message: "Failed to add product images",
            error: error.message
        });
    }
}