const express = require('express');
const router = express.Router();

router.get('/admin_dash', (req,res)=>{
    res.render('admindash')
})
router.get('/sales_dash', (req,res)=>{
   res.render('salesdash')
})
router.get('/manager_dash', (req,res)=>{
   res.render('managerdash')
})

module.exports = router;