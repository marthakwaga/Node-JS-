const express = require("express");
const router = express.Router();
const passport = require("passport");


//Importing a model
const Registration = require("../models/Registration");

//Register user page
router.get("/user_reg", (req, res) => {
  res.render("userreg");
});
router.post("/user_reg", async (req, res) => {
  try {
    const { fullName, email, password, userRole, phoneNumber, NIN } = req.body;
    //Check if user already exists
    let existingUser = await Registration.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.render("userreg", {
        error: "Email is already registered",
      });
    }
    //Create new user
    const newUser = new Registration({
      fullName,
      email: email.toLowerCase(),
      userRole,
      phoneNumber,
      NIN: NIN.toUpperCase(),
    });
    console.log(newUser);
    await Registration.register(newUser, req.body.password, (err) => {
      if (err) {
        return res.redirect("/userreg");
      }
    });
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.render("userreg", { error: error.message });
  }
});

// Get login page
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", passport.authenticate('local',{failureRedirect:'/login'}), (req, res) => {
 if(req.user.role ==='admin') {
  res.redirect('/admin-dash')
 } else if(req.user.role ==='attendant'){
  res.redirect('/sales-dash')
 } else if(req.user.role ==='manager') {
  res.redirect('/manager-dash')
 } else{
  res.redirect('/')
 }
});

//Logout Route
router.get('/logout', (req, res, next) =>{
  req.logout( (err)=>{
    if(err) {
      return next(err);
    }
    res.redirect('/')
  })
});



module.exports = router;

//Full path in routing
//Full path applies to browser URL, form action in the pug file and redirect in the routes.
//
