const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Stock = require('../models/Stock');


// LOAD PAGE
router.get('/addsale', (req, res) => {
  res.render('add_sale');
});

// SAVE SALE
router.post('/addsale', async (req, res) => {
  try {

    const {
      saleDate,
      representative,
      customerPhone,
      distance,
      transportCharge,
      items,
      transportRequested
    } = req.body;

    if (!saleDate || !representative || !items) {
      return res.status(400).send('Missing required fields');
    }
        // Convert items safely
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    if(!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).send('Invalid items data');
    }

    // Calculate total
    let itemsTotal = 0;

    parsedItems.forEach(item => {
      itemsTotal += Number (item.total) || 0;
    });

    const grandTotal =
      itemsTotal + Number(transportCharge || 0);

    // Save sale
    const newSale = new Sale({
      saleDate,
      representative,
      customerPhone,
      distance: Number(distance) || 0,
      transportCharge: Number(transportCharge) || 0,
      transportRequested: transportRequested === 'true' || transportRequested === 'false' ? transportRequested === 'true' : false,
      items: parsedItems,
      grandTotal
    });

    await newSale.save();

    // Deduct stock
    for (const item of parsedItems) {

      const updatedStock = await Stock.findOneAndUpdate(
        { productName: item.product },
        {
          $inc: {
            quantity: -Number(item.qty)
          }
        },
        { returnDocument: 'after' }
      );
      if (!updatedStock) {
        console.warn(`Stock for product ${item.product} not found`);
      }
    }

    res.redirect(`/receipt/${newSale._id}?success=true`);

  } catch (error) {
    console.error(error);
    res.status(500).send(`
      <h2 style="color:red; text-align:center; margin-top:50px;">
        Error Saving Sale: ${error.message}
      </h2>
      <p><a href="/addsale">← Go Back</a></p>
    `);
  }
});

// Show Receipt
router.get('/receipt/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).send('Sale not found');
    }

    res.render('receipt', { sale, logoPath: '/images/logo.png'});

  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading receipt');
  }
});

module.exports = router;