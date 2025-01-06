const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({ 
    firstName: { type: String },      
    lastName: { type: String },                 
    profilepic: { type: String, default: "default-profile-pic-url"},                 
    email: { type: String, required: true, unique: true },    
    password: { type: String, required: false },                 
    emailverified: { type: Boolean, required: true , default: false},    
    role: { type: String, required: true , default: "user"},
    logintype: { type: String, required: true,default: "email" },
    loginbythirdpartyid: { type: String, required: false },
    otp: { type: String, required: false },
    resettoken : {type:String, required: false, default: undefined},
    resettokentime : {type:String, required: false, default: undefined}, 
}, { timestamps: true});


module.exports = mongoose.model("users", userSchema);



