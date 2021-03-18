const bcrypt = require('bcrypt');var User = require('../models/user');
var Account = require('../models/account');
const { query } = require('express');
const { user } = require('../services/render');
var errors = []

//----------------------------------------------------------------------ADMIN
//create and save new user
exports.create = async function(req,res){
    const{  email, password, confpass, fname, mname, lname, gender, 
            birthDate, phone,address1, address2, city, state, zip} = req.body
    validCreate(req,res)
    await new Promise((resolve, reject) => setTimeout(resolve, 3000))
    errorCheck(req,res)
    if(errors.length > 0 ){
        res.render('addUser',
        {   
            errors, email, password, confpass, fname, mname, lname,
            gender, birthDate, phone, address1, address2, city, state, zip
        })  
        errors = [];
    }
    else{
        var accountNo = accounts(req,res)
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
           
                const user = new User({
                    email, password:hash, fname, mname, lname, gender, 
                    birthDate, phone, address1, address2, city, state, zip, 
                    accountNo, balance:0
                })
                user
                .save(user)
                .then(data=>{
                    req.flash('success_msg','User has been registered successfully!')
                    res.redirect("/admin/manageUser")
                })
                .catch(err=>{
                    res.status(500).send(
                        {message:err.message||"Error occured while creating a user"}
                    )
                })  
            })
        })
        const account = new Account({
            type:"Deposit", accountNo, stats:("Opening Balance"), 
            value:0, amount:0, balance:0
        })
        account.save(account)
    }
}


//retrieve and return all users/ single users
exports.read = (req,res)=>{
    if(req.query.id){
        const id=req.query.id;
        User.findById(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message:"User Not Found"})
            }else{
                res.send(data) 
            }
        })
        .catch(err=>{
            res.status(500).send({message:"Error occurred while finding user"})
        })
    }else{
        User.find()
        .then(user=>{
            res.send(user)
        })
        .catch(err=>{
            res.status(500).send({message:err.message||"Error occurred while finding user"})
        })
    }
}

//update a user by user id
exports.update = async function(req,res){
    const id = req.params.id
    validUpdate(req,res)
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    //errorCheck(req,res)
    if(errors.length > 0){ 
        var user = req.body;
        res.render("updateUser",
        {
            errors,
            user
        })  
        errors = [], user = null;
    }else{
        User.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
        .then(data=>{
        if(!data){
            res.status(400).send({message:`Cannot update user with ${id}. User not found!`})
        }
        else{ 
            req.flash('success_msg','User details are updated successfully!')
            res.redirect("/admin/manageUser")
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error occurred while updating user information"})
    })
    }
}

//delete a user by user id
exports.delete = (req,res)=>{
    const id = req.params.id;var AccountNo
    User.findByIdAndDelete(id)
    .then(data=>{
        if(!data){
            res.status(400).send({message:`Cannot delete user with ${id}. User not found!`})
        }
        else{
            AccountNo = data.accountNo
            Account.find()
            .then(docs=>{
                for(var i=0; i<docs.length; i++){
                    Account.findOneAndDelete({accountNo:AccountNo})
                    .then(userdata=>{
                        return true
                    })
                }
            })
            req.flash('success_msg','User has been deleted successfully!')
            res.redirect("/admin/manageUser")
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error occurred while deleting user"})
    })
}

//change password
exports.changePass = (req,res)=>{
    const id = req.params.id
    var user = req.body
    const {password, confpass} = req.body;
    errorCheck(req, res);
    if(errors.length > 0){
        res.render("changePass",
        {
            errors, user, password, confpass
        })  
        errors = [], user = null;
    }
    else{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                User.findByIdAndUpdate(id, {password:hash}, {useFindAndModify:false})
                .then(data=>{
                    if(!data){
                        res.status(400).send({message:`Cannot update user with ${id}. User not found!`})
                    }
                    else{ 
                        req.flash('success_msg','User password has been changed successfully!')
                        res.redirect("/admin/manageUser")
                    }
                })
                .catch(err=>{
                    res.status(500).send({message:"Error occurred while updating user information"})
                })
            })
        })  
    }
}

exports.addMoney = async function (req,res){
    var Balance = parseInt(req.body.amount)
    User.findOne({email:"admin"})
    .then(data=>{
        Balance = Balance + parseInt(data.balance)

    })
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    User.findOneAndUpdate({email:"admin"}, {balance:Balance}, {useFindAndModify:false})
    .then(data=>{
        const account = new Account({
            type:"Deposit", accountNo:data.accountNo, stats:("Deposited Money"),
            value:req.body.amount, amount:("+"+req.body.amount), balance:Balance
        })
        account.save(account)

        req.flash('success_msg','Money Added Successfully!')
        res.redirect("/admin/fund")
    })
    .catch(err=>{
        res.status(500).send({message:"Error occurred while updating user information"})
    })
}


exports.fund = function (req,res){
    const{send,recv,amount}=req.body
    User.findOne({email:"admin"})
    .then(user1data=>{
        var Balance=parseInt(user1data.balance)
        var Amount=parseInt(amount)
        if(Balance>=Amount){
            if(recv==user1data.accountNo){
                errors.push({msg:'Invalid Account No.'})
                res.render('fundTransfer', {errors, recv, amount, users:user1data})
                errors=[]
            }
            else{
            User.findOne({accountNo : recv})
            .then(user2data=>{
                if(user2data)
                    res.render('confirm',{users:user1data, user2:user2data, amount })
                else{
                    errors.push({msg:'Invalid Account No.'})
                    res.render('fundTransfer', {errors, recv, amount, users:user1data})
                    errors=[]
                }
            })
            }
        }
        else{
            errors.push({msg:'Insufficient Balance'})
            res.render('fundTransfer', {errors, recv, amount, users:user1data})
            errors=[]
        }
    })
} 

exports.confirm = (req,res)=>{
    const{sendId, sendNo, sendName, sendBal, recvId, recvNo, recvName, recvBal, amount}=req.body;
    sendBalance = parseInt(sendBal)-parseInt(amount)
    User.findByIdAndUpdate(sendId, {balance:sendBalance}, {useFindAndModify:false})
    .then(data=>{
        const account = new Account({
            type:"Sent", accountNo:sendNo, stats:("Sent to "+recvName+" (A/c no.: "+recvNo+")"),
            value:amount, amount:("-"+amount), balance:sendBalance
        })
        account.save(account)
    })
    recvBalance = parseInt(recvBal)+parseInt(amount)
    User.findByIdAndUpdate(recvId, {balance:recvBalance}, {useFindAndModify:false})
    .then(data=>{
        const account = new Account({
            type:"Deposit", accountNo:recvNo, stats:("Deposited Money"),
            value:amount, amount:("+"+amount), balance:recvBalance
        })
        account.save(account)
    })
    req.flash('success_msg','Transaction has been done successfully!')
    res.redirect("/admin/fund")
}

//-----------------------------------------------------------------------USER
exports.updateProfile = async function(req,res){
    const id = req.params.id
    User.findById(id)
    .then(userdata => {
        data = userdata
    })
    validUpdate(req,res)
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    //errorCheck(req,res)
    if(errors.length > 0){ 
        var user = req.body;
        res.render("updateProfile",
        {
            errors,
            user,
            data
        })  
        errors = [], user = null;
    }else{
        User.findByIdAndUpdate(id,req.body,{useFindAndModify:false})
        .then(data=>{
        if(!data){
            res.status(400).send({message:`Cannot update user with ${id}. User not found!`})
        }
        else{ 
            req.flash('success_msg','Updated successfully!')
            res.redirect(`/user/myProfile?id=${id}`)
        }
    })
    .catch(err=>{
        res.status(500).send({message:"Error occurred while updating user information"})
    })
    }
}

exports.transfund = function (req,res){
    const{send,recv,amount}=req.body
    User.findOne({accountNo:send})
    .then(user1data=>{
        var Balance=parseInt(user1data.balance)
        var Amount=parseInt(amount)
        if(Balance>=Amount){
            if(recv==user1data.accountNo){
                errors.push({msg:'Invalid Account No.'})
                res.render('transfund', {errors, send, recv, amount, user:user1data})
                errors=[]
            }
            else{
            User.findOne({accountNo : recv})
            .then(user2data=>{
                if(user2data)
                    res.render('confirmUser',{user:user1data, user2:user2data, amount })
                else{
                    errors.push({msg:'Invalid Account No.'})
                    res.render('transfund', {errors, send, recv, amount, user:user1data})
                    errors=[]
                }
            })
            }
        }
        else{
            errors.push({msg:'Insufficient Balance'})
            res.render('transfund', {errors, send, recv, amount, user:user1data})
            errors=[]
        }
    })
} 

exports.confirmUser = (req,res)=>{
    const{sendId, sendNo, sendName, sendBal, recvId, recvNo, recvName, recvBal, amount}=req.body;
    sendBalance = parseInt(sendBal)-parseInt(amount)
    User.findByIdAndUpdate(sendId, {balance:sendBalance}, {useFindAndModify:false})
    .then(data=>{
        const account = new Account({
            type:"Sent", accountNo:sendNo, stats:("Sent to "+recvName+" (A/c no.: "+recvNo+")"),
            value:amount, amount:("-"+amount), balance:sendBalance
        })
        account.save(account)
    })
    recvBalance = parseInt(recvBal)+parseInt(amount)
    User.findByIdAndUpdate(recvId, {balance:recvBalance}, {useFindAndModify:false})
    .then(data=>{
        const account = new Account({
            type:"Recv", accountNo:recvNo, stats:("Recevied from "+sendName+" (A/c no.: "+sendNo+")"),
            value:amount, amount:("+"+amount), balance:recvBalance
        })
        account.save(account)
    })
    req.flash('success_msg','Transaction has been done successfully!')
    res.redirect(`/user/transfund?id=${sendId}`)
}

//---------------------------------------------------------------------------

function errorCheck(req,res){
    const{password, confpass} = req.body;
    if(password.length < 6 || password.length > 13){
        errors.push({msg:'Password should be atleast 6 & atmost 12 characters'})  
    }
    if(password!=confpass){
        errors.push({msg: "Confirm password do not match"})
    }
}

function validCreate(req,res){
    const{email, phone} = req.body;
    User.findOne({email:email})
        .then(user=>{
        if(user){
            if(user.email==email)
                errors.push({msg:"Email Id already in use."})
        }
    })
    User.findOne({phone:phone})
        .then(user=>{
        if(user){
            if(user.phone==phone)
                errors.push({msg:"Phone no. already in use."})
        }
    })
}

async function validUpdate(req,res){
    var {email, phone} = req.body;
    const id = req.params.id;
    var Email, Phone;
    User.findById(id)
    .then(user=>{
        Email =  user.email;
        Phone = user.phone;
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    User.findOne({email:email})
    .then(data_1=>{
        if(data_1)
        {
            if(data_1.email==Email)
                email = Email;
            else{
                email= Email;
                errors.push({msg:'Email Id already in use'})
            }

        }
        else{
            email= Email;
        }
    })
    User.findOne({phone:phone})
    .then(data_2=>{
        if(data_2)
        {
            if(data_2.phone==Phone)
                phone = Phone;
            else{
                phone = Phone;
                errors.push({msg:'Phone no. already in use'})
            }
        }
        else{
            phone = Phone;
        }
    })
}

function accounts(req,res){
    var d = new Date()
    var account = d.toISOString().slice(0,4)+d.toISOString().slice(5,7)+d.toISOString().slice(8,10)+
    d.toISOString().slice(11,13)+d.toISOString().slice(14,16)+d.toISOString().slice(17,19)
    return account
}
//---------------------------------------------------------------------------