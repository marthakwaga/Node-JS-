const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const saleItemSchema = new mongoose.Schema({

  product: {
    type: String,
    required: true
  },

  qty: {
    type: Number,
    required: true
  },

  unitPrice: {
    type: Number,
    required: true
  },

  total: {
    type: Number,
    required: true
  }

});

const saleSchema = new mongoose.Schema({

  saleDate: {
    type: Date,
    required: true
  },

  representative: {
    type: String,
    required: true
  },

  customerPhone: {
    type: String,
  },

  items: [saleItemSchema],

  transportFee: {
    type: Number, 
    default: 0
  },

  grandTotal: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});
module.exports = mongoose.model('Sale', saleSchema);