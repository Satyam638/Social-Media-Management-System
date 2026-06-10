const userModel = require('../model/user.model');
const {imagekit} = require('../config/imagekit');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')
const sendMail = require('../config/sendMail');

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔹 Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 🔹 Upload Image (optional)
    let imageUrl = '';
    if (req.file) {
      console.log(req.body);
      console.log(req.file);
      const response = await imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: req.file.originalname,
        folder: '/Social-Media-Management-System/users'
      });
      imageUrl = response.url;
      console.log("IMAGEKIT:", imagekit);
      console.log("TYPE:", typeof imagekit);
      console.log("UPLOAD:", imagekit.upload);
    }

    // 🔹 Hash Password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 🔹 Generate OTP + Expiry
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    console.log('OTP generated');
    // 🔹 Create User
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      profilePic: imageUrl,
      verificationOTP: otp,
      role: role,
      otpExpiry
    });

    // 🔹 Send Email
    const subject = "Email Verification";
    const text = `
      <h2>Your OTP: ${otp}</h2>
      <p>This OTP expires in 5 minutes</p>
    `;

    await sendMail(email, subject, text);

    // 🔹 Remove sensitive data
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePic: newUser.profilePic
    };

    res.status(201).json({
      success: true,
      message: "Check your email for OTP",
      data: userResponse
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
const verifyOtp = async (req, res) => {

  try {
    const { otp, email } = req.body;

    // check user exist or not
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User Not Found" });
    // check is otp is matched or not

    if (user.verificationOTP !== Number(otp)) return res.status(422).json("Invalid OTP");

    // check is OTP send under desired time period or not 
    if (user.otpExpiry < Date.now()) return res.status(422).json("OTP Expired");

    user.isVerified = true;
    user.verificationOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: "Email Verified Successfully, Now you can login" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isExist = await userModel.findOne({ email });
    if (!isExist) return res.status(400).send("User Not Found");

    if (!isExist.isVerified) return res.status(400).json({
      success: false,
      message: 'Please verify your email first'
    });

    if(!isExist.profilePic) console.log('Image is not set');
    else console.log('Image is set and its path is: ', isExist.profilePic);

    const isMatch = await bcryptjs.compare(password, isExist.password);
    if (!isMatch) return res.status(400).json({
      success: false,
      message: 'Incorrect email or password'
    });

    const token = jwt.sign({
      id: isExist._id,
      email: isExist.email,
      role: isExist.role
    }, process.env.SECRET_KEY,
      {
        expiresIn: '7d'
      });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("Login success:", isExist.email);
    console.log("TOKEN:", token);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully 🎉"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
const getAlluser = async (req, res) => {

}
const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user in email 
    const isEmailExist = await userModel.findOne({ email });
    if (!isEmailExist) return res.status(400).json({ success: false, message: "User Not Exist" });

    // convert password into hash password then store
    const hashpassword = await bcryptjs.hash(password, 12);

    // now update password into system
    isEmailExist.password = hashpassword;
    isEmailExist.isVerified = true;
    await isEmailExist.save();
    console.log('Password changed successfully');
    return res.status(200).json({ success: true, message: "Updated Password Successfully" });
  }
  catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }

}

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  });
  console.log('Logged out Successfully')
  return res.status(200).json({
    success: true,
    message: "Logged out Successfully"
  });
}

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id)
      .select('-password -verificationOTP -otpExpiry');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, forgotPassword, logout, getMe };