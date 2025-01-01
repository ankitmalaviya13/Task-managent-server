const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({ 
    firstName: { type: String },      
    lastName: { type: String },                 //first name 
    profilepic: { type: String },                 
    email: { type: String, required: true, unique: true },    //email is unique //email is required for login
    password: { type: String, required: false },               //password is required for login           
    emailverified: { type: Boolean, required: true , default: false},    //email is verified or not 
    role: { type: String, required: true , default: "user"},
    logintype: { type: String, required: true,default: "email" },
    loginbythirdpartyid: { type: String, required: false },
    otp: { type: String, required: false },
    resettoken : {type:String, required: false, default: undefined},
    resettokentime : {type:String, required: false, default: undefined}, 
}, { timestamps: true});


module.exports = mongoose.model("users", userSchema);



