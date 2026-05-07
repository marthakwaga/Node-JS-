const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const Credit = require('../models/Credit');
const Registration = require('../models/Registration');  

router.get('/admin_dash', async(req,res)=>{
   try {
      let stats = {
         salesRevenue: 0,
        inventoryValue: 0,
         totalStockItems: 0,
         totalCredits: 0,
         totalUsers: 0
      };
      
      // Calculate total sales revenue
      const salesAgg = await Sale.aggregate(
         [{
            $group: {
               _id: null,
               grandTotal: { $sum: "$total" }}}]);
      stats.salesRevenue = salesAgg.length > 0 ? salesAgg[0].grandTotal: 0;

      // Calculate total inventory value
      const inventoryAgg = await Stock.aggregate(
         [{
            $group: {
               _id: null,
               totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } }
            }
         }]
      );
      stats.inventoryValue = inventoryAgg.length > 0 ? inventoryAgg[0].totalStockValue: 0;
       res.render('admindash', { stats })
   } catch (error) {
      console.log(error);
      res.status(500).send('Unable to fetch dashboard data.');
   }
   
})
router.get('/sales_dash', (req,res)=>{
   res.render('salesdash')
})
router.get('/manager_dash', (req,res)=>{
   res.render('managerdash')
})

module.exports = router;