const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    //Login Id & Password
    email : {
        type : String, required : true
    },
    password : {
        type : String, required : true
    },
    //Name
    fname : {
        type : String, required : true
    },
    mname : {
        type : String, required : true
    },
    lname : {
        type : String, required : true
    },
    //Gender, DOB, Phone
    gender : {
        type : String, required : true
    },
    birthDate : {
        type : String, required : true
    },
    phone : {
        type : Number, required : true
    },
    //Address
    address1 : {
        type : String, required : true
    },
    address2 : {
        type : String, required : true
    },
    city : {
        type : String, required : true
    },
    state : {
        type : String, required : true
    },
    zip : {
        type : Number, required : true
    },
    accountNo : {
        type : Number, required : true
    },
    balance : {
        type : Number, required : true
    },
    Date : {
        type : Date, default : Date.now
    },
});

var User = mongoose.model('User',UserSchema)
module.exports = User;