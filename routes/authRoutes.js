const express = require('express');
const router = express.Router();

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

module.exports = router;

//Full path in routing
//Full path applies to browser URL, form action in the pug file and redirect in the routes.
//