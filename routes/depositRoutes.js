const express = require('express');
const router = express.Router();

const Deposit = require('../models/Deposit');
const e = require('connect-flash');

// Load Deposit Page
router.get('/deposit', (req, res) => {
  res.render('deposit_scheme');   // your current pug file
});

// Make a New Deposit
router.post('/deposit', async (req, res) => {
  try {
    const { fullName, phoneNumber, depositAmount, periodMonths, representative, notes, status, amountRedeemed, remainingAmount, startDate, endDate } = req.body;

    const newDeposit = new Deposit({
      fullName,
      phoneNumber,
      depositAmount: Number(depositAmount),
      periodMonths: Number(periodMonths),
      representative: representative || 'N/A',
      notes: notes || `Deposit of ${depositAmount} for ${periodMonths} months received.`,
      status: status || 'Active',
      amountRedeemed: Number(amountRedeemed),
      remainingAmount: Number(remainingAmount),
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(new Date().setMonth(new Date().getMonth() + Number(periodMonths)))
    });

    await newDeposit.save();

    res.redirect('/deposit?success=true');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving deposit');
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