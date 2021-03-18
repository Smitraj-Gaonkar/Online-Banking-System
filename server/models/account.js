const mongoose = require("mongoose");

var AccountSchema = new mongoose.Schema({ 
    type : {
        type : String, required : true
    },
    accountNo : {
        type : Number, required : true
    },
    stats : {
        type : String, required : true
    },
    amount : {
        type : String, required : true
    },
    value : {
        type: Number, required : true
    },
    balance : {
        type : Number, required : true
    },
    Date : {
        type : Date, default : Date.now
    }
})

var Account = mongoose.model('Account',AccountSchema)
module.exports = Account;