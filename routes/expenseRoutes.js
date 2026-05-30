const express = require('express');
const router = express.Router();

const Expense = require('../models/Expense');

// Load expenses page
router.get('/expenses', async (req, res) => {
  try {
    console.log('✅ Expenses route hit');
    const expenses = await Expense.find().sort({ date: -1 }).lean();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.render('expenses', { expenses, total });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Add new expense
router.post('/expenses', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    await Expense.create({
      description,
      amount: Number(amount),
      category,
      date: date || Date.now()
    });
    res.redirect('/expenses');
  } catch (error) {
    res.status(500).send('Error saving expense');
  }
});

// Delete expense
router.post('/expenses/delete/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect('/expenses');
  } catch (error) {
    res.status(500).send('Error deleting expense');
  }
});

module.exports = router;