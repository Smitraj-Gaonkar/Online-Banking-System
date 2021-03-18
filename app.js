if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//---------------------------------------------------------------------------

const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const session = require('express-session')
require('./server/config/passport')(passport)
//---------------------------------------------------------------------------

const app = express();

//DB config:
var db = require('./server/config/keys').MongoURI;
//DB connection:
mongoose.connect(db, {useNewUrlParser:true ,useUnifiedTopology: true, 
    useCreateIndex:true })
    .then(()=>console.log("Database Connected"))
    .catch(err=>console.log(err))

//view engine and views setup: 
app.use(expressEjsLayouts)
app.set('view engine','ejs')
    //app.set('views','./views');
app.set('views',path.resolve(__dirname + 'views')) 
app.set('layout', './layouts');

//BodyParser: GET & POST
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use('/css',express.static(path.resolve(__dirname + 'public/css')))
app.use(methodOverride('_method'))

//Express-Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized: true
}))
app.use(flash())
//Global Varibales
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Server Setup: 
    //app.listen(3000, console.log(`Server started at loacalhost:3000`))
const port = process.env.port || 3000;
app.listen(port, function(req, res){
    console.log(`Server started at port-localhost:${port}`)
})

//Routes Setup: 
var routes = require('./server/routes/index');
app.use('/', routes)
app.use('/admin', routes )
app.use('/user',routes)