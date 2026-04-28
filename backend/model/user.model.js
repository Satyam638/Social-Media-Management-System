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
        enum:['Admin','Super Admin','user'],
        default:'user'
    }
},{
    timestamps:true
});

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;