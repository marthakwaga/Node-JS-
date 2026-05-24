const express = require('express');
const router = express.Router();

const Deposit = require('../models/Deposit');
// const e = require('connect-flash');

// Load Deposit Page
router.get('/deposit', async (req, res) => {
  try {

    const deposits = await Deposit.find()
      .sort({ createdAt: -1 });

    res.render('deposit_scheme', {
      deposits
    });

  } catch (error) {

    console.log(error);
    res.status(500).send('Server Error');

  }
});
// Make a New Deposit
router.post('/deposit', async (req, res) => {
  try {
    console.log("🔍 Full req.body received:", JSON.stringify(req.body, null, 2)); // ← Very important for debugging

    const { 
      fullName, 
      phoneNumber, 
      depositAmount, 
      periodMonths, 
      representative, 
      notes, 
      status, 
      startDate, 
      endDate 
    } = req.body;

    // Safe conversion functions
    const safeNumber = (val, defaultValue = 0) => {
      const num = Number(val);
      return isNaN(num) || num < 0 ? defaultValue : num;
    };

    const safeDate = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    };

    const newDeposit = new Deposit({
      fullName: (fullName || '').trim(),
      phoneNumber: (phoneNumber || '').trim(),
      
      depositAmount: safeNumber(depositAmount),
      periodMonths: safeNumber(periodMonths, 1),        // default 1 month
      
      representative: (representative || '').trim() || 'N/A',
      notes: (notes || '').trim() || `Deposit received`,
      status: status || 'Active',

      amountRedeemed: 0,
      remainingAmount: safeNumber(depositAmount),       // fallback to depositAmount

      startDate: safeDate(startDate) || new Date(),
      endDate: safeDate(endDate)
    });

    // Auto-calculate endDate if missing
    if (!newDeposit.endDate && newDeposit.periodMonths > 0) {
      const end = new Date(newDeposit.startDate);
      end.setMonth(end.getMonth() + newDeposit.periodMonths);
      newDeposit.endDate = end;
    }

    await newDeposit.save();

    console.log("✅ Deposit saved successfully:", newDeposit._id);
    res.redirect('/deposit?success=true');

  } catch (error) {
    console.error('❌ Deposit save error:', error);
    res.status(500).send('Error saving deposit.');
  }
});

// Get All Deposits (for the table)
router.get('/api/deposit', async (req, res) => {
  try {
    const deposits = await Deposit.find().sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Redeem / Update Deposit (when customer uses money)
router.post('/deposit/redeem/:id', async (req, res) => {
  try {
    const { amountRedeemed } = req.body;
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) return res.status(404).send('Deposit not found');

    deposit.amountRedeemed += Number(amountRedeemed);
    deposit.remainingAmount = deposit.depositAmount - deposit.amountRedeemed;

    if (deposit.remainingAmount <= 0) {
      deposit.status = 'Redeemed';
    }

    await deposit.save();
    res.redirect('/deposit');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating deposit');
  }
});

module.exports = router;