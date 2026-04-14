import ProductMultipleImagesModel from "../models/ProductImagesModel.js";
import ProductModel from '../models/ProductModel.js';


export async function getProducts(req, res) {
    try {
        const products = await ProductModel.aggregate([
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
                                    { $or: [{ $ifNull: ["$images.cloud", false] }, { $ifNull: ["$images.local", false] }] },
                                    1,
                                    0
                                ]
                            },
                            { $size: { $ifNull: ["$imagesInfo.images.local", []] } },
                            { $size: { $ifNull: ["$imagesInfo.images.cloud", []] } }
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
            products: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
}

export async function addProduct(req, res) 
{
    try 
    {
        console.log("Request Body:", req.body);
        const payload = { ...req.body }; 
    
        payload.images = {
			local: "",
			cloud: ""
		};

		if (req.localImage) {
			payload.images.local = req.localImage.url;
		}

		if (req.uploadedImage) {
			payload.images.cloud = req.uploadedImage.url;
		}

        const newProduct = await ProductModel.create(payload);
        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } 
    catch (error) 
    {
        console.error("Error adding product:", error);
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
}

export async function updateProduct(req, res) {
    console.log(req.body);
}

export async function deleteProduct(req, res) {
    console.log(req.body);
}

export async function getSingleProduct(req, res) {
	try {
        console.log("Fetching product with ID:", req.params.id);
		const { id } = req.params;
		const product = await ProductModel.findById(id);

		if (!product) {
			return res.status(404).json({
				message: "Product not found"
			});
		}
		return res.status(200).json({
			message: "Product fetched successfully",
			product: product
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

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const localImageUrls = Array.isArray(req.localImages) ? req.localImages.map(img => img.url) : [];
        const cloudImageUrls = Array.isArray(req.uploadedImages) ? req.uploadedImages.map(img => img.url) : [];
        
        let productImages = await ProductMultipleImagesModel.findOne({"foreignKeys.product_id": productId});

        if (!productImages) {
            productImages = new ProductMultipleImagesModel({
                foreignKeys: {
                    product_id: productId
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