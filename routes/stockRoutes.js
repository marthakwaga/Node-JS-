const express = require('express');
const router = express.Router();
const multer = require('multer');

const stock = require('../models/Stock')
const {isAttendant, isAdmin, isManager} = require('../middleware/auth');  

//Image configurations
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
let upload = multer({ storage: storage })

//Stock list
router.get('/stock_list',isManager, (req,res)=>{
    res.render('stocklist')
})
router.post('/stock_list',(req,res)=>{
    console.log(req.body);
});

//Add stock to the Db
router.get('/add_stock', (req,res)=>{
    res.render('addstock');
});
router.post('/add_stock', upload.single('itemimage'), async (req, res) => {
    try {
     const {productName, productCode,productType, quantity, unitOfMeasure, supplierName, phoneNumber, email, costPrice,tpCost, sellingPrice, itemimage } = req.body;
     const total = parseInt(quantity)*parseFloat(costPrice);
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
        comment,
        dateRecieved,
        itemimage: req.file.path
     }) 
     await newProduct.save();
      res.redirect('/add_stock')
    } catch (error) {
        res.render('addstock',{error:error.message})
    }
});

//Update stock
router.get('/stock/edit/:id', isManager,async (req, res) => { try {
    const stockItem = await Stock.findById(req.params.id);
    if (!stockItem) {
        return res.status(404).send('Stock item not found');
        res.render
    }
} catch (error) {
    console.error(error);
    res.status(500).send('Unable to find stock item from the DB');
}
});
router.post('/stock/edit/:id', isManager, async (req, res) => {
    try {
        const { } = req.body;} catch (error) {
            console.error(error);
            res.status(500).send('Unable to update stock item in the DB');
        } res.redirect('/stock/edit/:id')
    });



module.exports = router;  