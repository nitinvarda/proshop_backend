import asyncHandler from "../middleware/asyncMiddleware.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc Auth User & get Token
//@route POST /api/users/login
//@access Public

const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id);
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }
    else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
   
})

//@desc Auth User & get Token
//@route POST /api/users    
//@access Public

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.satus(400);
        throw new Error('User already exists');
    }
    const user  = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res,user._id);
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        });
    }
    else{
        res.status(400);
        throw new Error("Invalid user data");
    }
})


//@desc Logout user/ clear cookie
//@route POST /api/users/logout
//@access Private

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{httpOnly:true,expires: new Date(0)});
    res.status(200).json({message:"logged out successfully"});
})


//@desc Auth User & get Token
//@route GET /api/users/profile
//@access Private

const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        });
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
});

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private

const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);
    console.log(req.body)
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updateUser = await user.save();

        res.status(200).json({
            _id:updateUser._id,
            email:updateUser.email,
            name:updateUser.name,
            isAdmin:updateUser.isAdmin
        });
    }
    else{
        res.satus(404);
        throw new Error("User not found");
    }
});

//@desc Get users 
//@route GET /api/users
//@access Private/Admin

const getAllUsers = asyncHandler(async(req,res)=>{
    res.send("Get all users")
})

//@desc Get user by ID
//@route GET /api/users/:id
//@access Private/Admin

const getUserById = asyncHandler(async(req,res)=>{
    res.send("Get user profile by id")
})

//@desc Auth User & get Token
//@route DELETE /api/users/:id
//@access Private/Admin

const deleteUser = asyncHandler(async(req,res)=>{
    res.send("Delete user profile")
})

//@desc Update User
//@route PUT /api/users/:id
//@access Private/Admin

const updateUser = asyncHandler(async(req,res)=>{
    res.send("updateUser")
})





export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
}