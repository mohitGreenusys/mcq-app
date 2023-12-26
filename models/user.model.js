const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email already exists"],
    },
    password:{
        type:String,
        required:true,
        length:[6,"Password must be at least 6 characters"],
    },
    employeeId:{
        type:String,
        required:true,
        unique:[true,"Employee Id already exists"],
    },
    otp:{
        type:String,
    },
    otpExpires:{
        type:Date,
        default:Date.now,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    tests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Test",
    }],    
})

module.exports = mongoose.model("User",userSchema);