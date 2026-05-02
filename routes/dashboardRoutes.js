const express = require('express');
const router = express.Router();

router.get('/admin-dash', (req,res)=>{
    res.render('admindash')
})
router.get('/sales-dash', (req,res)=>{
   res.render('salesdash')
})
router.get('/manager-dash', (req,res)=>{
   res.render('managerdash')
})

module.exports = router;