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
    console.log(lowStockItems[0]); 

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

//SALES DASHBOARD
router.get('/sales_dash', async (req, res) => {
  try {
    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's sales only
    const todaySales = await Sale.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 }).lean();

    // KPI calculations
    const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    const itemsSold = todaySales.reduce((sum, sale) => {
      return sum + sale.items.reduce((s, item) => s + (item.quantity || 0), 0);
    }, 0);

    const averageSale = todaySales.length > 0 ? Math.round(todayRevenue / todaySales.length) : 0;

    const cashCollected = todaySales
      .filter(sale => sale.paymentStatus === 'paid')
      .reduce((sum, sale) => sum + (sale.amountPaid || 0), 0);

    // Recent sales for table (last 10)
    const recentSales = todaySales.slice(0, 10);

    res.render('salesdash', {
      todayRevenue,
      itemsSold,
      averageSale,
      cashCollected,
      recentSales,
      transactionCount: todaySales.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// MANAGER DASHBOARD
router.get('/manager_dash', async (req, res) => {
  try {
    // Today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Stock
    const stockItems = await Stock.find().lean();

    const totalStockValue = stockItems.reduce((sum, item) => {
      return sum + ((item.quantity || 0) * (item.costPrice || 0));
    }, 0);

    const lowStockItems = stockItems.filter(item => item.quantity < 20);

    // Today's sales
    const todaySales = await Sale.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).lean();

    const todayRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    // Pending transport
    const pendingTransport = await Sale.countDocuments({
      transportCost: { $gt: 0 },
      paymentStatus: { $ne: 'paid' }
    });

    // Recent sales for activity table
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Recent stock ins
    const recentStock = await Stock.find()
      .sort({ dateRecieved: -1 })
      .limit(5)
      .lean();

    res.render('managerdash', {
      totalStockValue,
      lowStockItems,
      lowStockCount: lowStockItems.length,
      todayRevenue,
      pendingTransport,
      recentSales,
      recentStock,
      transactionCount: todaySales.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;