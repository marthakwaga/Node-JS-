const express = require('express');
const router = express.Router();
const stock = require('../models/Stock')

//Stock list
router.get('/add-stock', (req,res)=>{
    res.render('addstock')
})
router.post('/add-stock',(req,res)=>{
    console.log(req.body);
});

//Add stock to the Db
router.get('/add-stock', (req,res)=>{
    res.render('addstock');
});
router.post('/add-stock', async (req,res)=>{
    try {
     const {productName, productCode,productType, quantity, unitofmeasure, supplierName, phoneNumber, email, costPrice, sellingPrice } = req.body;
     const total = parseInt(quantity)*parseFloat(unitPrice);
     let newProduct = new Stock({
        productName,
        productCode,
        productType,
        quantity,
        unitofmeasure,
        supplierName,
        phoneNumber,
        email,
        costPrice,
        tpCost,
        sellingPrice
     }) 
     await newProduct.save();
      res.redirect('/')
    } catch (error) {
        res.render('addStock',{error:error.message})
    }
});
module.exports = router;