const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale')
const Stock = require('../models/Stock')

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
        const {date, salesPerson, name, phoneNumber, item, quantity,unitprice} = req.body;
        const stockItem = await Stock.findById(item)
        if(!stockItem) return res.status(404).send('Item not found')
        if(item.quantity < quantity){
            return res.status(400).send('Not enough stock available')
        }
         // Deduct quantity sold from stock quantity and save the new quantity to the stock collection

         item.quantity -= quantity
         await item.save()

         //Record Sale
         const newSale = new Sale({
            date,
            salesPerson:req.user._id,
            name, 
            phoneNumber, 
            item: itemId,
            quantity,
            unitprice
         });
         console.log(newSale);
         await newSale.save();
         res.redirect('/inventory');
    } catch (error) {
        res.render("add_sale", {error:error.message});
    }
});

//Get sales from the Db
router.get("/inventory", (req, res) => {
  res.render("sales");
});

module.exports = router; 