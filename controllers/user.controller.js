const User = require("../models/user.model.js");
const Test = require("../models/test.model.js");
const Question = require("../models/question.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validations/joi.validations.js");
const sendOTP = require("../validations/sentOtp.js");

const routes = {};

routes.register = async (req, res) => {
    try {
        const {name, email, password, employeeId} = req.body;
        
        const {error} = registerValidation.validate(req.body);
        if (error) return res.status(200).json({ error: error.details[0].message });

        const emailExisting = await User.findOne({ email });

        if (emailExisting && emailExisting.isVerified) return res.status(200).json({ error: "Email already exists" });

        if(emailExisting){
            await emailExisting.deleteOne();
        }

        const employeeIdExists = await User.findOne({ employeeId });
        if (employeeIdExists) return res.status(200).json({ error: "Employee Id already exists" });

        const bcryptPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name,
            email,
            password: bcryptPassword,
            employeeId,
            otp: Math.floor(1000 + Math.random() * 9000),
            otpExpires: Date.now() + 10 * 60 * 1000,
        });

        return res.status(200).json({ result: user, message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.verifyOtp = async (req, res) => {
    try{
        const { id, otp } = req.body;

        if(!id || !otp) return res.status(200).json({ error: "Please enter all the fields", result: false });

        const user = await User.findById(id);

        if(user.otpExpires < Date.now()) return res.status(200).json({ error: "OTP expired", result: false });

        if(user.otp !== otp) return res.status(200).json({ error: "Invalid OTP", result: false });

        user.isVerified = true;
        
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully", result: true });
    }
    catch(error){
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.login = async (req, res) => {
    try {
        const { employeeId , password } = req.body;

        const {error} = loginValidation.validate(req.body);
        
        if (error) return res.status(200).json({ error: error.details[0].message });

        if (!employeeId || !password) return res.status(200).json({ error: "Please enter all the fields" });

        const user = await User.findOne({ employeeId });

        if (!user) return res.status(200).json({ error: "User not found" });

        if (!user.isVerified) return res.status(200).json({ error: "Please verify your email" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(200).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ result: user, token });

    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(200).json({ error: "Please enter all the fields" });

        const newOtp = Math.floor(1000 + Math.random() * 9000);

        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ error: "User not found" });

        user.otp = newOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save();


        sendOTP(user.email, newOtp, "Forgot Password OTP");

        return res.status(200).json({ message: "OTP sent successfully",id : user._id });

    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
        
    }
}

routes.resetPassword = async (req, res) => {
    try {
        const { id,password} = req.body;

        if (!id || !password) return res.status(200).json({ error: "Please enter all the fields" });

        const user = await User.findById(id);

        if (!user) return res.status(200).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) return res.status(200).json({ error: "New password cannot be same as old password" });

        const bcryptPassword = await bcrypt.hash(password, 12);
        user.password = bcryptPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password -otp -isVerified -tests");
        return res.status(200).json({ result: user });
    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.updateProfile = async (req, res) => {
    try {
        const { name, email, password, newPassword } = req.body;

        if (!name && !email && !(password && newPassword)) return res.status(200).json({ error: "Please enter all the fields" });

        const user = await User.findById(req.userId);

        if (!user) return res.status(200).json({ error: "User not found" });

        if(name) user.name = name;
        if(password && newPassword){
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(200).json({ error: "Invalid credentials" });
            const bcryptPassword = await bcrypt.hash(newPassword, 12);
            user.password = bcryptPassword;
        }

        if(email){
            if(email === user.email){
                return res.status(200).json({ error: "Email is same" });
            }

            const ifEmail = await User.findOne({ email });
            if (ifEmail) return res.status(200).json({ error: "Email already exists" });

            sendOTP(email, user.otp, "Email Verification OTP");
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            user.otp = Math.floor(1000 + Math.random() * 9000);
            await user.save();
            return res.status(200).json({ message: "OTP sent successfully",email : email });
        }

        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.verifyEmail = async (req, res) => {
    try{
        const { otp, email } = req.body;

        if( !otp || !email ) return res.status(200).json({ error: "Please enter all the fields", result: false });

        const user = await User.findById(req.userId);

        if(user.otpExpires < Date.now()) return res.status(200).json({ error: "OTP expired", result: false });

        if(user.otp !== otp) return res.status(200).json({ error: "Invalid OTP", result: false });

        // user.isVerified = true;
        user.email = email;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully", result: true });
    }
    catch(error){
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

routes.resendOtp = async (req, res) => {
    try{
        const { id } = req.body;

        if(!id) return res.status(200).json({ error: "Please enter all the fields", result: false });

        const user = await User.findById(id);

        // if(user.otpExpires < Date.now()) return res.status(200).json({ error: "OTP expired", result: false });

        user.otp = Math.floor(1000 + Math.random() * 9000);
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        sendOTP(user.email, user.otp, "Email Verification OTP");

        return res.status(200).json({ message: "OTP sent successfully", result: true });
    }
    catch(error){
        console.log(error);
        res.status(200).json({ error: "Something went wrong" });
    }
}

module.exports = routes;