import { Router } from 'express';
import Product from '../models/productModel.js';
var router = Router();
import asyncHandler from '../middleware/asyncMiddleware.js';
import { getAllProducts, getProductById } from '../controller/productController.js';

/* GET home page. */
router.get('/',getAllProducts);
router.get("/:id",getProductById)
 
export default router;
