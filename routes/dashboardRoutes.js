const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const Credit = require('../models/Credit');
const Deposit = require('../models/Deposit');
const Product = require('../models/Product');
const Reports = require('../models/Reports');
const Registration = require('../models/Registration');  

router.get('/admin_dash', async (req, res) => {
  try {

    // GET ALL SALES
    const sales = await Sale.find();

    // GET ALL STOCK
    const stockItems = await Stock.find();

    // CALCULATE TOTAL REVENUE
    const salesRevenue = sales.reduce((total, sale) => {
      return total + Number(sale.totalAmount  || 0);
    }, 0);

    // CALCULATE INVENTORY VALUE
    const inventoryValue = stockItems.reduce((total, item) => {
      return total + Number((item.quantity || 0) * (item.costPrice || 0));
    }, 0);

    // LOW STOCK ITEMS
    const lowStockItems = stockItems.filter(item => item.quantity < 20);

    // ACTIVE DEPOSITS
    const activeDeposits = await Deposit.find({ status: 'Active', endDate: { $gte: new Date() } });

    const activeDepositAmount = activeDeposits.reduce((total, deposit) => {
      return total + Number(deposit.depositAmount || 0);
    }, 0);
    
    const activeMembers = activeDeposits.length;

    // RECENT SALES
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5);

    //PENDING CREDITS
    const pendingCredits = await Credit.find({ balance: { $gt: 0 } });

    //TOTAL PENDING CREDITS
    const totalPendingCredits = pendingCredits.reduce((total, credit) => {
      return total + Number(credit.balance || 0);
    }, 0);

    //SUPPLIERS WITH OUTSTANDING CREDITS
    const pendingCreditSuppliers = pendingCredits.length;

    // SEND TO VIEW
    res.render('admindash', {
      stats: {
        salesRevenue,
        inventoryValue,
        activeDepositAmount,
        activeMembers,
        pendingCredits,
        totalPendingCredits,
        pendingCreditSuppliers,
      },
      recentSales,
      lowStockItems,
      activeDeposits,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

router.get('/sales_dash', (req,res)=>{
   res.render('salesdash')
})
router.get('/manager_dash', (req,res)=>{
   res.render('managerdash')
})

module.exports = router;