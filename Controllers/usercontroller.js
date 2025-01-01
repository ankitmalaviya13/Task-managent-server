const asyncHandler = require("express-async-handler");
const User = require("../Models/user");
const Device = require("../Models/device.js");
const sendResetPasswordEmail = require("../Middlewares/sendmail.js");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const generateToken = require("../Middlewares/generateToken");
const {deleteImage} = require("../Middlewares/deleteImage");
const { deviceAddUpdate } = require("../Middlewares/addupdatedeveicedata.js");
const { ObjectId } = require("mongoose").Types;

const signupUser = asyncHandler(async (req, res) => {
  console.log("fkfjhdfkjshfskjhfd");
  console.log(req.body);

  const {
    email,
    firstName,
    lastName,
    devicetoken,
    deviceId,
    devicetype,
    password,
  } = req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !password ||
    !devicetoken ||
    !deviceId ||
    !devicetype
  ) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(200).json({
      Status: 0,
      Message: "user allready Exist Please do login",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    email,
    firstName,
    lastName,
    role: "user",
    password: hashedPassword,
  });
  if (user) {
    const device = await deviceAddUpdate({
      devicetoken: devicetoken,
      deviceId: deviceId,
      devicetype: devicetype,
      userid: user._id,
    });
    console.log("fsdkfjdshkj");
    console.log(device.status);
    // Generate a reset token and set an expiration time
    const resetToken = Math.floor(1000 + Math.random() * 9000);
    // const resetExpires = Date.now() + 300000; // 5 min

    user.otp = resetToken;

    await user.save();
    // await sendResetPasswordEmail(email, resetToken, "reset your password", req);
    return res.status(200).json({
      Status: 1,
      // Message: "Sign up Successfully",
      Message: "OTP Send Successfully",
      userid: user._id,
      otp: resetToken,
      // UserToken: generateToken(user._id),
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Something went wrong",
    });
  }
});

const getUser = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      Status: 1,
      Message: "User get Successfully",
      user: req.user,
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "User Not Found",
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  console.log("fkfjhdfkjshfskjhfd");
  console.log(req.userId);
  if (!user) {
    if (req.file) {
      deleteImage(req.file.path);
    }
    return res.status(200).json({
      Status: 0,
      Message: "User Not Found",
    });
  }

  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;

  if (req.file) {
    console.log(user.profilepic);
    if(user.profilepic){
      
      await deleteImage(user.profilepic);
    }
    console.log("Fsfjkhsdfksjhfskjhf");
    console.log(req.file.path);
    user.profilepic = req.file.path;
  }

  await user.save();

  return res.status(200).json({
    Status: 1,
    Message: "User Update Successfully",
    user: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.deleteOne({ _id: req.userId });
    return res.status(200).json({
      Status: 1,
      Message: "User Deleted successfully",
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "User Not Found",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, devicetoken, deviceId, devicetype } = req.body;

  if (!email || !password || !devicetoken || !deviceId || !devicetype) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "Email is not Registered Please register it first",
    });
  }
  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message: "This email allready login with another Method",
    });
  }
  if (user.role != "user") {
    return res.status(200).json({
      Status: 0,
      Message: "User Signup with different role",
    });
  }

  console.log(password);
  console.log(user);
  console.log(user.password);

  if (await bcrypt.compare(password, user.password)) {
    if (!user.emailverified) {
      const resetToken = Math.floor(1000 + Math.random() * 9000);
      user.otp = resetToken;
      await user.save();
      res.status(200).json({
        Status: 2,
        Message: "Please Verify your Email Otp sent to your Email Address",
        user: user._id,
        otp: resetToken,
        // UserToken: generateToken(user._id),
      });
    }

    const device = await deviceAddUpdate({
      devicetoken: devicetoken,
      deviceId: deviceId,
      devicetype: devicetype,
      userid: user._id,
    });
    console.log("fsdkfjdshkj");
    console.log(device.status);
    if (!device.status) {
      return res.status(200).json({
        Status: 0,
        Message: "Simething went wrong",
      });
    }

    res.status(200).json({
      Status: 1,
      Message: "Login successful",
      user: user,
      UserToken: generateToken(user._id),
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Invalid email or password or email not verified",
    });
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message:
        "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }
  // Generate a reset token and set an expiration time
  const resetToken = Math.floor(1000 + Math.random() * 9000);
  // const resetExpires = Date.now() + 300000; // 5 min

  user.otp = resetToken;

  await user.save();
  // await sendResetPasswordEmail(email, resetToken, "reset your password", req);
  res.status(200).json({
    Status: 1,
    Message: "otp sent successfully",
    user_id: user._id,
    otp: resetToken,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, pass_req } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    console.log(user);
    return res.status(200).json({
      Status: 0,

      Message: "Please Register first",
    });
  }

  // const user = await User.findOne({ email: email, otp: otp });

  if (user.otp == otp) {
    if (pass_req == 0) {
      user.emailverified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({
        Status: 1,
        Message: "Registration successfully",
        info: user,
        UserToken: generateToken(user._id),
      });
    }
    if (pass_req == 1) {
      user.emailverified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({
        Status: 1,
        Message: "Login successfully",
        info: user,
        UserToken: generateToken(user._id),
      });
    } else if (pass_req == 2) {
      user.emailverified = true;
      // user.otp = null;
      res.status(200).json({
        Status: 1,
        Message: "OTP verified successfully",
      });
    } else {
      res.status(200).json({
        Status: 0,
        Message: "Please provide flag",
      });
    }
  } else {
    // await User.findByIdAndDelete(user._id);
    return res.status(200).json({
      Status: 0,
      Message: "Invaild OTP",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message:
        "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }

  if (user.otp == otp) {
    if (await bcrypt.compare(password, user.password)) {
      return res.status(200).json({
        Status: 0,
        Message: "Please use different password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.otp = null;

    await user.save();
    return res.status(200).json({
      Status: 1,
      Message: "Password Changed Successfully",
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Wrong OTP",
    });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User not found",
    });
  }
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }
  // const {otp} = req.body;
  // console.log(otp);
  if (!(await bcrypt.compare(oldpassword, user.password))) {
    return res.status(200).json({
      Status: 0,
      Message: "Old password is not correct",
    });
  }

  if (await bcrypt.compare(newpassword, user.password)) {
    return res.status(200).json({
      Status: 0,
      Message: "New password and old password cannot be same",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);

  user.password = hashedPassword;
  user.resettoken = null;
  user.resettokentime = null;
  await user.save();
  res.status(200).json({
    Status: 1,
    Message: "Change password successful",
  });
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  if (user) {
    const device = await Device.findById(user.deviceid);
    if (device) {
      console.log(device);
      const newdevice = await Device.deleteOne(device._id);

      res.status(200).json({
        Status: 1,
        Message: "Logout successful",
      });
    } else {
      res.status(200).json({
        Status: 1,
        Message: "Logout successful",
      });
    }
  }

  res.status(200).json({
    Status: 0,
    Message: "Logout successful",
  });
});


const thirdpartyUser = asyncHandler(async (req, res) => {
  console.log("login_by_thirdparty api called", req.body);
  const {
    email,
    loginbythirdpartyid,
    logintype,
    fname,
    lname,
    devicetoken,
    deviceId,
    type,
  } = req.body;
  if (
    !email ||
    !loginbythirdpartyid ||
    !logintype ||
    !devicetoken ||
    !deviceId ||
    !type
  ) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    if (user.logintype != logintype) {
      return res.status(200).json({
        Status: 0,
        Message: "this emial is already login with another login method",
      });
    }
  }
  const thirdpartyuser = await User.findOne({
    loginbythirdpartyid: loginbythirdpartyid,
  });

  console.log(thirdpartyuser);
  console.log(user);
  if (thirdpartyuser) {
    if (
      thirdpartyuser.logintype == logintype &&
      thirdpartyuser.loginbythirdpartyid == loginbythirdpartyid
    ) {
      console.log(thirdpartyuser.logintype);

      const device = await deviceAddUpdate({
        devicetoken: devicetoken,
        deviceId: deviceId,
        type: type,
        userid: user._id,
      });
      console.log("fsdkfjdshkj");
      console.log(device.status);
      if (!device.status) {
        return res.status(200).json({
          Status: 0,
          Message: "Simething went wrong",
        });
      }
      res.status(200).json({
        Status: 1,
        Message: "Login successful",
        info: {
          user_id: thirdpartyuser._id,
          fname: thirdpartyuser.fname ?? "",
          lname: thirdpartyuser.lname ?? "",
          email_id: thirdpartyuser.email,
          user_role: thirdpartyuser.role,
          issignup: 0,
          UserToken: generateToken(thirdpartyuser._id),
          devicetoken: devicetoken,
        },
      });
    } else {
      return res.status(200).json({
        Status: 0,
        Message: "this emial is already login with another login method",
      });
    }
  } else {
    const emailverified = true;
    const newuser = await User.create({
      email,
      logintype,
      loginbythirdpartyid,
      emailverified,
      fname,
      lname,
    });
    console.log("dsakjdhaskjdhjk");
    console.log(newuser);
    if (newuser) {
      const device = await deviceAddUpdate({
        devicetoken: devicetoken,
        deviceId: deviceId,
        type: type,
        userid: newuser._id,
      });
      console.log("fsdkfjdshkj");
      console.log(device.status);
      if (!device.status) {
        return res.status(200).json({
          Status: 0,
          Message: "Simething went wrong",
        });
      }
      res.status(200).json({
        Status: 1,
        Message: "signup successful",
        info: {
          user_id: newuser._id,
          fname: newuser.fname ?? "",
          lname: newuser.lname ?? "",
          email_id: newuser.email,
          user_role: newuser.role,
          issignup: 1,
          UserToken: generateToken(newuser._id),
        },
      });
    }
  }
});

const users = asyncHandler(async (req, res) => {
  const users = await User.find().select("firstName lastName email");
  res.status(200).json({
    Status: 1,
    Message: "User get successful",
    info: users,
  });
});

module.exports = {
  signupUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  forgetPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  logout,

  thirdpartyUser,
  users,
};
