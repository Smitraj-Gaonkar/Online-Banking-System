const bcrypt = require('bcrypt')
const express = require('express')
const passport = require('passport')
const User = require('../models/user')

const controller = require('../controller/controller')
const services = require('../services/render');
const {ensureAuthenticated} =  require('../config/auth')
//---------------------------------------------------------------------------

const router = express();

//GET: home page
router.get('/',services.home)
router.get('/home',services.home)
router.get('/news',function(req,res){res.render('news')})
router.get('/contactUs',function(req,res){res.render('contact')})
router.get('/aboutUs',function(req,res){res.render('about')})

//----------------------------------------------------------------------ADMIN
//GET: login page
router.get('/adminLogin',function(req, res){
    return res.render('adminLogin')
});
//GET: dashboard
router.get('/admin', ensureAuthenticated, services.adminDash)
//GET: add user page
router.get("/addUser", ensureAuthenticated, services.addUser)
//GET: manage user page
router.get('/manageUser', ensureAuthenticated, services.manageUser)
//GET: user profile page
router.get('/userProfile', ensureAuthenticated, services.userProfile)
//GET: update user page
router.get('/updateUser/:id', ensureAuthenticated, services.updateUser)
//GET: change password page
router.get('/changePass', ensureAuthenticated,  services.changePassword)
//GET: delete user page
router.get("/deleteUser", ensureAuthenticated, services.deleteUser)
//GET: fund transfer page
router.get('/fund', ensureAuthenticated, services.fund)
//GET: list statement page
router.get('/listStats', ensureAuthenticated, services.listStats)
//GET: statement page
router.get('/adminStats', ensureAuthenticated, services.adminStats)


//POST: login page
router.post('/adminLogin', function (req, res, next){
    if(req.body.email=="admin"){
        passport.authenticate('local', { 
        successRedirect: '/admin',
        failureRedirect: '/adminLogin',
        failureFlash: true 
    })(req, res, next);
    }
    else{
        req.flash('error_msg','Bad credentials')
        res.redirect('/adminLogin');
    }
})
//POST: add user page
router.post('/users',controller.create)
//POST: manage user page
//router.post('/users', controller.read)
//POST: update user page
router.post('/users/:id',controller.update)
//POST: delete user page
router.delete('/users/:id',controller.delete)
//POST: change password page
router.put('/users/:id',controller.changePass)
//POST: add money page
router.post('/addMoney',controller.addMoney)
//POST: fund transfer page
router.post('/fund',controller.fund)
//POST: fund transfer confirmation page
router.post('/confirm',controller.confirm)



//-----------------------------------------------------------------------USER
//GET: dashboard
router.get('/user',  ensureAuthenticated, services.user)
//GET : my profile
router.get('/myProfile', ensureAuthenticated,  services.myProfile)
//GET : update profile
router.get('/updateProfile/:id', ensureAuthenticated,  services.updateProfile)
//GET: fund transfer page
router.get('/transfund', ensureAuthenticated, services.transfund)
//GET: statement page
router.get('/userStats', ensureAuthenticated, services.userStats)

//POST: login page
router.post('/userLogin',async function(req,res, next){
    var id, email = req.body.email
    User.findOne({email:email})
    .then(user => {
        if(user){
            id = user._id
        }
    })
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    passport.authenticate('local', { 
        successRedirect: `/user?id=${id}`,
        failureRedirect: '/',
        failureFlash: true 
        })(req, res, next);
    
})
//POST: update profile
router.post('/user/users/:id', controller.updateProfile)
//POST: fund transfer page
router.post('/transfund',controller.transfund)
//POST: fund transfer confirmation page
router.post('/confirmUser',controller.confirmUser)

//---------------------------------------------------------------------------
//GET: logout page
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg','Logged Out successfully')
    res.redirect('/home');

});

module.exports = router;
//---------------------------------------------------------------------------