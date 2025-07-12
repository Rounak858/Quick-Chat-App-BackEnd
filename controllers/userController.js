const router = require('express').Router();
const User = require('./../models/user');
const authMiddleware = require('./../middlewares/authMiddleware');
// const { response } = require('express');
const cloudinary = require('./../cloudinary');
const message = require('../models/message');

//Get details of current logged-in user
router.get('/get-logged-user',authMiddleware ,async (req,response) => {
    try{
        const user = await User.findOne({_id: req.userID});

        response.send({
            message: 'user fetched successfully',
            success: true,
            data : user
        });

    } catch(error) {
        response.status(400).send({
            message: error.message,
            success: false,
        });
    }
});
//Get details of all users
router.get('/get-all-users',authMiddleware ,async (req,response) => {
    try{
        const allUsers = await User.find({_id: {$ne: req.userID}});

        response.send({
            message: ' All user fetched successfully',
            success: true,
            data : allUsers
        });
    } catch(error) {
        response.status(400).send({
            message: error.message,
            success: false,
        });
    }
});
router.post('/upload-profile-pic',authMiddleware,async(req,response) => {
    try{
        const image = req.body.image;
        if (!image) {
            return response.status(400).send({
                message: "No image provided",
                success: false
            });
        }
        // upload the image to cloudinary
        const imageUrl = await cloudinary.uploader.upload(image,{
            folder: 'quick-Chat'
        });
        // Update the user profile pic
        const user = await User.findByIdAndUpdate(
            req.userID,
            {profilePic: imageUrl.secure_url},
            {new : true}
        )
        response.send({
            message: "Profile pic uploaded successfully",
            success: true,
            data: user
        })
    } catch(error){
        response.send({
            message: error.message,
            success: false,
        });
    }
})
module.exports = router; 