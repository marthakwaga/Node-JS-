const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const Product = require('../models/Product');


// GET All Products - Render Page
router.get('/', async (req, res) => {
  try {
    const products = await Stock.find().sort({ productName: 1 });
    res.render('products', { products, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading products');
  }
});

// API - Return JSON (Used by frontend)
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
      productType: req.body.category,
      costPrice: req.body.buyingPrice,
      sellingPrice: req.body.sellingPrice,
      quantity: req.body.stockQuantity,
      supplierName: req.body.supplierName || 'Unknown'
    });
    await product.save();
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error saving product');
  }
});

// GET Single Product for Editing
router.get('/:id', async (req, res) => {
  try {
    const product = await Stock.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Role protection middleware
const requireAdminOrManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  if (req.user.userRole === 'admin' || req.user.userRole === 'manager') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Managers and Admins only.' });
};

// UPDATE Product (Using PUT - better practice)
router.put('/:id', requireAdminOrManager, async (req, res) => {
  try {
    const updated = await Stock.findByIdAndUpdate(
      req.params.id,
      {
        productName: req.body.productName || req.body.name,
        productType: req.body.productType || req.body.category,
        costPrice: req.body.costPrice,
        sellingPrice: req.body.sellingPrice,
        quantity: req.body.quantity || req.body.stockQuantity,
        supplierName: req.body.supplierName
      },
      { new: true }
    );
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error updating product' });
  }
});

// DELETE Product
router.delete('/:id', requireAdminOrManager, async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;