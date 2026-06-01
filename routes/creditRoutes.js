const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit.js');

// GET - Credit Dashboard
router.get('/supplier', async (req, res) => {
  try {
    const credits = await Credit.find().sort({ dueDate: 1 }).lean();

    const totalOwed = credits.reduce((sum, c) => sum + (c.balance || 0), 0);
    const totalPaid = credits.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
    const overdueCount = credits.filter(c => c.status === 'Overdue').length;

    console.log('Credits found:', credits.length);      
    console.log('Total owed:', totalOwed);               
    console.log('Total paid:', totalPaid);  

    res.render('credit', { credits, totalOwed, totalPaid, overdueCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// POST - Add New Credit (from your modal form)
// routes/supplier.js  or supplierCredit.js
router.post('/supplier', async (req, res) => {
  try {
    console.log("Received Body:", req.body);  

    const { 
      supplierName, 
      creditAmount, 
      dueDate, 
      itemsSupplied 
    } = req.body;

    // Validation
    if (!supplierName || !creditAmount || !dueDate) {
      return res.status(400).send('Missing required fields: supplierName, creditAmount, or dueDate');
    } 

    const newCredit = new Credit({
      supplierName: supplierName.trim(),
      creditAmount: Number(creditAmount),
      dueDate: new Date(dueDate),
      itemsSupplied: itemsSupplied ? JSON.parse(itemsSupplied) : [],
      amountPaid: 0, 
      balance: Number(creditAmount)
    });

    await newCredit.save();
    console.log("✅ Credit saved successfully");
    res.redirect('/supplier');

  } catch (err) {
    console.error("Error saving credit:", err);
    res.status(400).send('Error saving credit: ' + err.message);
  }
});

// POST - Record Payment
router.post('/supplier/:id/payment', async (req, res) => {
  try {
    const { paymentAmount } = req.body;
    const credit = await Credit.findById(req.params.id);

    if (!credit) return res.status(404).send('Credit not found');

    credit.amountPaid += Number(paymentAmount);
    await credit.save();

    res.redirect('/supplier');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error recording payment');
  }
});

// GET - Single Credit (for editing if needed)
router.get('/supplier/:id', async (req, res) => {
  const credit = await Credit.findById(req.params.id);
  res.json(credit);
});

// PUT - Update Credit
router.put('/supplier/:id', async (req, res) => {
  try {
    const credit = await Credit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(credit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Delete Credit
router.delete('/supplier/:id', async (req, res) => {
  await Credit.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router; 