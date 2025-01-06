const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/user');


const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("Fsdkfhsdkfjhsfkhj");
  console.log(req.headers.authorization);
  if(req.headers.authorization){
    try {  
      console.log('token found');

        //get token from header
      token = req.headers.authorization;
      //verify token  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      //get user from db
      // const user = await User.findById(decoded.id).select('emailverified');
    //   console.log(user);
      // if(user.emailverified == true)
      req.userId = decoded.id;
      req.user = await User.findById(decoded.id);
    //   console.log(decoded);
    // console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({error:'Not authorized, token failed'});
    }
  }
  if(!token){
    res.status(403).json({error:'Token is not found Please provide token'});
  }
});



const checkUserExists = async (req, res, next) => {
  const {  email } = req.body;
  console.log(req.body);
  console.log("fdfksdgfjkdshf");

  // if (!username || !email) {
  //     return res.status(400).send('All fields are required');
  // }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
      return res.status(400).send('User already exists');
  }

  next();
};




module.exports= {protect,checkUserExists};