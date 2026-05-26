const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Stock = require('../models/Stock');

router.get('/reports', async (req, res) => {
  try {
    // Get all sales
    const sales = await Sale.find().sort({ date: -1 }).limit(100);

    // Calculate financials
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || sale.sellingprice * sale.qty || 0), 0);

    const totalCost = sales.reduce((sum, sale) => {
      return sum + ((sale.costPrice || 0) * (sale.quantity || sale.qty || 0));
    }, 0);

    const grossProfit = totalRevenue - totalCost;
    const expenses = 9200000; // You can make this dynamic later from an Expenses model
    const netProfit = grossProfit - expenses;

    // Low Stock - Safe query (no populate if not needed)
    const lowStock = await Stock.find({ quantity: { $lt: 20 } })
      .sort({ quantity: 1 })
      .limit(8);

    res.render('reports', {
      totalRevenue,
      grossProfit,
      netProfit,
      expenses,
      transactions: sales.length,
      lowStock,
      sales // Pass recent sales if needed
    });

  } catch (error) {
    console.error("Reports Error:", error);
    res.render('reports', {
      totalRevenue: 0,
      grossProfit: 0,
      netProfit: 0,
      expenses: 0,
      transactions: 0,
      lowStock: [],
      sales: [],
      error: "Failed to generate reports. Please try again."
    });
  }
});

module.exports = router;