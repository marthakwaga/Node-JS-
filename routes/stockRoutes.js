const express = require('express');
const router = express.Router();
const stock = require('../models/Stock')

//Stock list
router.get('/add_stock', (req,res)=>{
    res.render('addstock')
})
router.post('/add_stock',(req,res)=>{
    console.log(req.body);
});

//Add stock to the Db
router.get('/add_stock', (req,res)=>{
    res.render('addstock');
});
router.post('/add_stock', async (req,res)=>{
    try {
     const {productName, productCode,productType, quantity, unitOfMeasure, supplierName, phoneNumber, email, costPrice, sellingPrice } = req.body;
     const total = parseInt(quantity)*parseFloat(unitPrice);
     let newProduct = new Stock({
        productName,
        productCode,
        productType,
        quantity,
        unitOfMeasure,
        supplierName,
        phoneNumber,
        email,
        costPrice,
        tpCost,
        sellingPrice,
        comment
     }) 
     await newProduct.save();
      res.redirect('/add_stock')
    } catch (error) {
        res.render('addstock',{error:error.message})
    }
});
module.exports = router;