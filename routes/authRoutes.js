const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration')

// Get login page
router.get('/login', (req,res)=>{
    res.render('login')
});
router.post('/login', (req,res)=>{
    console.log(req.body)
})

//Get register user page
router.get('/userreg', (req,res)=>{
    res.render('')
});
router.post('/', (req,res)=>{

    console.log(req.body)
     res.redirect('/auth/login')
})

//Supplier Registration
router.get('/supplierreg', (req,res)=>{
    res.render('supplier-registration')
});
router.post('/registration', async(req,res)=>{
    try{
        const {fullname, phoneNumber,email} = req.body;
        // check if user exists using destructuring
        let existingUser = await Registration.findOne({email:email.toLowerCase()})
        if(existingUser){
            return res.render('supplier-registration',{error: 'Email is already registered'})}
            // create a new user
            const newUser = new Registration({
                fullname,
                phoneNumber,
                email: email.toLowerCase,
                nin: nin.toUppercase
            })
             console.log(newUser)
            await newUser.save();
            res.redirect()
            res.redirect('/auth/supplier')
    } catch (error) {
        console.error(error)
        res.render('supplier-registration',{error:errot.message})
    } 
})


//Admin Dashboard route
router.get('/admindash', (req,res)=>{
    res.render('admindash')
});
router.post('/admindash', (req,res)=>{
    console.log(req.body)
})

//Sales Dashboard Route
router.get('/admindash', (req,res)=>{
    res.render('admindash')
});
router.post('/salesdash', (req,res)=>{
    console.log(req.body)
})









module.exports = router;

//Full path in routing
//Full path applies to browser URL, form action in the pug file and redirect in the routes.
//