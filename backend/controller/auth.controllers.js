const userModel = require('../model/user.model');
const imagekit = require('../config/imagekit');
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
      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: '/Social-Media-Management-System/users'
      });

      imageUrl = response.url;
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

    if (!isExist.isVerified) return res.status(400).send("Verify first");

    const isMatch = await bcryptjs.compare(password, isExist.password);
    if (!isMatch) return res.status(400).send("Wrong Password");

    const token = jwt.sign({
      id: isExist._id,
      email: isExist.email,
      role: isExist.role
    }, process.env.SECRET_KEY);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    console.log("Login success:", isExist.email);
    console.log("TOKEN:", token);

    return res.redirect('/'); // ✅ STOP here

  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
const getAlluser = async(req,res)=>{
  
}
module.exports = { registerUser, verifyOtp, loginUser };