const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cookie = require("cookie");

//model
const User = new mongoose.Schema({
    username:{
        type: String,
        required: [true,"Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        //minlength: [8, "Password length should be 8 character long"]
    },
    customerID: {
        type: String,
        default: ""
    },
    subscription: {
        type: String,
        default: ""
    }

});

//hash password before saving
User.pre('save', async function(next) {
    //update
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();

});
//this.password=password in schema
//match password
User.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

//sign token
User.methods.getSignedToken = function(res){
    const accessToken = JWT.sign({id:this._id},process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRESIN});
    const refreshToken = JWT.sign({id:this._id},process.env.JWT_REFRESH_TOKEN, {expiresIn: process.env.JWT_REFRESH_EXPIRESIN});
    res.cookie('refreshToken',`${refreshToken}`, {maxAge:86400*7000, httpOnly:true });
}

module.exports = mongoose.model("User",User);