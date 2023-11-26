import { Router } from 'express';
import Product from '../models/productModel.js';
var router = Router();
import asyncHandler from '../middleware/asyncMiddleware.js';
import { createdProductReview, getAllProducts, getProductById } from '../controller/productController.js';
import MulterGridfsStorage from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import multer from 'multer';
import { admin, protect } from '../middleware/authMiddleware.js';



router.get("/",getAllProducts)
  
router.get("/:id",getProductById)
router.route("/:id/reviews").post(protect,createdProductReview);
 
export default router;
