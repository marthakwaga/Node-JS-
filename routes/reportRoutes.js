const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const Expense = require('../models/Expense');

router.get('/reports', async (req, res) => {
  try {
    const range = req.query.range || 'all';

    // Build date filter based on range
    const dateFilter = {};
    const now = new Date();

    if (range === 'weekly') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter.createdAt = { $gte: weekAgo };
    } else if (range === 'monthly') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter.createdAt = { $gte: monthAgo };
    }

    const sales = await Sale.find(dateFilter).sort({ createdAt: -1 }).lean();

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    const totalCost = sales.reduce((sum, sale) => {
      const saleCost = sale.items.reduce((s, item) => {
        return s + ((item.costPrice || 0) * (item.quantity || 0));
      }, 0);
      return sum + saleCost;
    }, 0);

    const grossProfit = totalRevenue - totalCost;

    // Filter expenses by range too
    const expenseFilter = {};
    if (range === 'weekly') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      expenseFilter.date = { $gte: weekAgo };
    } else if (range === 'monthly') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      expenseFilter.date = { $gte: monthAgo };
    }

    const expenseRecords = await Expense.find(expenseFilter).lean();
    const expenses = expenseRecords.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = grossProfit - expenses;

    const lowStock = await Stock.find({ quantity: { $lt: 20 } })
      .sort({ quantity: 1 })
      .limit(8)
      .lean();

    res.render('reports', {
      totalRevenue,
      grossProfit,
      netProfit,
      expenses,
      transactions: sales.length,
      lowStock,
      sales,
      range
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
      range: 'all',
      error: "Failed to generate reports. Please try again."
    });
  }
});

module.exports = router;