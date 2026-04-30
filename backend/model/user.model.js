const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Admin','Superadmin'],
        required:true
    },
    profilePic:{
        type:String,
    },
    verificationOTP:{
        type:Number
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otpExpiry:{
        type:Number
    }
},{
    timestamps:true
});

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;