const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  buyingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  minStockLevel: {
    type: Number,
    default: 15,        // Low stock alert threshold
    min: 0
  },
  unit: {
    type: String,
    default: 'pcs',
    enum: ['pcs', 'bags', 'kg', 'litres', 'rolls', 'boxes', 'bundles']
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual field for profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.buyingPrice === 0) return 0;
  return Math.round(((this.sellingPrice - this.buyingPrice) / this.buyingPrice) * 100);
});

// Virtual field for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity === 0) return 'Out of Stock';
  if (this.stockQuantity <= this.minStockLevel) return 'Low Stock';
  return 'In Stock';
});

module.exports = mongoose.model('Product', productSchema);