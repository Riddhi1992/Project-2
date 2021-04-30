// // Project configuration file

const express = require('express'); // import express
const app = express(); // initialise app with express

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose')

const User = mongoose.model('User')


const passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      mongoSanitize         = require('express-mongo-sanitize'),
      rateLimit             = require('express-rate-limit'),
      xss                   = require('xss-clean'),
      helmet                = require('helmet');


// Logger
app.use(logger('dev'));

const expSession = require("express-session") ({
    secret:"mysecret",       //decode or encode session
    resave: false,          
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 1000 // 10 minutes
    }    
});

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));

// body parsers
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expSession);

app.set("view engine", "ejs");

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// load public (CSS, js, SCSS, images)
app.use('/css', express.static(path.resolve(__dirname, './public/css')));
app.use('/images', express.static(path.resolve(__dirname, './public/images')));
app.use('/js', express.static(path.resolve(__dirname, './public/js')));
app.use('/scss', express.static(path.resolve(__dirname, './public/scss')));

//=======================
//      O W A S P
//=======================
app.use(mongoSanitize());

// Preventing Brute Force $ DOS Attacks - Rate Limiting
const limit = rateLimit({
    max: 100,  // max requests
    windowMs: 60 * 60 * 1000,  // 1 Hour of 'ban' / lockout
    message: 'Too many requests'  // message to send
});
app.use('/routeName', limit);  // Setting limiter on specific route

// Preventing DOS Attacks - Body Parser
app.use(express.json({ limit: '10kb' }));  // Body limit is 10

// Data Sanitization against XSS attacks
app.use(xss());

// Helmet to secure connection and data
app.use(helmet());

// import our routes
const routes = require('./Routes/PostsRoutes');
// middleware to use our routes
app.use('/', routes);

// export the app
module.exports = app;