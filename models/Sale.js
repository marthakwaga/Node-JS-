const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const saleSchema = new mongoose.Schema({
  saleDate: {
    type: Date,
    required: true,
    default: Date.now
  },

  representative: {
    type: String,
    required: true
  },

  customerPhone: {
    type: Number,
    required: true
  },

  items: [
    {
      code: String,
      product: String,
      qty: Number,
      unitPrice: Number,
      total: Number
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },
  transportCharge: {
    type: Number,
    required: true
  }

}, { timestamps: true }); 

saleSchema.plugin(passportLocalMongoose,{
  usernameField: 'email'
});
module.exports = mongoose.model('Sale', saleSchema);