const express = require('express');
const router = express.Router();

// Get login page
router.get('/add-sale', (req,res)=>{
    res.render('add_sale')
});
router.post('/add_sale', (req,res)=>{
    console.log(req.body)
})
module.exports = router; 