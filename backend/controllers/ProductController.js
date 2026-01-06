import ProductModel from '../models/ProductModel.js';

export async function getProducts(req, res) {
    try {
        const products = await ProductModel.find({});
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

// Adding Product - With Photo Upload - Local Storage
export async function addProduct(req, res) 
{
    try 
    {
        console.log("Request Body:", req);
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

// Adding Product - Normal Method
// export async function addProduct(req, res) {
//     try {
// 		const newProduct = await ProductModel.create(req.body);
// 		res.status(201).json({
// 			message: "Product added successfully",
// 			product: newProduct
// 		});
// 	} catch (error) {
// 		console.error("Error adding product:", error);

// 		res.status(500).json({
// 			message: "Failed to add product",
// 			error: error.message
// 		});
// 	}
// }

export async function updateProduct(req, res) {
    console.log(req.body);
}

export async function deleteProduct(req, res) {
    console.log(req.body);
}

// Get Single Product by ID
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
