const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const Product = require('../models/Product');

// LOAD PAGE - Add Sale
router.get('/addsale', async (req, res) => {
  try {
    const stockItems = await Stock.find({ 
      quantity: { $gt: 0 }        // Only show items with stock
    }).sort({ productName: 1 });

    res.render('add_sale', { 
      products: stockItems 
    });

  } catch (error) {
    console.error('Error fetching stock:', error);
    res.render('add_sale', { products: [] });
  }
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
     const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
     const item = await Stock.findOne({ 
      productName: parsedItems[0].product });
    if (!item) {
      return res.status(400).send('Invalid product in items');
    }

    if (!saleDate || !representative || !items) {
      return res.status(400).send('Missing required fields');
    }
        // Convert items safely
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
    const formattedItems = parsedItems.map(item => ({
  name: item.product,
  quantity: Number(item.qty),
  unitPrice: Number(item.price),
  amount: Number(item.total)
}));

const newSale = new Sale({

  orderId: 'ORD-' + Date.now(),

  customerName:
    req.body.customerName || 'Walk-in Customer',

  customerPhone,

  items: formattedItems,

  totalAmount: itemsTotal,

  transportCost:
    Number(transportCharge) || 0,

  amountPaid: grandTotal,

  paymentStatus: 'paid'
});

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
    await newSale.save();
    console.log('Saved sale ID:', newSale._id);
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

// API to get all sales
router.get('/api', async (req, res) => {
  try {
    const sales = await Sale.find()
      .sort({ date: -1 })
      .lean();                    // Better performance
    res.json(sales);
  } catch (err) {
    res.status(500).json([]);
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