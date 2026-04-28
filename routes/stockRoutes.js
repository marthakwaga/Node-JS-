const express = require('express');
const router = express.Router();
const stock = require('../models/Stock')

router.get('/add-stock', (req,res)=>{
    res.render('addstock')
})
router.post('/add-stock', async (req,res)=>{
    try {
     const {productName, productCode,} = req.body;
     const total = parseInt(quantity)*parseFloat(unitPrice);
     let newProduct = newProduct({
        productName,
        productName,

     }) 
     await newProduct.save();
      res.redirect('/')
    } catch (error) {
        res.render('addStock',{error:error.message})
    }
})





module.exports = router;