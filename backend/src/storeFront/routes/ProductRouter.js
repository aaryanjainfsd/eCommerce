import { Router } from 'express';
import parseMultipart from "../middleware/parseMultipart.js";
import uploadLocal from '../middleware/uploadLocal.js';
import uploadCloud from '../middleware/uploadCloud.js';
import validateNewProduct from "../middleware/validateNewProduct.js";

import { addProduct, deleteProduct, getProducts, updateProduct, getSingleProduct } from '../controllers/ProductController.js';


const useLocal = true;
const useCloud = true;

const productRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Storefront Products
 *   description: Storefront product APIs
 */

// Redirecting to controller functions
/**
 * @swagger
 * /storefront/products/get:
 *   get:
 *     summary: Get all products
 *     tags: [Storefront Products]
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
productRouter.get('/get', getProducts);

/**
 * @swagger
 * /storefront/products/add:
 *   post:
 *     summary: Add product with image upload
 *     tags: [Storefront Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, slug, category, discountedPrice, orignalPrice, description, image]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               category:
 *                 type: string
 *               discountedPrice:
 *                 type: string
 *               orignalPrice:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product added successfully
 */
productRouter.post('/add',
    
    // Middlewears  
    parseMultipart.single("image"),
    validateNewProduct,

    (useLocal ? uploadLocal : (req, res, next) => next()),
    (useCloud ? uploadCloud : (req, res, next) => next()),

    // Controller Address
    addProduct
);

/**
 * @swagger
 * /storefront/products/get/{id}:
 *   get:
 *     summary: Get single product by id
 *     tags: [Storefront Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
productRouter.get('/get/:id', getSingleProduct);

/**
 * @swagger
 * /storefront/products/update/{id}:
 *   put:
 *     summary: Update product by id
 *     tags: [Storefront Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
productRouter.put('/update/:id', (useCloud ? uploadCloud : uploadLocal.single("image")), updateProduct);

/**
 * @swagger
 * /storefront/products/delete/{id}:
 *   delete:
 *     summary: Delete product by id
 *     tags: [Storefront Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
productRouter.delete('/delete/:id', deleteProduct);

export default productRouter;