import asyncHandler from "../middleware/asyncMiddleware.js";
import Product from "../models/productModel.js";


const getAllProducts = asyncHandler( async function(req, res, next) {
    try {
       const products = await Product.find({});
       res.json(products);
    } catch (error) {
       res.json(error);
    }
   
})

const getProductById = asyncHandler(async function(req,res,next){
    const product = await Product.findById(req.params.id);
    if(product){
       res.json(product);
    }
    else{
       res.status(404) 
       throw new Error({message:"Resource not found"})

    }
})


export {getAllProducts , getProductById};