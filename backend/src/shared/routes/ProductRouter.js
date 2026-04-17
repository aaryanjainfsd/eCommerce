import { Router } from 'express';
import parseMultipart from "../middleware/parseMultipart.js";
import {mainImgUploadLocalMw, multipleImgsUploadLocalMw} from '../middleware/uploadLocal.js';
import {mainImgUploadCloudMw, multipleImgsUploadCloudMw } from '../middleware/uploadCloud.js';
import validateNewProduct from "../middleware/validateNewProduct.js";

import { addProduct, addMultipleProductImages, deleteProduct, getProducts, updateProduct, getSingleProduct } from '../controllers/ProductController.js';


const useLocal = true;
const useCloud = true;

const productRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Shared Products
 *   description: Shared product APIs
 */

/**
 * @swagger
 * /shared/products/get:
 *   get:
 *     summary: Get all products
 *     tags: ['Storefront Products']
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
productRouter.get('/get', getProducts);

/**
 * @swagger
 * /shared/products/add:
 *   post:
 *     summary: Add product with image upload
 *     tags: ['Storefront Products']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, sellingPrice, stockQuantity, stockStatus, sku]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               sellingPrice:
 *                 type: number
 *               stockQuantity:
 *                 type: number
 *               stockStatus:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               brand:
 *                 type: string
 *               sku:
 *                 type: string
 *               mrp:
 *                 type: number
 *               productVisibility:
 *                 type: string
 *               productLabel:
 *                 type: string
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, category, sellingPrice, stockQuantity, stockStatus, sku]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               sellingPrice:
 *                 type: number
 *               stockQuantity:
 *                 type: number
 *               stockStatus:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               brand:
 *                 type: string
 *               sku:
 *                 type: string
 *               mrp:
 *                 type: number
 *               productVisibility:
 *                 type: string
 *               productLabel:
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

    (useLocal ? mainImgUploadLocalMw : (req, res, next) => next()),
    (useCloud ? mainImgUploadCloudMw : (req, res, next) => next()),

    // Controller Address
    addProduct
);

/**
 * @swagger
 * /shared/products/get/{id}:
 *   get:
 *     summary: Get single product by id
 *     tags: ['Storefront Products']
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
 * /shared/products/update/{id}:
 *   put:
 *     summary: Update product by id
 *     tags: ['Storefront Products']
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
productRouter.put('/update/:id', (useCloud ? mainImgUploadCloudMw : mainImgUploadLocalMw), updateProduct);

/**
 * @swagger
 * /shared/products/delete/{id}:
 *   delete:
 *     summary: Delete product by id
 *     tags: ['Storefront Products']
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

/**
 * @swagger
 * /shared/products/add-images/{productId}:
 *   post:
 *     summary: Add multiple product images
 *     tags: ['Storefront Products']
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
 *     responses:
 *       201:
 *         description: Product images added successfully
 *       400:
 *         description: Invalid product ID or images
 *       404:
 *         description: Product not found
 */
productRouter.post('/add-images/:productId',
    // Middlewears
    parseMultipart.array("images", 10), 

    (useLocal ? multipleImgsUploadLocalMw : (req, res, next) => next()),
    (useCloud ? multipleImgsUploadCloudMw : (req, res, next) => next()),

    // Controller Address
    addMultipleProductImages
);

export default productRouter;