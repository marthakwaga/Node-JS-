const express = require('express');
const router = express.Router();
const Sale = require('../models/Supplier.js');

// Supplier
router.get('/supplier', (req,res)=>{
    res.render('suppliercredit')
});
router.post('/supplier', async(req,res)=>{
    console.log(req.body)
});

module.exports = router; 