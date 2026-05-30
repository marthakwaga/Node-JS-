const express = require('express');
const router = express.Router();
const multer = require('multer');

const Stock = require('../models/Stock')
const {isAttendant, isAdmin, isManager} = require('../middleware/auth');  

//Image configurations
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
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

//Add stock to the Db
 const requireAdminOrManager = (req, res, next) => {
    if (!req.user) return res.status(401).send('Not logged in');
    if (req.user.userRole === 'admin' || req.user.userRole === 'manager') return next();
    return res.status(403).send('Access denied. Managers and Admins only.');
    };
router.post('/add_stock', requireAdminOrManager,upload.single('itemImage'), async (req, res) => {
    try {
     const {productName,productType, quantity, unitOfMeasure, supplierName, phoneNumber, email, costPrice, sellingPrice, itemImage, comment} = req.body;
     const total = parseInt(quantity)*parseFloat(costPrice);
     let newProduct = new Stock({
        productName,
        productType,
        quantity,
        unitOfMeasure,
        supplierName,
        phoneNumber,
        email,
        costPrice,
        sellingPrice,
        comment,
        total,
        product,
        itemImage: req.file ? req.file.path : null
     }) 
     console.log(newProduct);
     await newProduct.save();
      res.redirect('/add_stock')
    } catch (error) {
        res.render('addstock',{error:error.message})
        console.log(error);
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