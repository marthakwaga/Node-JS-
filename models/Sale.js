const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const SaleSchema = new mongoose.Schema({

  saleDate: { 
    type: Date, 
    default: Date.now 
  },

  representative: {
    type: String,
    required: true
  },

  customerPhone: String,

  distance: Number,

  transportCharge: Number,

  grandTotal: Number,

  transportRequested: { 
    type: Boolean, 
    default: false 
  },

  items: [
    {
      product: String,
      qty: Number,
      price: Number,
      total: Number
    }
  ],

  createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);