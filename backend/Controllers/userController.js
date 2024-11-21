const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../Middlewares/catchAsyncErrors");
const User = require("../Models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = {
    name,
    email,
    password,
  };

  const newUser=await User.create(user);
  
  sendToken(newUser, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  const options={
    expires: new Date(Date.now()),
    httpOnly: true,
  }
  if(process.env.PRODUCTION=="Production"){
    options.sameSite="none";
    options.secure=true;
  }
  res.cookie("token", null, options);

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});



exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.getAllAdminUsers = catchAsyncErrors(async (req, res, next) => {
  let users = await User.find({createdBy: req.user._id});

  users = users.filter(user => String(user._id) !== String(req.user._id));

  res.status(200).json({
    success: true,
    users,
  });
});

exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;
  const user = {
    name,
    email,
    createdBy: req.user._id,
  };
  console.log(role);
  
  if(role){
    user.role=role;
  }
  await User.create(user);
  
  res.status(200).json({
    success: true,
  });
});

exports.getAdminUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user
  });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const targetUser = await User.findById(req.params.id);
  
  if (!targetUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  if (String(targetUser.createdBy) !== String(req.user._id)) {
    return next(
      new ErrorHandler("You are not authorized to update this user", 403)
    );
  }

  const { name, email, role } = req.body;

  const newUserData = {};
  if (name){
    newUserData.name = name;
  }
  if (email){
    newUserData.email = email;
  } 
  if (role){
    newUserData.role = role;
  } 

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    return next(new ErrorHandler("User not found", 404));
  }
  
  if (String(targetUser.createdBy) !== String(req.user._id)) {
    return next(
      new ErrorHandler("You are not authorized to delete this user", 403)
    );
  }

  await User.deleteOne({ _id: targetUser._id });

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});