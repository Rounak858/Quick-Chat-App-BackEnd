const router = require('express').Router();
// const { request } = require('../app');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

router.post('/signup', async (req, response) => {
    // response.send('User created successfully!');
    try {
        console.log("ok");
        //if the user is already exist
        const user = await User.findOne({ email: req.body.email });
        //if user already exist send a message
        if (user) {
            return response.send({
                message: 'user already exist.',
                success: false
            })
        }
        // encrypt the password
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashPassword;

        //create a new user & save in db
        const newUser = new User(req.body);
        await newUser.save();

        response.send({
            message: 'User created successfully!',
            success: true
        })
    } catch (error) {
        response.send({
            message: error.message,
            success: false
        });
    }
})

router.post('/login', async (req, response) => {
    try {
        //check if user exist 
        const user = await User.findOne({ email: req.body.email }).select('+password');
        if (!user) {
            return response.send({
                message: 'user does not exist',
                success: false
            })
        }
        // check if the password is correct or not
        const isvalidPassword = await bcrypt.compare(req.body.password, user.password)
        if (!isvalidPassword) {
            return response.send({
                message: 'invalid password',
                success: false
            })
        }
        //if the user exist & password is correct, assign a JWT
        const token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        response.send({
            message: 'user logged-in successfully',
            success: true,
            token: token
        });
    } catch (error) {
        response.send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;