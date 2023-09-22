import { Router } from 'express';
import Product from '../models/productModel.js';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   Product.find({}).then((data)=>{
    res.json(data);
   }).catch(err=>res.json(err));
    
});

export default router;
