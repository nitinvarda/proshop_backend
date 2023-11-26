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


// @desc Create a new review
// @route POST /api/products/:id/reviews
// @access Private
const createdProductReview = asyncHandler(async(req,res)=>{
   const {rating,comment} = req.body;

   const product = await Product.findById(req.params.id);

   if(product){
      const alreadyReviewed = product.reviews.find((review)=>review.user.toString()=== req.user._id.toString());
      if(alreadyReviewed){
         req.status(400);
         throw new Error("Product already reviewed");
      }
      
      const review = {
         name : req.user.name,
         rating: Number(rating),
         comment,
         user: req.user._id
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc,review)=>acc + review.rating,0) / product.reviews.length;
      
      await product.save();
      res.status(201).json({message:"Review added"});
   }
   else{
      res.status(404);
      throw new Error("Resource not found");
   }
})




export {
   getAllProducts , 
   getProductById,
   createdProductReview
};