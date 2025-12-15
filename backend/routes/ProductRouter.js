import Router from 'express';
import parseMultipart from "../middleware/parseMultipart.js";
import uploadLocal from '../middleware/uploadLocal.js';
import uploadCloud from '../middleware/uploadCloud.js'; // memory for cloud
import validateNewProduct from "../middleware/validateNewProduct.js";


import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/ProductController.js';


const useLocal = true;
const useCloud = true;

const productRouter = Router();

// Redirecting to controller functions
productRouter.get('/get', getProducts);

productRouter.post(
    // URL
    '/add',
    
    // Middlewears  
    parseMultipart.single("image"),
    validateNewProduct,

    (useLocal ? uploadLocal : (req, res, next) => next()),
    (useCloud ? uploadCloud : (req, res, next) => next()),

    // Controller Address
    addProduct
);

// productRouter.put('/update/:id', (useCloud ? uploadCloud : uploadLocal.single("image")), updateProduct);
productRouter.delete('/delete/:id', deleteProduct);

export default productRouter;