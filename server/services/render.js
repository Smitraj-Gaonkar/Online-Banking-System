const User = require('../models/user');
const Account = require('../models/account');

var AccountNo, noCust, noTrans, depoValue, sentValue, recvValue

//---------------------------------------------------------------------------
exports.home = (req,res)=>{
    res.render('home')
}

//-----------------------------------------------------------------------USER
exports.user = async (req,res)=>{
    const id= req.query.id
    User.findById(id)
    .then(userdata=>{
        AccountNo = userdata.accountNo
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    depoValue = Deposit(req,res)
    sentValue = Sent(req,res)
    recvValue = Recv(req,res)
    await new Promise((resolve, reject) => setTimeout(resolve, 1000)); 
    User.findById(id)
    .then(userdata=>{
        res.render('userDash', {user:userdata, depoValue, sentValue, recvValue})
    })
}

exports.myProfile = (req,res) =>{
    const id = req.query.id
    User.findById(id)
    .then(function(userdata){
        res.render('myProfile', {user:userdata})
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.updateProfile = (req,res)=>{
    const id = req.params.id
    User.findById(id)
    .then(function(userdata){
        res.render('updateProfile',{user:userdata, data:userdata})
    })
    .catch(err=>{
        res.send(err);
    }) 
}

exports.transfund = (req,res)=>{
    const id = req.query.id
    User.findById(id)
    .then(userdata=>{
        res.render('transfund',{user:userdata})
    })
    .catch(err=>{
        res.send(err)
    })
} 

exports.userStats = (req,res)=>{
    const id = req.query.id
    User.findById(id)
    .then(userdata=>{
        user = userdata
        Account.find({accountNo:userdata.accountNo})
        .then(usersdata=>{
        res.render('userStats',{users:usersdata, user})
        }) 
    })
    .catch(err=>{
        res.send(err)
    })
}

//-----------------------------------------------------------------------ADMIN
exports.adminDash = async (req, res) =>{
    User.findOne({email:"admin"})
    .then (userdata=>{
        AccountNo=userdata.accountNo 
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    noCust=Customer(req,res)
    noTrans=Transact(req,res)
    depoValue=Deposit(req,res)
    sentValue=Sent(req,res)
    recvValue=Recv(req,res)
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));  
    User.findOne({email:"admin"})
    .then (userdata=>{
        res.render('adminDash',{user:userdata, noCust, noTrans, depoValue, sentValue, recvValue}) 
    })
}

exports.addUser = (req,res)=>{
    res.render('addUser')
}

exports.manageUser = (req,res)=>{
    User.find()
    .then(function(response){
        res.render('manageUser',{users:response})
    })
    .catch(err=>{
        res.send(err);
    })
}

exports.userProfile = (req,res) =>{
    const id = req.query.id
    User.findById(id)
    .then(function(userdata){
        res.render('userProfile', {user:userdata})
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.updateUser = (req,res)=>{
    const id = req.params.id
    User.findById(id)
    .then(function(userdata){
        res.render('updateUser',{user:userdata})
    })
    .catch(err=>{
        res.send(err)
    }) 
}

exports.deleteUser = (req,res)=>{
    const id = req.query.id
    User.findById(id)
    .then(function(userdata){
        res.render('deleteUser', {user:userdata})
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.changePassword = (req,res)=>{
    const id = req.query.id
    User.findById(id)
    .then(function(userdata){
        res.render('changePass', {user:userdata})
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.fund = (req,res)=>{
    User.findOne({email:"admin"})
    .then(response=>{
        res.render('fundTransfer',{users:response})
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.listStats = (req,res)=>{
    User.find()
    .then(function(response){
        res.render('listStats',{users:response})
    })
    .catch(err=>{
        res.send(err)
    })
}

exports.adminStats = (req,res)=>{
    var num = req.query.id
    Account.find({accountNo:num})
    .then(data=>{
        res.render('adminStats',{user:data})
    })
    .catch(err=>{
        res.send(err)
    })
}

//---------------------------------------------------------------------------
function Customer(req,res){
    User.find()
    .then(userdata=>{
        noCust=userdata.length-1
    })
}
function Transact(req,res){
    Account.find({type:"Recv"})
    .then(userdata=>{
        noTrans=userdata.length
    })
}
function Deposit(req,res){
    Account.find({accountNo:AccountNo, type:"Deposit"})
    .then(accdata=>{
        depoValue=0
        for(var i=0; i<accdata.length; i++){
            depoValue = parseInt(accdata[i].value)+parseInt(depoValue)  
        } 
        return depoValue
    })
}
function Sent(req,res){
    Account.find({accountNo:AccountNo, type:"Sent"})
    .then(accdata=>{
        sentValue=0
        for(var i=0; i<accdata.length; i++){
            sentValue = parseInt(accdata[i].value)+parseInt(sentValue)  
        } 
        return sentValue
    })
}
function Recv(req,res){
    Account.find({accountNo:AccountNo, type:"Recv"})
    .then(accdata=>{
        recvValue=0
        for(var i=0; i<accdata.length; i++){
            recvValue = parseInt(accdata[i].value)+parseInt(recvValue)  
        } 
        return recvValue
    })
}
//---------------------------------------------------------------------------