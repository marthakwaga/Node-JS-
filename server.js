//1. Dependencies
const express = require('express');
const expressSession = require('express-session')
const path = require('path')
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();
const connectDb = require('./config/db')

//Import user model
const Registration = require('./models/Registration')
//2. Instantiations
const app = express();
const port = 3000;

//3. Configurations
connectDb();
//Set templating engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'))

//4. Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }));

//Express session configurations 
app.use(expressSession({
  secret:"secret", 
  resave: false, //we don't want to save this session
  saveUninitialized: false 
}))
app.use(passport.initialize());
app.use(passport.session());

//Passport configurations 
passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());

//5. Routes
app.use('/', require('./routes/indexRoutes'))
app.use('/', require('./routes/stockRoutes'))
app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/SaleRoutes'))

// This is the second last chunk of code
//Handling non-existent routes
app.use( (req, res)=> {
  res.status(404).send('Oops! Route not found.');
});

// 6. Bootstrapping Server
// Last line of code in this file
app.listen(port, () => console.log(`listening on port ${port}`));