const express = require('express');
const router = express.Router();
const {signupUser,getUser,updateUser,deleteUser,loginUser,forgetPassword,verifyOtp,resetPassword,changePassword,users,thirdpartyUser,logout} = require('../Controllers/userController');
const { protect,checkUserExists } = require('../Middlewares/auth');
const { uploadProfileImage } = require('../Middlewares/uploadImage');

//register user
// uploadProfileImage
// router.route('/').post(signupUser);
router.post('/',  signupUser);

//login user
router.post('/login', loginUser);

//forgot password
router.route('/forgetpassword').post(forgetPassword)

//verifyOtp 
router.route('/verifyOtp').post(verifyOtp);

//get user profile
router.get('/', protect,getUser);

//verifyOtp 
router.route('/resetPassword').post(resetPassword)

//update user profile
router.put('/',protect, uploadProfileImage, updateUser);
// router.put('/', protect,uploadProfileImage, updateUser);

//Delete user profile
router.delete('/',protect,deleteUser); 

//changePassword 
router.post('/changePassword', protect,changePassword);

//Delete user profile
router.delete('/logout',protect,logout);

//List Users
router.route('/users').get(users);

//thirdparty user
router.route('/thirdparty').post(thirdpartyUser);







module.exports = router;