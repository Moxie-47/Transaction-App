// import mongoose form 'mongoose' ;
const { Mongoose, default: mongoose } = require("mongoose");
const {schema} = Mongoose ;

const userSchema = new schema({
    userName:String,
    password:String,
    firstName:String,
    lastName:String
});

const User = mongoose.model('User', userSchema);

module.exports = {User}