import { Router } from 'express';
var router = Router();


import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile, 
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
} from '../controller/userController.js';
import {protect,admin} from '../middleware/authMiddleware.js';

/* GET home page. */ 
router.route('/').post(registerUser).get(protect,admin,getAllUsers);
router.post("/logout",logoutUser); 
router.post("/login",authUser); 
router
    .route("/profile")
    .get(protect,getUserProfile)
    .put(protect,updateUserProfile);
router
    .route("/:id")
    .get(protect,admin,getUserById)
    .delete(protect,admin,deleteUser)
    .put(protect,admin,updateUser);





export default router;
