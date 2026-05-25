const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Stock = require('../models/Stock');

// GET All Products (for table)
router.get('/', async (req, res) => {
  try {
    const products = await Stock.find().sort({ productName: 1 });

    res.render('products', {
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading products');
  }
});

// API endpoint to fetch all products in JSON format, sorted by name
router.get('/api', async (req, res) => {
  try {
    const products = await Stock.find().sort({ productName: 1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// POST - Add New Product
router.post('/', async (req, res) => {
  try {
    const product = new Stock({
      productName: req.body.name,
      category: req.body.category,
      buyingPrice: req.body.buyingPrice,
      sellingPrice: req.body.sellingPrice,
      stockQuantity: req.body.stockQuantity
    });
    await product.save();
    res.redirect('/products');
  } catch (err) { 
    console.error(err);
    res.status(400).send('Error saving product');
  }
});

// GET Single Product (for editing)
router.get('/:id', async (req, res) => {
  try {
    const product = await Stock.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Stock.findByIdAndUpdate(
      req.params.id,
      {
        productName: req.body.name,
        category: req.body.category,
        buyingPrice: req.body.buyingPrice,
        sellingPrice: req.body.sellingPrice,
        stockQuantity: req.body.stockQuantity
      },
      { new: true }
    );
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating product');
  }
});
// DELETE Product
router.delete('/:id', async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;