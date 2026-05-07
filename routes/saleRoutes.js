const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale')
const Stock = require('../models/Stock')

// Todo: Add authentication middleware to restrict access to sales routes
const {isAttendant, isManager, isAdmin} = require('../middleware/auth') 

//Add sale to Db
router.get('/addsale', async(req,res)=>{
    try{
        const items = await Stock.find({quantity:{$gt:0}});
        res.render('add_sale', {items});
    }catch(error){
        res.status(500).send('server error');
        console.error('error', error.message);
    }
});
router.post('/addsale', async(req,res)=>{
    // console.log(req.body)
    try{
        const {saleDate, representative, productCode, phoneNumber, qty, unitPrice, totalPrice} = req.body;
        const stockItem = await Stock.findOne({productCode});
        if(!stockItem) return res.status(404).send('Item not found');
        if(stockItem.quantity < qty){
            return res.status(400).send('Not enough stock available');
        }
         // Deduct quantity sold from stock quantity and save the new quantity to the stock collection

         item.quantity -= quantity
         await item.save()

         //Record Sale
         const newSale = new Sale({
            saleDate,
            representative: req.user._id,
            productCode,
            phoneNumber,
            qty,
            unitPrice,
            totalPrice
         });
         console.log(newSale);
         await newSale.save().then((result)=>{
            console.log(result);}).catch((err)=>{
                console.error(err);
            });
         res.redirect('/inventory');
    } catch (error) {
        res.render("add_sale", {error:error.message});
    }
});

//Get sales from the Db
router.get("/inventory", (req, res) => {
  res.render("saleslist");
});





























//Delete Route
router.delete('/deletesale/:id', async(req,res)=>{
    try{
        await Sale.findByIdAndDelete(req.params.id);
        res.redirect('/salesList');
    }catch(error){
        console.error(error);
        res.status(500).send('Unable to delete sale from the DB');
    }
});
module.exports = router; 