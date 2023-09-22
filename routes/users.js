import { Router } from 'express';
var router = Router();
import User from "../models/userModel.js";

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}).then((data)=>{
    res.json(data)
  }).catch(err=>console.log(err))
  
});

export default router;
