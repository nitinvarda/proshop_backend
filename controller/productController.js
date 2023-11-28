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
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  
 
   const keyword = req.query.keyword
     ? {
         name: {
           $regex: req.query.keyword,
           $options: 'i',
         },
       }
     : {};
 

   const products = await Product.find({ ...keyword })
     
 
   res.json(products);
 });
 

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

   try{
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
   }
   catch(err){
      res.status(404);
      throw new Error(err.message)
   }
  
})

// @desc delete a review
// @route DELETE /api/products/:id/reviews
// @access Private
const deleteProductReview = asyncHandler(async(req,res)=>{
   try {
      const product = await Product.findById(req.params.id);
      if(product){
         const alreadyReviewed = product.reviews.find((review)=>review.user.toString()=== req.user._id.toString());
         if(alreadyReviewed){
            const removeUserReview = product.reviews.filter((review)=>review.user.toString() != req.user._id.toString());
        
            const reviews = removeUserReview ?? []
            product.reviews = reviews;
            product.numReviews = reviews.length;
            
         
            if(reviews.length < 1){
               product.rating = 0;
            }
            else{

               product.rating = reviews.reduce((acc,review)=>acc + review.rating,0) / reviews.length;
            }
           
            await product.save();
            res.status(201).json({message:"Review removed"});
         }
         else{
            req.status(400);
            throw new Error("Product not reviewd by the current user");
         }
      }
      else{
      
         throw new Error("Resource not found");
      }
   } catch (error) {
      console.log(error);
      throw new Error(error.message);
   }
  
})




export {
   getProducts , 
   getProductById,
   createdProductReview,
   deleteProductReview
};